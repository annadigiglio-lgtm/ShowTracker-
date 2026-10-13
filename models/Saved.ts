// ============================================================
// REVISIONE models/Saved.ts  –  P3
// ============================================================
// ✅ Avete capito bene che servono "da guardare", "visti" e "preferiti".
// ✅ "preferiti" è una buona idea (la consegna parla di "contenuti preferiti").
//
// ❌ Come in Comment.ts: è un oggetto normale, non uno Schema mongoose.
//
// ❌ Manca il proprietario: senza un campo "user" (ObjectId, ref "User")
//    non si sa di quale utente sono queste liste.
//
// ⚠️ PROBLEMA DI PROGETTO: la consegna dice "Creazione di liste personali
//    (Da vedere, Visti, ECC.)". Con tre array fissi l'utente NON può creare
//    una lista nuova (es. "Film di Natale"): dovreste cambiare il modello.
//    Soluzione consigliata (vedi models/Lista.ts e models/Media.ts):
//      - Media: un documento per ogni film salvato, con il campo "stato" (visto / da vedere)
//      - Lista: un documento per ogni lista, con nome libero + array di Media
//    "Da vedere", "Visti" e "Preferiti" diventano liste normali, magari
//    create in automatico alla registrazione.
//    Se scegliete quella strada, questo file si può eliminare.
// ============================================================


const Saved = {
    // ⚠️ Un solo timestamp per tutto il documento non dice QUANDO è stato
    //    aggiunto ogni film. Meglio { timestamps: true } su ogni Media.
    timestamp: Date,
    // ❌ "Media" non esiste: non è definito né importato (va creato, vedi models/Media.ts).
    // ❌ Array<Media> è una sintassi dei TIPI di TypeScript, qui siete dentro un
    //    OGGETTO (valori), quindi TypeScript dà errore. In uno schema mongoose
    //    un array di riferimenti si scrive come array con dentro { type: ObjectId, ref: "Media" }.
    da_guardare: Array<Media>,
    viste: Array<Media>,
    preferiti: Array<Media>,
}

export { Saved };
