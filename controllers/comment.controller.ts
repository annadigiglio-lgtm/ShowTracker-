// ============================================================
// controllers/comment.controller.ts  –  P4 (Valutazioni e commenti)
// ============================================================
// Commenti e valutazioni si fanno solo sui contenuti SALVATI (Media)
// dall'utente. Prima di tutto controllate sempre che il Media esista
// e appartenga a req.user -> altrimenti 404.
//
// --- COMMENTI ---
// getComments        GET    /media/:mediaId/comments
//   - commenti di quel Media, ordinati dal più recente (sort createdAt -1)
//
// addComment         POST   /media/:mediaId/comments   body: content
//   - content obbligatorio e non vuoto; bonus: lunghezza massima -> 400
//   - salvare con user e media -> 201
//
// updateComment      PATCH  /comments/:id              body: content
//   - solo l'autore può modificarlo: se comment.user != req.user._id -> 403
//
// deleteComment      DELETE /comments/:id
//   - stessa regola dell'autore -> 403 se non è suo
//
// --- VALUTAZIONI ---
// setRating          PUT    /media/:mediaId/rating     body: voto
//   - voto numero tra 1 e 10 -> altrimenti 400
//   - findOneAndUpdate({ user, media }, { voto }, { upsert: true, new: true })
//     così la stessa rotta crea O aggiorna
//
// getRating          GET    /media/:mediaId/rating
//
// deleteRating       DELETE /media/:mediaId/rating
