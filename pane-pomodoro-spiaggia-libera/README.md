# Pane e Pomodoro – Spazio Libero

App comunitaria per la spiaggia pubblica di Pane e Pomodoro (Bari): aiuta chi arriva con
l'ombrellone da casa a sapere subito dove c'è spazio libero, senza dover girare a vuoto.

## Come funziona

- La spiaggia è divisa in 15 zone schematiche (3 file × 5 zone), **indicative e non una mappa GPS
  precisa** — servono solo per orientarsi ("prima fila vicino al mare", "centro", "vicino
  ingresso").
- Chiunque può toccare una zona e segnalare: 🟢 molto spazio libero, 🟠 poco spazio, 🔴 pieno,
  con una nota facoltativa (es. "poca ombra", "molto vento").
- Le segnalazioni sono condivise tra tutti tramite un piccolo backend (non solo nel tuo browser)
  e scadono dopo 45 minuti, così la mappa riflette sempre la situazione recente.
- Non c'è analisi automatica da telecamere reali: è un sistema **crowdsourced**, si aggiorna solo
  grazie alle segnalazioni delle persone.

## Avvio locale

```bash
npm install
npm run dev
```

Apri l'indirizzo mostrato in console (di norma http://localhost:3010).

I dati delle segnalazioni sono salvati in `server/data/reports.json` (creato automaticamente,
escluso da git).
