// ============================================================
// controllers/media.controller.ts  –  P3 (Contenuti salvati)
// ============================================================
// Gestisce i film/serie SALVATI dall'utente (models/Media.ts).
// REGOLA D'ORO: ogni query deve filtrare per user = req.user._id,
// così un utente non può mai vedere o modificare i contenuti di un altro.
//
// saveMedia          POST /
//   - body: tmdbId, tipo
//   - chiamare dettaglioContenuto di P2 per prendere titolo, trama, poster
//   - se già salvato -> 409
//   - creare il Media con user = req.user._id -> 201
//
// getMyMedia         GET /
//   - tutti i Media dell'utente
//   - bonus: filtro ?stato=visto / ?stato=da_vedere e ?tipo=movie/tv
//
// getMediaById       GET /:id
//   - cercare per _id E user; se non c'è -> 404
//   - id non valido (non è un ObjectId) -> 400
//
// updateStato        PATCH /:id/stato
//   - body: stato ("visto" | "da_vedere"); altri valori -> 400
//
// deleteMedia        DELETE /:id
//   - eliminare il Media
//   - toglierlo da tutte le Liste dell'utente ($pull)
//   - (da concordare con P4) eliminare anche commenti e valutazioni collegati
