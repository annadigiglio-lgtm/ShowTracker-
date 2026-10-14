// ============================================================
// models/Media.ts  –  P3 (Liste personali)   [concordare i campi con P2]
// ============================================================
// Scopo: il "contenuto salvato". È un film o una serie presa da TMDb
// che UN utente ha salvato nel proprio database personale.
//
// Campi suggeriti (vedi anche docs/modelli-dei-dati.md):
// - user        -> riferimento (ObjectId, ref "User") a chi l'ha salvato  [obbligatorio]
// - tmdbId      -> id numerico del contenuto su TMDb                      [obbligatorio]
// - tipo        -> "movie" oppure "tv" (usate un enum)                    [obbligatorio]
// - titolo, trama, posterUrl, dataUscita
// - stato       -> "da_vedere" | "visto"  (enum, default "da_vedere")
// - timestamps  -> createdAt / updatedAt (opzione { timestamps: true } di mongoose)
//
// Consigli:
// - NON salvate tutto il dettaglio TMDb (cast, trailer...): quello si richiede
//   a TMDb quando serve. Salvate solo il minimo per mostrare la lista.
// - Indice unico su (user + tmdbId + tipo): lo stesso utente non deve poter
//   salvare due volte lo stesso film.
// - Con mongoose: Schema -> model("Media", schema) -> export.
//
// Nota: il vostro models/Saved.ts ha tre array (da_guardare, viste, preferiti).
// Con questo modello lo "stato" visto/da vedere sta sul Media e le liste
// personalizzate stanno in models/Lista.ts. Decidete insieme quale approccio tenere.

import mongoose from "mongoose";

const Media = mongoose.model(
    "Media", new mongoose.Schema(
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            tmdbId: { type: Number, required: true },
            tipo: { type: String, enum: ["movie", "tv"], required: true },
            titolo: { type: String, required: true },
            trama: { type: String },
            posterUrl: { type: String },
            dataUscita: { type: Date },
            stato: { type: String, enum: ["da_vedere", "visto"], default: "da_vedere" }
        }, 
        { 
            timestamps: true 
        }
    )
);

export default Media;
