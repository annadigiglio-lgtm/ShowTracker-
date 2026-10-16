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
import type { Request, Response, NextFunction } from "express";

export const fakeAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Imposta un utente di prova (assicurati che esista nel DB)
    (req as any).user = { 
        _id: "64b8f0c2e1a2b3c4d5e6f7g8", // Sostituisci con un ID valido dal tuo DB
        username: "testuser" ,
        email: "testuser@example.com"
     };    

     console.log("Fake auth middleware: user set to", (req as any).user.username);

    next();
};