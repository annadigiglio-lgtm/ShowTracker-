// ============================================================
// controllers/lista.controller.ts  –  P3 (Liste personali)
// ============================================================
// Anche qui: filtrare SEMPRE per user = req.user._id.
//
// createLista           POST /           body: nome, descrizione?
//   - nome obbligatorio -> altrimenti 400; nome già usato -> 409; ok -> 201
//
// getMyListe            GET /
//   - tutte le liste dell'utente (magari con il numero di contenuti)
//
// getListaById          GET /:id
//   - una lista con .populate("contenuti"); se non è dell'utente -> 404
//
// updateLista           PATCH /:id       body: nome?, descrizione?
//   - aggiornare solo i campi inviati
//
// deleteLista           DELETE /:id
//   - elimina SOLO la lista, non i Media al suo interno
//
// addMediaToLista       POST /:id/media  body: mediaId
//   - controllare che il Media esista e sia dell'utente -> altrimenti 404
//   - usare $addToSet (evita i doppioni in automatico)
//
// removeMediaFromLista  DELETE /:id/media/:mediaId
//   - usare $pull
