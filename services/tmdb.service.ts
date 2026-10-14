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

import { tmdbConfig } from "../config/tmdb.config";
import { AppError } from "../utils/AppError";

const baseUrl = tmdbConfig.baseUrl;
const apiKey = tmdbConfig.apiKey;

const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // esempio, potete cambiare dimensione

export const cercaContenuti = async (query: string, tipo: "movie" | "tv" | "multi", pagina: number = 1) => {
    const url = `${baseUrl}/search/${tipo}?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${pagina}&language=it-IT`;
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404) {
            throw new AppError("Contenuto non trovato", 404);
        } else {
            throw new AppError("Errore nel servizio TMDb", 502);
        }
    }
    const data: any = await response.json();
    return data.results.map((item: any) => ({
        id: item.id,
        tipo: item.media_type,
        titolo: item.title || item.name,
        anno: item.release_date ? new Date(item.release_date).getFullYear() : null,
        poster: item.poster_path ? `${imageBaseUrl}${item.poster_path}` : null,
        votoMedio: item.vote_average
    }));
};

export const dettaglioContenuto = async (tmdbId: number, tipo: "movie" | "tv") => {
    const url = `${baseUrl}/${tipo}/${tmdbId}?api_key=${apiKey}&append_to_response=credits,videos,images&language=it-IT`;
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404) {
            throw new AppError("Contenuto non trovato", 404);
        } else {
            throw new AppError("Errore nel servizio TMDb", 502);
        }
    }
    const data: any = await response.json();
    return {
        id: data.id,
        tipo: data.media_type,
        titolo: data.title || data.name,
        trama: data.overview,
        generi: data.genres?.map((g: any) => g.name),
        data: data.release_date || data.first_air_date,
        durata: data.runtime || data.number_of_seasons,
        votoMedio: data.vote_average,
        cast: data.credits?.cast?.slice(0, 10)?.map((actor: any) => ({
            nome: actor.name,
            personaggio: actor.character
        })),
        trailer: data.videos?.results?.find(
            (v: any) => v.site === "YouTube" && v.type === "Trailer")?.key 
            ? `https://www.youtube.com/watch?v=${data.videos.results.find(
                (v: any) => v.site === "YouTube" && v.type === "Trailer").key}` 
            : null,
        immagini: {
            poster: data.poster_path ? `${imageBaseUrl}${data.poster_path}` : null,
            backdrop: data.backdrop_path ? `${imageBaseUrl}${data.backdrop_path}` : null
        }
    };
};

