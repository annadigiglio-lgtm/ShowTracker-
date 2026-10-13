// ============================================================
// REVISIONE models/Comment.ts  –  P4
// ============================================================
// ✅ Giusto avere un modello separato per i commenti.
// ✅ "content" è il campo giusto per il testo.
//
// ❌ Questo è un oggetto JavaScript normale, NON un modello del database:
//    non si può salvare, cercare o eliminare niente con lui.
//    Con mongoose serve: new Schema({...})  ->  model("Comment", schema).
//    (I tipi String e Date si scrivono già così negli schemi mongoose, quindi
//    la "forma" che avete scritto va quasi bene: va solo messa dentro uno Schema.)
//
// ❌ Mancano i collegamenti, senza questi il commento è "orfano":
//    - user  -> ObjectId con ref "User"   (CHI ha scritto il commento)
//    - media -> ObjectId con ref "Media"  (SU QUALE film/serie)
//
// ⚠️ Mettete "required: true" su content, user e media.
//    Bonus: trim e una lunghezza massima su content.
//
// ⚠️ Valutazione: la consegna chiede "commenti e valutazioni". Potete
//    aggiungere qui un campo "voto" opzionale, oppure usare models/Rating.ts.
// ============================================================


const Comment = {
    // ⚠️ Invece di un campo timestamp a mano, usate l'opzione dello schema
    //    { timestamps: true }: mongoose crea e aggiorna da solo createdAt e updatedAt.
    //    Serve anche per sapere se un commento è stato modificato.
    timestamp: Date,
    // ✅ Corretto (da rendere required).
    content: String,
}

// ⚠️ Con mongoose si esporta il model, non lo schema/oggetto.
export { Comment };
