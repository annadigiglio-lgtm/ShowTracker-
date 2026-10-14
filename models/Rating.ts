// ============================================================
// models/Rating.ts  –  P4 (Valutazioni e commenti)
// ============================================================
// Scopo: la valutazione personale di un utente su un contenuto salvato.
//
// Campi suggeriti:
// - user   -> riferimento (ObjectId, ref "User")    [obbligatorio]
// - media  -> riferimento (ObjectId, ref "Media")   [obbligatorio]
// - voto   -> numero, min 1 e max 10 (o 1-5, decidete voi)  [obbligatorio]
// - timestamps
//
// Consigli:
// - Indice unico su (user + media): una sola valutazione per utente per contenuto.
//   Se l'utente vota di nuovo, si AGGIORNA (findOneAndUpdate con upsert: true)..
//
// Nota sul vostro models/Comment.ts: oltre a timestamp e content serviranno
// anche "user" (ref User) e "media" (ref Media), altrimenti non sapete
// di chi è il commento e a quale film si riferisce.

import mongoose from "mongoose";

const Rating = mongoose.model("Rating", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    media: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
    voto: { type: Number, required: true, min: 1, max: 10 },
}, { timestamps: true }));

export default Rating;
