// $(document).ready(function(){
    var source = $('#template-film-serietv').html();    // Handlebars
    var template = Handlebars.compile(source);

    $(document).on('mouseover', '.contenuto', function() {      // quando si entra con il mouse su .contenuto prende dall'API i primi 5 attori e li aggiunge all'HTML
        var that = $(this);
        if (that.parent().parent().hasClass('ricerca-utente-film')) {   // se e' un film
            generiEAttoriFilmOSerieTV('movie', that);
        } else {                                                        // se e' una serie tv
            generiEAttoriFilmOSerieTV('tv', that);
        }
    });


    $('.fa-search').click(function() {      // al click del '.fa-search' viene inviato l'input e si visualizzano i film e le serie tv che contengono le parole inserite nell'input
        var valoreInput = $('input').val();
        if (valoreInput.trim().length > 0) {         // se l'input ha contenuto
            $('.ricerca-utente-film').empty();
            $('.ricerca-utente-serieTV').empty();
            $('select').val($('select option:first').val());    // imposto la prima opzione del filtro dei generi

            chiamataAjaxSearch('movie', valoreInput);
            chiamataAjaxSearch('tv', valoreInput);

        } else {           // se l'input non ha contenuto
            alert('Pefavore inserisci un film o serie tv');
        }
    });


    $("input").keyup(function(event) {    // quando viene rilasciato un tasto dentro 'input'
        if (event.keyCode === 13) {             // se si preme il tasto invio
            $('.fa-search').click();
        }
    });


    // $('.genre-selector').change(function() {    // quando viene selezionato un genere se il film / serie tv lo include viene mostrato altrimenti viene nascosto
    //     var selectedGenre = $(this).val();
    //     if (selectedGenre == '') {
    //         $('.info-film-serietv').show();
    //     } else {
    //         $('.info-film-serietv').each(function () {
    //             var thisAllGenere = $(this).find('.generi').text();
    //             if (thisAllGenere.includes(selectedGenre)) {
    //                 $(this).show();
    //             } else {
    //                 $(this).hide();
    //             }
    //         });
    //     }
    //
    //     if ($('.info-film-serietv').is(':visible')) {    // se dopo aver cambiato il filtro dei generi non c'e' alcun film/serie tv disponibile mostro il div nessun risultato
    //         $('.nessun-risultato').hide();
    //     } else {
    //         $('.nessun-risultato').show();
    //     }
    // });



    // FUNZIONI USATE



    function chiamataAjaxSearch(url, valoreInput) {    // FUNZIONE che richiama un film o una serie tv da API MovieDB e la visualizza a schermo (handlebars)
        var baseUrl = 'https://api.themoviedb.org/3/search/';
        $.ajax({
            url: baseUrl + url,
            data: {
                api_key: '6bd6b0823733332d6f67f8c58faac567',
                query: valoreInput,
                language: 'it-IT'
            },
            method: 'GET',
            success: function (data) {

                if (url == 'movie') {
                    var titolo = 'title';
                    var titoloOriginale = 'original_title';
                    var appendFilmOSerie = '.ricerca-utente-film';
                } else {
                    var titolo = 'name';
                    var titoloOriginale = 'original_name';
                    var appendFilmOSerie = '.ricerca-utente-serieTV';
                }

                var films = data.results;
                for (var i = 0; i < films.length; i++) {    // ciclo tutti i film trovati grazie alla ricerca
                    var film = films[i];
                    var filmGenre = film.genre_ids;

                    var valoriFilm = {
                        copertina: controlloCopertina(film),
                        copertinaNome: 'copertina di ' + film[titolo],
                        titolo: film[titolo],
                        titoloOriginale: film[titoloOriginale],
                        lingua: originalLanguageFlag(film),
                        voto: valutazioneStelle(film),
                        overview: film.overview,
                        id: film.id,
                    }

                    var filmTemplate = template(valoriFilm);
                    $(appendFilmOSerie).append(filmTemplate);
                }

                if (($('.ricerca-utente-film').is(':empty')) && ($('.ricerca-utente-serieTV').is(':empty'))) {   // se NON e' stato trovato un film/serie tv viene nascosto il pulsante 'filtra per genere' e viene mostrata la scritta 'nessun risultato'
                    $('.scelta-genere').removeClass('visible')
                    $('.nessun-risultato').show();
                } else {                                        // altrimenti  viene mostrato il pulsante 'filtra per genere' e viene nascosta la scritta 'nessun risultato'
                    $('.scelta-genere').addClass('visible');
                    $('.nessun-risultato').hide();
                }
            },
            error: function () {
                alert('errore generico');
            }
        });
    }


    function controlloCopertina(film) {      // FUNZIONE che controlla se e' presente una copertina (la visualizza) altrimenti imposta una copertina generica
        var dimensioneImmagine = 'w342';
        if (film.poster_path == null) {
            var copertina = 'img/no-image.png';
        } else {
            var copertina = 'https://image.tmdb.org/t/p/' + dimensioneImmagine + film.poster_path;
        }
        return copertina;
    }


    function originalLanguageFlag(film) {       // FUNZIONE che serve per visualizzare la bandiera dello stato da cui proviene il film / serie tv
        var lingua = '';
        var linguePresenti = ['it','en', 'fr', 'es', 'de', 'zh'];

        if (linguePresenti.includes(film.original_language)) {
            lingua += film.original_language;
        } else {
            lingua += 'world';
        }
        return lingua;
    }


    function valutazioneStelle(film) {          // FUNZIONE che serve per dare una valutazione con le stelle da 1 a 5
        var votoFilmArrotondatoDa1a5 = Math.ceil(film.vote_average / 2);
        var stelle = '';
        for (var j = 1; j <= 5; j++) {
            if (j <= votoFilmArrotondatoDa1a5) {
                stelle += ('<i class="fas fa-star"></i>');
            } else {
                stelle += ('<i class="far fa-star"></i>');
            }
        }
        return stelle;
    }


    function generiEAttoriFilmOSerieTV(movieOrTvSeries, that) {    // FUNZIONE che prende dall'API i primi 5 attori e li aggiunge all'HTML
        var idFilm = $(that).find('.id').text();
        if (($(that).find('.attori').text() == '') && ($(that).find('.generi').text() == '')) {     // se non si e' gia' entrati con il mouse su .contenuto prende dall'API i primi 5 attori e li aggiunge all'HTML e aggiunge i generi del FILM/serietv
            $.ajax({
                url: 'https://api.themoviedb.org/3/' + movieOrTvSeries + '/' + idFilm,
                data: {
                    api_key: '6bd6b0823733332d6f67f8c58faac567',
                    language: 'it-IT',
                    append_to_response: 'credits'
                },
                method: 'GET',
                success: function (data) {

                    var cast = data.credits.cast;
                    if (cast.length > 4) {  // dato che per alcuni film non sono presenti attori se non metto questo if il codice mi va in errore e non esegue la parte successiva dei generi
                        var attori = '';
                        for (var i = 0; i < 5; i++) {   // prende i primi 5 attori
                            var attore = cast[i].name;
                            attori += attore;

                            if (i < (5 - 1)) {  // per non aggiungere la virgola anche all'ultimo attore, se i < (della lunghezza dell'array -1) aggiungo una virgola altrimenti un punto
                                attori += ', ';
                            } else {
                                attori += '.';
                            }
                        }
                        $(that).find('.attori').text(attori);
                    }

                    var genereFilm = '';
                    var genres = data.genres;
                    for (var k = 0; k < genres.length; k++) {   // ciclo tutti i generi dell'API
                        var nomeGenereCicloK = genres[k].name;
                        // console.log(nomeGenereCicloK);

                        genereFilm += nomeGenereCicloK;
                        // console.log(genereFilm);     // DA USARE PER VEDERE I GENERI DEL FILM/SERIETV
                        if (k < (genres.length - 1)) {  // per non aggiungere la virgola anche all'ultimo genere, se k < (della lunghezza dell'array -1) aggiungo una virgola altrimenti un punto
                            genereFilm += ', ';
                        } else {
                            genereFilm += '.';
                        }
                    }
                    $(that).find('.generi').text(genereFilm);
                }
            });
        }
    }



// });
