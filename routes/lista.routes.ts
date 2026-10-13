// ============================================================
// routes/lista.routes.ts  –  P3 (Liste personali)
// ============================================================
// Montato su /api/liste. Tutte PROTETTE (middleware JWT).
//
// | Metodo | URL                  | Body                 | Controller           |
// |--------|----------------------|----------------------|----------------------|
// | POST   | /                    | nome, descrizione?   | createLista          |
// | GET    | /                    | -                    | getMyListe           |
// | GET    | /:id                 | -                    | getListaById         |
// | PATCH  | /:id                 | nome?, descrizione?  | updateLista          |
// | DELETE | /:id                 | -                    | deleteLista          |
// | POST   | /:id/media           | mediaId              | addMediaToLista      |
// | DELETE | /:id/media/:mediaId  | -                    | removeMediaFromLista |
