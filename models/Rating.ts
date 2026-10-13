// ============================================================
// models/Rating.ts  –  P4 (Valutazioni e commenti)
// ============================================================
// Scopo: la valutazione personale di un utente su un contenuto salvato.
//
// Campi suggeriti:
// - user   -> riferimento (ObjectId, ref "User")    [obbligatorio]
// - media  -> riferimento (ObjectId, ref "Media")   [obbligatorio]
// - voto   -> numero, min 1 e max 10 (o 1-5, decidete voi)  [obbligatorio]
// - timestamps
//
// Consigli:
// - Indice unico su (user + media): una sola valutazione per utente per contenuto.
//   Se l'utente vota di nuovo, si AGGIORNA (findOneAndUpdate con upsert: true).
//
// Alternativa più semplice: invece di un modello a parte, il voto può essere
// un campo opzionale dentro models/Comment.ts. Scegliete una delle due.
//
// Nota sul vostro models/Comment.ts: oltre a timestamp e content serviranno
// anche "user" (ref User) e "media" (ref Media), altrimenti non sapete
// di chi è il commento e a quale film si riferisce.
