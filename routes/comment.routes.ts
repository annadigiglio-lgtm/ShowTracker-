// ============================================================
// routes/comment.routes.ts  –  P4 (Valutazioni e commenti)
// ============================================================
// Montato su /api (vedi routes/index.ts). Tutte PROTETTE (middleware JWT).
//
// | Metodo | URL                         | Body     | Controller    |
// |--------|-----------------------------|----------|---------------|
// | GET    | /media/:mediaId/comments    | -        | getComments   |
// | POST   | /media/:mediaId/comments    | content  | addComment    |
// | PATCH  | /comments/:id               | content  | updateComment |
// | DELETE | /comments/:id               | -        | deleteComment |
// | GET    | /media/:mediaId/rating      | -        | getRating     |
// | PUT    | /media/:mediaId/rating      | voto     | setRating     |
// | DELETE | /media/:mediaId/rating      | -        | deleteRating  |
//
// Alternativa: dividere in due file (comment.routes.ts e rating.routes.ts).
