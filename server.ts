/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

// Gemini occasionally returns a transient 503 "UNAVAILABLE / high demand" error.
// Retry a couple of times with a short backoff before giving up.
async function generateWithRetry(ai: GoogleGenAI, params: Parameters<GoogleGenAI['models']['generateContent']>[0], maxAttempts = 3) {
  let lastError: any;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      lastError = err;
      const isRetryable = err?.status === 503;
      if (!isRetryable || attempt === maxAttempts) throw err;
      console.warn(`Gemini 503, ritento (tentativo ${attempt}/${maxAttempts})...`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError;
}

async function extractDocumentText(file: Express.Multer.File): Promise<string> {
  if (file.mimetype === 'application/pdf') {
    const parser = new PDFParse({ data: file.buffer });
    try {
      const parsed = await parser.getText();
      return parsed.text;
    } finally {
      await parser.destroy();
    }
  }
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return parsed.value;
  }
  throw new Error('UNSUPPORTED_FORMAT');
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Types
type Vector3 = { x: number; y: number; z: number };

interface Player {
  id: string;
  color: string;
  position: Vector3 | null;
  lastUpdate: number;
}

interface ForceField {
  id: string;
  position: Vector3;
  type: 'attractor' | 'repulsor';
  ownerId: string;
  createdAt: number;
  color: string;
}

// State
const players = new Map<string, Player>();
const forceFields = new Map<string, ForceField>();
const clients = new Map<string, WebSocket>();

// Colors for players
const COLORS = [
  '#FF3366', '#33CCFF', '#FF9933', '#33FF99', 
  '#CC33FF', '#FFFF33', '#FF3333', '#3333FF'
];

function broadcast(data: any, excludeId?: string) {
  const message = JSON.stringify(data);
  for (const [id, ws] of clients.entries()) {
    if (id !== excludeId && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const server = http.createServer(app);
  
  // WebSocket Server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    const player: Player = {
      id,
      color,
      position: null,
      lastUpdate: Date.now()
    };
    
    players.set(id, player);
    clients.set(id, ws);

    // Send initial state to the new client
    ws.send(JSON.stringify({
      type: 'init',
      id,
      color,
      players: Array.from(players.values()),
      forceFields: Array.from(forceFields.values())
    }));

    // Broadcast new player to others
    broadcast({
      type: 'player_joined',
      player
    }, id);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'cursor') {
          const p = players.get(id);
          if (p) {
            p.position = data.position;
            p.lastUpdate = Date.now();
          }
        } else if (data.type === 'add_force') {
          const forceId = uuidv4();
          const force: ForceField = {
            id: forceId,
            position: data.position,
            type: data.forceType,
            ownerId: id,
            createdAt: Date.now(),
            color: data.color
          };
          forceFields.set(forceId, force);
          
          // Broadcast new force field immediately
          broadcast({
            type: 'force_added',
            force
          });
        }
      } catch (e) {
        console.error('Invalid message', e);
      }
    });

    ws.on('close', () => {
      players.delete(id);
      clients.delete(id);
      
      // Remove player's force fields
      for (const [forceId, force] of forceFields.entries()) {
        if (force.ownerId === id) {
          forceFields.delete(forceId);
        }
      }

      broadcast({
        type: 'player_left',
        id
      });
    });
  });

  // Broadcast loop (20Hz)
  setInterval(() => {
    const now = Date.now();
    
    // Clean up old force fields (e.g., after 10.5 seconds to allow client animation)
    let forcesChanged = false;
    for (const [id, force] of forceFields.entries()) {
      if (now - force.createdAt > 10500) {
        forceFields.delete(id);
        forcesChanged = true;
      }
    }

    const updateData = {
      type: 'sync',
      players: Array.from(players.values()).filter(p => p.position !== null),
      ...(forcesChanged ? { forceFields: Array.from(forceFields.values()) } : {})
    };

    broadcast(updateData);
  }, 50);

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', players: players.size });
  });

  app.post('/api/audit', (req, res, next) => {
    upload.single('document')(req, res, (err) => {
      if (err) {
        const tooLarge = err.code === 'LIMIT_FILE_SIZE';
        return res.status(400).json({ error: tooLarge ? 'Il documento è troppo grande (massimo 8MB).' : 'Errore durante il caricamento del documento.' });
      }
      next();
    });
  }, async (req, res) => {
    try {
      const { companyName, sector, website, challenges, email } = req.body;

      if (!companyName || !sector || !challenges) {
        return res.status(400).json({ error: 'Campi obbligatori mancanti.' });
      }

      let documentExcerpt = '';
      let documentName = '';
      if (req.file) {
        try {
          documentExcerpt = (await extractDocumentText(req.file)).trim().slice(0, 6000);
          documentName = req.file.originalname;
        } catch (parseErr: any) {
          const unsupported = parseErr?.message === 'UNSUPPORTED_FORMAT';
          return res.status(400).json({
            error: unsupported
              ? 'Formato file non supportato. Carica un PDF o un DOCX.'
              : 'Non sono riuscito a leggere il documento caricato. Verifica che il file non sia corrotto.'
          });
        }
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'Il servizio di intelligenza artificiale non è configurato. Assicurati che GEMINI_API_KEY sia impostata nei Secrets.' 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const userPrompt = `
Genera un Audit preliminare di Marketing e AI basato sui seguenti dati forniti dal cliente:
- Nome Azienda/Professionista: ${companyName}
- Settore: ${sector}
- Sito Web/Canali Social: ${website || 'Non specificato'}
- Sfide principali o obiettivi: ${challenges}
- Email del richiedente: ${email || 'Non specificata'}
${documentExcerpt ? `
Il cliente ha inoltre caricato un documento ("${documentName}"). Ecco un estratto del suo contenuto reale:
"""
${documentExcerpt}
"""
IMPORTANTE: poiché è stato caricato un documento, aggiungi nel report una sotto-sezione dedicata chiamata "**Cosa migliorare nel documento caricato**", con 2-4 punti concreti e specifici (non generici) su cosa non funziona o si può rafforzare in quel testo — chiarezza del messaggio, struttura, coerenza con il pubblico target, eventuali lacune o incongruenze. Cita frasi o elementi reali tratti dal documento per dimostrare che l'hai letto davvero.
` : ''}`;

      const response = await generateWithRetry(ai, {
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: `
Sei l'assistente virtuale di Giuliano Kalemi, AI & Marketing Strategist con sede a Bologna, Italia.
Il tuo compito è generare un report preliminare di "Audit Marketing & AI" personalizzato, concreto ed etico per un potenziale cliente, seguendo fedelmente la filosofia di Giuliano.

Filosofia di Giuliano Kalemi:
1. "Con la parte umana al centro": L'AI non sostituisce il pensiero, lo amplifica. Priorità assoluta all'etica, alla responsabilità e alla trasparenza.
2. Niente "hype" o fuffa tecnologica. Proponi soluzioni concrete che si integrano nei flussi reali e quotidiani dell'azienda.
3. Prima la strategia, poi la tecnologia. Non proporre strumenti solo perché sono di moda.
4. Approccio informale, concreto e curioso ("come davanti a un caffè"). Il tono deve essere amichevole, professionale, diretto, chiaro, concreto, empatico e in italiano.

Struttura dell'Audit generato (usa questi esatti titoli per le sezioni):
1. **Analisi del Contesto**: Un breve commento empatico sul settore e sul posizionamento attuale dell'azienda o del professionista, evidenziando le sfide indicate e mostrando pensiero critico.
2. **Dove l'AI può portare valore reale**: 2-3 proposte specifiche e pratiche in cui l'AI può ottimizzare il loro marketing o i flussi operativi senza far perdere il tocco umano (es. automatizzare compiti ripetitivi, supportare il copywriting strategico, personalizzazione dell'esperienza cliente). Spiega il "perché" dietro a ciascuna scelta.
3. **Focus Strategico Visivo (Rendering 3D o Video Cinematografici)**: Commenta se e come possono trarre vantaggio da rendering 3D fotorealistici (immobili, spazi, design) o video cinematografici (creati con AI come Veo 3) per valorizzare la loro narrazione visiva, basandoti sul loro settore.
4. **Il Metodo Giuliano Kalemi applicato a te**: Collega i consigli pratici alle 4 fasi del metodo di Giuliano:
   - FASE 1: Audit (questo report iniziale, gratuito e senza impegno)
   - FASE 2: Strategia (definizione di workflow e strumenti su misura prima di toccare la tecnologia)
   - FASE 3: Produzione (creazione di render 3D, video o automazioni con cura dei dettagli)
   - FASE 4: Trasferimento (formazione del team per renderlo indipendente)
5. **Il Prossimo Passo (Davanti a un caffè)**: Concludi invitando il cliente a parlarne davanti a un caffè (reale a Bologna o virtuale in videochiamata) con Giuliano per un'analisi dettagliata. Ricorda di menzionare l'email di Giuliano (kalemi1994@gmail.com) e il suo profilo LinkedIn (linkedin.com/in/giulianokalemi).

Il report deve essere formattato in bellissimo Markdown chiaro e leggibile, con titoli grandi, punti elenco e grassetti, diviso in paragrafi scannabili. Evita risposte eccessivamente lunghe o generiche. Concentrati su idee specifiche per il loro settore.
`,
          temperature: 0.7,
        }
      });

      const auditText = response.text;
      res.json({ audit: auditText });

    } catch (error: any) {
      console.error('Errore durante l\'audit AI:', error);
      res.status(500).json({ error: 'Errore interno del server durante la generazione dell\'audit.' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body as { message?: string; history?: { sender: 'user' | 'bot'; text: string }[] };

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Messaggio mancante.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Il servizio di intelligenza artificiale non è configurato.' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
      const conversationContext = recentHistory
        .map((turn) => `${turn.sender === 'user' ? 'Cliente' : 'Tu'}: ${turn.text}`)
        .join('\n');

      const userPrompt = `${conversationContext ? `Conversazione finora:\n${conversationContext}\n\n` : ''}Nuovo messaggio del cliente: ${message}`;

      const response = await generateWithRetry(ai, {
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: `
Sei l'assistente virtuale (un simpatico robot) sul sito di Giuliano Kalemi, AI & Marketing Strategist con sede a Bologna, Italia.
Rispondi a nome di Giuliano in prima persona, con un tono informale, curioso, concreto, amichevole, mai "hype" o da venditore aggressivo.

Filosofia di Giuliano: l'AI amplifica il pensiero umano, non lo sostituisce. Priorità a etica, trasparenza e strategia prima della tecnologia.
Cosa fa Giuliano: strategia marketing e AI, automazione dei flussi di lavoro, rendering 3D fotorealistici, video AI cinematografici (Veo, Higgsfield), formazione dei team. Ha base a Bologna ma lavora anche da remoto.

Regole importanti per le risposte:
- Massimo 2-3 frasi brevi, perché la risposta viene anche letta ad alta voce dal robot.
- Scrivi in italiano semplice e parlato, senza markdown, senza elenchi, senza emoji.
- Se ti chiedono qualcosa che non sai o che richiede un'analisi approfondita, invita gentilmente a scrivere a kalemi1994@gmail.com o a provare l'Audit Gratuito AI sul sito.
- Non inventare prezzi, scadenze o dettagli contrattuali specifici.
`,
          temperature: 0.8,
        }
      });

      res.json({ reply: response.text });

    } catch (error: any) {
      console.error('Errore durante la chat AI:', error);
      res.status(500).json({ error: 'Errore interno del server durante la generazione della risposta.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
