# Umbrellone del Sol Salento

App di prenotazione per uno stabilimento balneare con 20 ombrelloni.

- Stagione balneare: 1 giugno – 30 settembre (calcolata automaticamente sull'anno corrente).
- Prezzo: €15/giorno nei feriali, €20/giorno nel weekend (sabato e domenica), mostrato in piccolo in fondo al modulo di prenotazione.
- Ogni prenotazione include un campo note dove il cliente può aggiungere indicazioni o informazioni (orario di arrivo, richieste particolari, ecc.).
- Demo lato client: le prenotazioni sono salvate solo nel `localStorage` del browser, non c'è backend/database condiviso.

## Avvio locale

```bash
npm install
npm run dev
```

Apri l'indirizzo mostrato in console (di norma http://localhost:5173).
