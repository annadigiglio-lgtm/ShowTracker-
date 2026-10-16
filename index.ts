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

// Timing per mostrare quanto ci è voluto
const startTime = Date.now();
const intervalId = setInterval(() => {
    const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Tentativo di connessione al DB... (${secondsElapsed} secondi trascorsi)`);
}, 1000);


// Connessione al db
connectDB()
    .then(() => {
        clearInterval(intervalId);
        console.log("\n✅ Connessione al DB stabilita!");
        app.listen(PORT, () => console.log(`🚀 Server in ascolto sulla porta ${PORT}`));
    })
    .catch((error: any) => {
        clearInterval(intervalId);
        console.log(""); // Riga vuota di separazione

        // Stampiamo SOLO stringhe ed evita di passare l'oggetto 'error'
        if (error.name === "MongoServerSelectionError" || error.message?.includes("ECONNREFUSED")) {
            console.error("❌ Impossibile connettersi a MongoDB (Server non raggiungibile).");
            console.error("👉 Assicurati che MongoDB sia avviato e in ascolto su 127.0.0.1:27017.\n");
        } else {
            // Nota: stampiamo solo error.message come stringa
            console.error(`❌ Errore di connessione: ${error.message}`);
        }

        process.exit(1);
    });