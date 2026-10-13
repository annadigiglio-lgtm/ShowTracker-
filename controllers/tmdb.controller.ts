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
