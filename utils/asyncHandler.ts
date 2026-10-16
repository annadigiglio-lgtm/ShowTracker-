// ============================================================
// utils/asyncHandler.ts  –  P4 (opzionale, usato da TUTTI)
// ============================================================
// Problema: nei controller async, se un errore non viene catturato,
// Express 4 non lo passa al middleware degli errori.
//
// Soluzione: una funzione che riceve un controller async e ne restituisce
// uno nuovo che, se la Promise fallisce, chiama next(errore).
// Così nei controller non serve scrivere try/catch ogni volta.
//
// Uso nelle routes: avvolgere il controller, es. asyncHandler(login)
//
// Nota: con Express 5 questo non serve più (gestisce da solo le Promise
// rifiutate). Controllate quale versione installate.

import type { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export { asyncHandler };
