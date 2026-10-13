// ============================================================
// routes/index.ts  –  P1 (ognuno aggiunge SOLO la propria riga)
// ============================================================
// Scopo: un unico Router "principale" che raccoglie tutti gli altri.
// Così in app.ts basta una riga:  app.use("/api", router)
//
// Righe da aggiungere (una per persona, per evitare conflitti Git):
//   router.use("/auth",     authRoutes)      -> P1
//   router.use("/tmdb",     tmdbRoutes)      -> P2
//   router.use("/media",    mediaRoutes)     -> P3
//   router.use("/liste",    listaRoutes)     -> P3
//   router.use("/",         commentRoutes)   -> P4 (contiene /media/:mediaId/comments e /comments/:id)
//
// Bonus: una rotta GET "/health" che risponde { status: "ok" },
// comoda per controllare che il server sia acceso.
