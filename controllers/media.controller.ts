// ============================================================
// controllers/media.controller.ts  –  P3 (Contenuti salvati)
// ============================================================
// Gestisce i film/serie SALVATI dall'utente (models/Media.ts).
// REGOLA D'ORO: ogni query deve filtrare per user = req.user._id,
// così un utente non può mai vedere o modificare i contenuti di un altro.
//
// saveMedia          POST /
//   - body: tmdbId, tipo
//   - chiamare dettaglioContenuto di P2 per prendere titolo, trama, poster
//   - se già salvato -> 409
//   - creare il Media con user = req.user._id -> 201
//
// getMyMedia         GET /
//   - tutti i Media dell'utente
//   - bonus: filtro ?stato=visto / ?stato=da_vedere e ?tipo=movie/tv
//
// getMediaById       GET /:id
//   - cercare per _id E user; se non c'è -> 404
//   - id non valido (non è un ObjectId) -> 400
//
// updateStato        PATCH /:id/stato
//   - body: stato ("visto" | "da_vedere"); altri valori -> 400
//
// deleteMedia        DELETE /:id
//   - eliminare il Media
//   - toglierlo da tutte le Liste dell'utente ($pull)
//   - (da concordare con P4) eliminare anche commenti e valutazioni collegati

import type { Request, Response } from "express";
import Media from "../models/Media";
import { dettaglioContenuto } from "../services/tmdb.service";
import Lista from "../models/Lista";


const saveMedia = async (req: Request, res: Response) => {
    try {
        const { tmdbId, tipo } = req.body;
        if (!tmdbId || !tipo) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const dettaglio = await dettaglioContenuto(tmdbId, tipo);
        if (!dettaglio) {
            return res.status(404).json({ message: "Content not found" });
        }
        const existingMedia = await Media.findOne({ user: (req.user as any)._id, tmdbId });
        if (existingMedia) {
            return res.status(409).json({ message: "Media already saved" });
        }
        const media = await Media.create({
            ...dettaglio,
            user: (req.user as any)._id
        });
        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ message: "Error saving media", error });
    }
};

const getMyMedia = async (req: Request, res: Response) => {
    try {
        const { stato, tipo } = req.query;
        const filter: any = { user: (req.user as any)._id };
        if (stato) filter.stato = stato;
        if (tipo) filter.tipo = tipo;
        const mediaList = await Media.find(filter);
        res.json(mediaList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching media", error });
    }
};

const getMediaById = async (req: Request, res: Response) => {
    try {
        const media = await Media.findOne({ _id: req.params.id, user: (req.user as any)._id });
        if (!media) {
            return res.status(404).json({ message: "Media not found" });
        }
        res.json(media);
    } catch (error) {
        res.status(400).json({ message: "Invalid media ID", error });
    }
};

const updateStato = async (req: Request, res: Response) => {
    try {
        const { stato } = req.body;
        if (!["visto", "da_vedere"].includes(stato)) {
            return res.status(400).json({ message: "Invalid stato value" });
        }
        const media = await Media.findOneAndUpdate(
            { _id: req.params.id, user: (req.user as any)._id },
            { stato },
            { new: true }
        );
        if (!media) {
            return res.status(404).json({ message: "Media not found" });
        }
        res.json(media);
    } catch (error) {
        res.status(400).json({ message: "Error updating media", error });
    }
};

const deleteMedia = async (req: Request, res: Response) => {
    try {
        const media = await Media.findOneAndDelete({ _id: req.params.id, user: (req.user as any)._id });
        if (!media) {
            return res.status(404).json({ message: "Media not found" });
        }
        // Rimuovere il media da tutte le liste dell'utente
        await Lista.updateMany(
            { user: (req.user as any)._id },
            { $pull: { media: media._id } }
        );
        res.json({ message: "Media deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting media", error });
    }
};

export { saveMedia, getMyMedia, getMediaById, updateStato, deleteMedia };
