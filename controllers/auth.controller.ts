// ============================================================
// controllers/auth.controller.ts  –  P1 (Gestione utenti)
// ============================================================
// Cos'è un controller? Una funzione (req, res, next) che legge la richiesta,
// usa i modelli/service e manda la risposta. Niente definizione di URL qui:
// gli URL stanno in routes/auth.routes.ts.
//
// Pacchetti: bcrypt (oppure Bun.password, già incluso in Bun), jsonwebtoken
//
// register
//   - body: nome, email, password
//   - validare: campi presenti, email valida, password lunga almeno N caratteri
//   - se l'email esiste già -> 409 Conflict
//   - fare l'HASH della password prima di salvarla (MAI in chiaro!)
//   - creare l'utente; rispondere 201 con i dati dell'utente SENZA password
//
// login
//   - body: email, password
//   - cercare l'utente per email; se non c'è -> 401 "Credenziali non valide"
//   - confrontare la password con l'hash; se sbagliata -> 401 (stesso messaggio,
//     così non si capisce se è sbagliata l'email o la password)
//   - generare il JWT con jsonwebtoken: payload { id: user._id }, secret, expiresIn
//     (valori da config/auth.config.ts)
//   - salvare il token nel campo "token" dell'utente (serve per il logout)
//   - rispondere 200 con { token }
//
// logout  (rotta protetta)
//   - l'utente arriva da req.user (lo mette Passport)
//   - impostare user.token = null e salvare
//   - da quel momento il vecchio token viene rifiutato (vedi config/passport.config.ts)
//   - rispondere 200 "Logout effettuato"
//
// me  (rotta protetta, opzionale ma comoda per i test)
//   - restituire req.user senza password
//
// Nota: utils/sign.ts non serve se usate jsonwebtoken, che firma e verifica da solo.
