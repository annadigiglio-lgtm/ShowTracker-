# User
- user_id
- email
- password
- nome
- token
- commenti

> **Revisione**
> - ✅ email, password, nome, token: giusti. Il token salvato serve per il logout.
> - ❌ `user_id`: non serve, MongoDB crea da solo `_id`.
> - ❌ `commenti`: meglio toglierli da qui. È il **Commento** che deve sapere di quale utente è (campo `user`), non il contrario.
> - ⚠️ Aggiungere `createdAt` / `updatedAt` (in automatico con `timestamps: true`).
> - ⚠️ La password si salva solo come **hash**.

# Commento
- timestamp
- contenuto

> **Revisione**
> - ✅ `contenuto`: giusto.
> - ❌ Mancano `user` (chi l'ha scritto) e `media` (su quale film/serie).
> - ⚠️ Al posto di `timestamp` usate `createdAt` / `updatedAt` automatici.
> - ⚠️ Manca la **valutazione** (voto), che la consegna chiede: potete metterla qui come campo opzionale, oppure in un modello `Rating` a parte.

# Lista salvataggi utente ->  Saved
- lista da guardare
- lista già viste
- lista preferiti

> **Revisione**
> - ❌ Manca `user`: di chi sono queste liste?
> - ⚠️ Con tre liste fisse l'utente non può crearne di nuove, ma la consegna dice *"Creazione di liste personali ("Da vedere", "Visti", **ecc.**)"*. Proposta:
>   - **Lista:** `user`, `nome` (libero), `descrizione`, `contenuti` (array di Media)
>   - lo stato **visto / da vedere** diventa un campo del Media (vedi sotto)

# Media
- tipo film/serietv
- titolo
- trama
- cast
- valutazioni
- trailer
- immagini

> **Revisione**
> - ⚠️ Questi sono i dati del **dettaglio TMDb** (quello che P2 mostra): vanno bene per la *risposta* della rotta di dettaglio, ma non vanno salvati tutti nel database. Cast, trailer e immagini si chiedono a TMDb quando servono, così sono sempre aggiornati.
> - Per il Media **salvato** nel database (contenuto salvato) servono:
>   - ❌ manca `user`: chi l'ha salvato
>   - ❌ manca `tmdbId`: senza questo non potete richiedere i dettagli a TMDb
>   - ✅ `tipo`: `"movie"` oppure `"tv"`
>   - ✅ `titolo` e `trama` (+ `posterUrl`): utili per mostrare le liste senza chiamare TMDb ogni volta
>   - ❌ manca `stato`: `"da_vedere"` oppure `"visto"`, richiesto dalla consegna
> - ⚠️ `valutazioni`: attenzione a non confondere il voto medio di TMDb (`vote_average`, solo da mostrare) con la **valutazione personale** dell'utente (va nel Commento o nel Rating).

---

## Come si collegano (chi possiede cosa)

```
User ──< Media ──< Commento / Rating
  │        ▲
  └──< Lista ┘  (una Lista contiene tanti Media)
```

`──<` vuol dire "uno a molti": un User ha molti Media, un Media ha molti Commenti, ecc.
Il collegamento si fa **sempre dal lato "molti"**: ad esempio è il Media ad avere il campo `user`, non lo User ad avere l'array dei Media.

I file con i dettagli sono in `models/` (`Media.ts`, `Lista.ts`, `Rating.ts`).
