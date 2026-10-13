// ============================================================
// models/Lista.ts  –  P3 (Liste personali)
// ============================================================
// Scopo: una lista personale creata dall'utente ("Da vedere", "Visti",
// "Preferiti", "Horror anni 80"...).
//
// Campi suggeriti:
// - user        -> riferimento (ObjectId, ref "User") al proprietario  [obbligatorio]
// - nome        -> stringa, obbligatoria, con trim                      [obbligatorio]
// - descrizione -> stringa opzionale
// - contenuti   -> array di riferimenti (ObjectId, ref "Media")
// - timestamps  -> { timestamps: true }
//
// Consigli:
// - Indice unico su (user + nome): uno stesso utente non ha due liste con lo stesso nome.
// - Per leggere i dettagli dei contenuti usate .populate("contenuti") nel controller.
// - Quando un Media viene eliminato, ricordatevi di toglierlo anche dalle liste
//   (nel controller del Media: updateMany con $pull).
// - Idea: alla registrazione si possono creare in automatico le liste
//   "Da vedere" e "Visti" (da concordare con P1).
