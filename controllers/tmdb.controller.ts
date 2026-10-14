// ============================================================
// controllers/tmdb.controller.ts  –  P2 (Integrazione TMDb)
// ============================================================
// Il controller fa da "ponte": legge i parametri dalla richiesta,
// chiama services/tmdb.service.ts e restituisce il risultato.
//
// search
//   - query string: ?query=batman&tipo=movie&page=1
//   - se manca "query" -> 400 "Parametro query obbligatorio"
//   - se "tipo" non è movie/tv/multi -> 400
//   - chiamare cercaContenuti(...) e rispondere 200 con i risultati
//
// detail
//   - parametri URL: /:tipo/:tmdbId
//   - controllare che tmdbId sia un numero e tipo sia movie o tv -> altrimenti 400
//   - chiamare dettaglioContenuto(...) e rispondere 200
//
// Errori: usate try/catch e passate l'errore a next(err)
// (oppure avvolgete la funzione con utils/asyncHandler.ts).

import type { Request, Response, NextFunction } from "express";
import { cercaContenuti, dettaglioContenuto } from "../services/tmdb.service";

const search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query, tipo = "multi", page = 1 } = req.query;

        if (!query || typeof query !== "string") {
            return res.status(400).json({ message: "Parametro query obbligatorio" });
        }
        if (!["movie", "tv", "multi"].includes(tipo as string)) {
            return res.status(400).json({ message: "Parametro tipo non valido" });
        }

        const results = await cercaContenuti(query, tipo as "movie" | "tv" | "multi", Number(page));
        res.status(200).json(results);
    } catch (error) {
        next(error);
    } 
}

const detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tipo, tmdbId } = req.params;

        if (!["movie", "tv"].includes(tipo as string)) {
            return res.status(400).json({ message: "Parametro tipo non valido" });
        }
        if (isNaN(Number(tmdbId))) {
            return res.status(400).json({ message: "Parametro tmdbId non valido" });
        }

        const result = await dettaglioContenuto(Number(tmdbId), tipo as "movie" | "tv");
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export { search, detail };