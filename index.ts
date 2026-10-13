// ============================================================
// REVISIONE index.ts  –  P1
// ============================================================
// ✅ Quasi tutto giusto: è il punto di ingresso e accende il server.
//
// ❌ Manca la connessione al database PRIMA di app.listen:
//    importare connectDB da config/db.config.ts, aspettarla (await)
//    e solo dopo chiamare app.listen. Se il DB non risponde, il server
//    non deve partire.
// ============================================================

// ✅ Import corretto dell'export di default di app.ts.
import app from './app';
import { connectDB } from './config/db.config';

// ✅ Bun legge da solo il file .env, quindi process.env.PORT funziona.
// ⚠️ process.env.PORT è una stringa, 3000 è un numero: funziona lo stesso,
//    ma per pulizia potete convertirlo in numero (Number(...)).
const PORT = process.env.PORT || 3000;

// Connessione al DB
await connectDB().then(() => {
    // ✅ Corretto. Il messaggio in console è utile per capire che il server è acceso.
    app.listen(PORT, () => console.log(`Server on :${PORT}`));
}).catch((error: Error) => {
    console.error('Errore durante la connessione al database:', error);
});
