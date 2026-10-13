// ============================================================
// services/tmdb.service.ts  –  P2 (Integrazione TMDb)
// ============================================================
// Cos'è un "service"? È il codice che parla con qualcosa di esterno
// (qui le API di TMDb). Il controller NON fa fetch direttamente:
// chiama queste funzioni. Così se TMDb cambia, si modifica solo questo file.
//
// Strumento: fetch è già disponibile in Bun (non serve axios).
// Config: importare i valori da config/tmdb.config.ts
//
// Funzioni da esportare (suggerite):
//
// 1. cercaContenuti(query, tipo, pagina)
//    - tipo: "movie" | "tv" | "multi"
//    - endpoint TMDb: GET {baseUrl}/search/{tipo}?query=...&page=...&language=...
//    - la chiave si passa come parametro "api_key" (oppure header Bearer con il token v4)
//    - restituire una lista "pulita": id, tipo, titolo (movie: title / tv: name),
//      anno, poster (URL completo con imageBaseUrl), voto medio
//
// 2. dettaglioContenuto(tipo, tmdbId)
//    - endpoint: GET {baseUrl}/{tipo}/{tmdbId}?append_to_response=credits,videos,images
//      (append_to_response = UNA sola chiamata invece di quattro)
//    - restituire: titolo, trama, generi, data, durata/stagioni, voto medio (vote_average),
//      cast (es. primi 10 attori: nome + personaggio), trailer (video con
//      site "YouTube" e type "Trailer" -> link https://www.youtube.com/watch?v=KEY),
//      immagini (poster e backdrop con URL completo)
//
// Gestione errori:
// - se la risposta non è ok (response.ok === false):
//     404 da TMDb -> lanciare un errore "Contenuto non trovato" con status 404
//     altri casi  -> errore 502 "Errore nel servizio TMDb"
//   (usate la classe di utils/AppError.ts così ci pensa il middleware degli errori)
//
// Accordo con P3: dettaglioContenuto verrà usata anche da P3 quando salva un
// contenuto nel DB, per prendere titolo/poster da TMDb. Decidete insieme
// il formato dell'oggetto restituito e non cambiatelo senza avvisare.
