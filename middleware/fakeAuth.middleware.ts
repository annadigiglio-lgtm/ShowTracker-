// ============================================================
// middleware/fakeAuth.middleware.ts  –  TEMPORANEO (P2, P3, P4)
// ============================================================
// Serve SOLO finché il vero middleware JWT di P1 non è su main
// (vedi PIPELINE.md, "Dipendenza critica").
//
// Cosa fa: una funzione (req, res, next) che imposta a mano
//   req.user = { _id: "<id di un utente di prova presente nel DB>" }
// e poi chiama next(). Nessun controllo del token.
//
// Come usarlo: nelle vostre routes al posto del middleware vero.
// Appena P1 fa il merge, sostituite l'import e CANCELLATE questo file
// (Fase 2 della pipeline). Non deve arrivare alla consegna!
