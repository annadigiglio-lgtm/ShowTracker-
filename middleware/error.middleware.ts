// ============================================================
// middleware/error.middleware.ts  –  P4 (Gestione centralizzata errori)
// ============================================================
// Cos'è? Un middleware speciale con QUATTRO parametri: (err, req, res, next).
// Express lo riconosce come gestore errori proprio perché ne ha 4.
// Tutti i controller fanno next(err) e arriva tutto qui.
//
// Va registrato in app.ts come ULTIMO app.use, dopo tutte le rotte.
//
// Cosa deve fare:
// 1. Capire lo status code:
//    - err è un AppError (utils/AppError.ts)  -> usare err.statusCode
//    - errore di validazione mongoose (name "ValidationError") -> 400
//    - id non valido mongoose (name "CastError")               -> 400
//    - chiave duplicata MongoDB (code 11000)                   -> 409
//    - JWT scaduto/non valido                                  -> 401
//    - tutto il resto                                          -> 500
// 2. Rispondere SEMPRE con lo stesso formato JSON (da decidere nella Fase 0), es.:
//      { success: false, error: { message, status } }
// 3. Fare console.error dell'errore (utile in sviluppo)
// 4. Sugli errori 500 non mandare al client lo stack trace / dettagli interni
//
// Bonus: un secondo middleware "notFound" (req, res) per le rotte inesistenti
// -> 404 "Rotta non trovata". Va messo dopo le rotte e prima di questo.

import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // utile in sviluppo

    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    } else if (err.code === 11000) {
        statusCode = 409;
        message = "Duplicate key error";
    } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Invalid or expired token";
    } else {
        statusCode = 500;
        message = "Internal Server Error";
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            status: statusCode
        }
    });
};

