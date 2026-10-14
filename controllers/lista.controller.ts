// ============================================================
// controllers/lista.controller.ts  –  P3 (Liste personali)
// ============================================================
// Anche qui: filtrare SEMPRE per user = req.user._id.
//
// createLista           POST /           body: nome, descrizione?
//   - nome obbligatorio -> altrimenti 400; nome già usato -> 409; ok -> 201
//
// getMyListe            GET /
//   - tutte le liste dell'utente (magari con il numero di contenuti)
//
// getListaById          GET /:id
//   - una lista con .populate("contenuti"); se non è dell'utente -> 404
//
// updateLista           PATCH /:id       body: nome?, descrizione?
//   - aggiornare solo i campi inviati
//
// deleteLista           DELETE /:id
//   - elimina SOLO la lista, non i Media al suo interno
//
// addMediaToLista       POST /:id/media  body: mediaId
//   - controllare che il Media esista e sia dell'utente -> altrimenti 404
//   - usare $addToSet (evita i doppioni in automatico)
//
// removeMediaFromLista  DELETE /:id/media/:mediaId
//   - usare $pull

import type { Request, Response } from "express";
import Lista from "../models/Lista";
import Media from "../models/Media";

export const createLista = async (req: Request, res: Response) => {
    try {
        const { nome, descrizione } = req.body;
        const userId = (req.user as any)._id;

        if (!nome) {
            return res.status(400).json({ message: "Nome is required" });
        }

        const existingLista = await Lista.findOne({ user: userId, nome });
        if (existingLista) {
            return res.status(409).json({ message: "Lista with this name already exists" });
        }

        const lista = await Lista.create({ nome, descrizione, user: userId });
        res.status(201).json(lista);
    } catch (error) {
        res.status(500).json({ message: "Error creating lista", error });
    }
};

export const getMyListe = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)._id;
        const liste = await Lista.find({ user: userId }).populate("contenuti");
        res.json(liste);
    } catch (error) {
        res.status(500).json({ message: "Error fetching liste", error });
    }
};

export const getListaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as any)._id;

        const lista = await Lista.findOne({ _id: id, user: userId }).populate("contenuti");
        if (!lista) {
            return res.status(404).json({ message: "Lista not found" });
        }

        res.json(lista);
    } catch (error) {
        res.status(500).json({ message: "Error fetching lista", error });
    }
};

export const updateLista = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, descrizione } = req.body;
        const userId = (req.user as any)._id;

        // Se l'utente vuole cambiare il nome, verifichiamo che non ne esista già un'altra uguale
        if (nome) {
            const existingName = await Lista.findOne({ user: userId, nome, _id: { $ne: id } });
            if (existingName) {
                return res.status(409).json({ message: "A lista with this name already exists" });
            }
        }

        const lista = await Lista.findOne({ _id: id, user: userId });
        if (!lista) {
            return res.status(404).json({ message: "Lista not found" });
        }

        if (nome !== undefined) lista.nome = nome;
        if (descrizione !== undefined) lista.descrizione = descrizione;

        await lista.save();
        res.json(lista);
    } catch (error) {
        res.status(500).json({ message: "Error updating lista", error });
    }
};

export const deleteLista = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as any)._id;

        const lista = await Lista.findOneAndDelete({ _id: id, user: userId });
        if (!lista) {
            return res.status(404).json({ message: "Lista not found" });
        }

        res.json({ message: "Lista deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting lista", error });
    }
};

export const addMediaToLista = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { mediaId } = req.body;
        const userId = (req.user as any)._id;

        if (!mediaId) {
            return res.status(400).json({ message: "mediaId is required" });
        }

        // 1. Controllo che il Media esista nel DB ed appartenga all'utente
        const media = await Media.findOne({ _id: mediaId, user: userId });
        if (!media) {
            return res.status(404).json({ message: "Media not found or does not belong to user" });
        }

        // 2. Aggiunta alla lista usando $addToSet per evitare duplicati
        const lista = await Lista.findOneAndUpdate(
            { _id: id, user: userId },
            { $addToSet: { contenuti: mediaId } },
            { new: true }
        ).populate("contenuti");

        if (!lista) {
            return res.status(404).json({ message: "Lista not found" });
        }

        res.json(lista);
    } catch (error) {
        res.status(500).json({ message: "Error adding media to lista", error });
    }
};

export const removeMediaFromLista = async (req: Request, res: Response) => {
    try {
        const { id, mediaId } = req.params;
        const userId = (req.user as any)._id;

        // Rimozione dal campo contenuti usando $pull di MongoDB
        const lista = await Lista.findOneAndUpdate(
            { _id: id, user: userId },
            { $pull: { contenuti: mediaId } },
            { new: true }
        ).populate("contenuti");

        if (!lista) {
            return res.status(404).json({ message: "Lista not found" });
        }

        res.json(lista);
    } catch (error) {
        res.status(500).json({ message: "Error removing media from lista", error });
    }
};
