// ============================================================
// routes/tmdb.routes.ts  –  P2 (Integrazione TMDb)
// ============================================================
// Montato su /api/tmdb. Tutte le rotte sono PROTETTE (middleware JWT di P1).
// Consiglio: router.use(middleware) all'inizio, così vale per tutte.
// Finché il middleware di P1 non è su main, usate middleware/fakeAuth.middleware.ts.
//
// | Metodo | URL              | Query / Params              | Controller |
// |--------|------------------|-----------------------------|------------|
// | GET    | /search          | ?query=&tipo=movie|tv&page= | search     |
// | GET    | /:tipo/:tmdbId   | tipo = movie|tv             | detail     |
//
// Attenzione all'ordine: "/search" va PRIMA di "/:tipo/:tmdbId",
// altrimenti Express potrebbe confondere le due rotte.
