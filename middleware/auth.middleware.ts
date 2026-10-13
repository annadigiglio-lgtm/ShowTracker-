// Estrae e validare il token JWT dalla richiesta HTTP, se presente.
// Se il token è valido, aggiunge le informazioni dell'utente alla richiesta e consente l'accesso alle rotte protette. Altrimenti, restituisce un errore di autorizzazione.

// ============================================================
// REVISIONE  –  P1
// ============================================================
// ✅ La descrizione è GIUSTA: è proprio quello che deve fare.
//    (piccolo refuso: "Estrae e valida", non "validare")
//
// ⚠️ Precisazione: la consegna chiede Passport.js. Quindi NON dovete
//    leggere e verificare il token a mano qui dentro: lo fa la strategia
//    JWT configurata in config/passport.config.ts.
//    Questo file diventa molto corto: esporta un middleware che chiama
//    passport.authenticate con la strategia "jwt" e { session: false }.
//
// Cosa succede in pratica:
//   - header "Authorization: Bearer <token>" assente o sbagliato -> 401 automatico
//   - token valido -> Passport mette l'utente in req.user e chiama next()
//
// ⚠️ "se presente": attenzione, sulle rotte protette il token è OBBLIGATORIO.
//    Se manca, la risposta deve essere 401, non "passa lo stesso".
//
// Priorità: è la DIPENDENZA CRITICA della pipeline -> va su main per primo.
