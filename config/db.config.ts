// ============================================================
// config/db.config.ts  –  P1 (Setup)
// ============================================================
// Scopo: collegarsi al database UNA volta all'avvio del server.
//
// Suggerimenti:
// - Libreria consigliata: mongoose  (bun add mongoose)
// - Leggete l'URI da process.env.MONGO_URI (vedi .env.example)
// - Esportate una funzione asincrona, es. "connectDB", che:
//     1. chiama mongoose.connect con l'URI
//     2. stampa in console "DB connesso" se va bene
//     3. in caso di errore stampa l'errore e chiude il processo (process.exit(1))
// - Questa funzione va chiamata in index.ts PRIMA di app.listen(...)
//   (così il server non parte se il DB non risponde)
