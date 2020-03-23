// $(document).ready(function(){
    var source = $('#template-film-serietv').html();    // Handlebars
    var template = Handlebars.compile(source);

    var valoreGenere = $('#scelta-generi').html();    // Handlebars
    var templateSceltaGenere = Handlebars.compile(valoreGenere);


    $(document).on('mouseover', '.contenuto', function() {      // quando si entra con il mouse su .contenuto prende dall'API i primi 5 attori e li aggiunge all'HTML
        var that = $(this);
        if (that.parent().parent().hasClass('ricerca-utente-film')) {   // se e' un film
            attoriFilmOSerieTV('movie', that);
        } else {                                                        // se e' una serie tv
            attoriFilmOSerieTV('tv', that);
        }
    });
    // still to fix when there are no actors


    $("input").keyup(function(event) {    // quando viene rilasciato un tasto dentro 'input'
        if (event.keyCode === 13) {             // se si preme il tasto invio
            $('.fa-search').click();
        }
    });


    $('.fa-search').click(function() {      // al click del '.fa-search' viene inviato l'input e si visualizzano i film e le serie tv che contengono le parole inserite nell'input
        var valoreInput = $('input').val();
        if (valoreInput.trim().length > 0) {         // se l'input ha contenuto
            $('.ricerca-utente-film').empty();
            $('.ricerca-utente-serieTV').empty();
            $('.genre-selector option').not('option:first').remove();   // svuoto gli eventuali contenuti dei div e rimuovo tutte le opzioni tranne la prima (perche' la prima e' il filtro generale che e' sempre presente)

            chiamataAjaxSearch('movie', valoreInput);
            chiamataAjaxSearch('tv', valoreInput);

        } else {           // se l'input non ha contenuto
            alert('Pefavore inserisci un film o serie tv');
        }
    });


    $('.genre-selector').change(function() {    // quando viene selezionato un genere se il film / serie tv lo include viene mostrato altrimenti viene nascosto
        var selectedGenre = $(this).val();
        if (selectedGenre == '') {
            $('.info-film-serietv').show();
        } else {
            $('.info-film-serietv').each(function () {
                var thisAllGenere = $(this).find('.generi').text();
                if (thisAllGenere.includes(selectedGenre)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });



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
            async: false,       // da rimuovere, trovare un altra soluzione
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
                        generi: generiCheck(filmGenre, url)
                    }

                    var filmTemplate = template(valoriFilm);
                    $(appendFilmOSerie).append(filmTemplate);
                }
                aggiungiGenereAlFiltro(url);
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


    function generiCheck(filmGenre, url) {      // Questa funzione tramuta l'ID dei vari generi di un film/serietv in valore testuale corrispondente
        var genereFilm = '';
        if (filmGenre.length > 1) {     // se c'e' piu' di un genere
            for (var j = 0; j < filmGenre.length; j++) {    // ciclo tutti i generi del film
                var genereFilmJ = filmGenre[j];
                // console.log(genereFilmJ);

                $.ajax({
                    url: 'https://api.themoviedb.org/3/genre/' + url + '/list',
                    data: {
                        api_key: '6bd6b0823733332d6f67f8c58faac567',
                        language: 'it-IT'
                    },
                    async: false,
                    method: 'GET',
                    success: function (data) {
                        var genres = data.genres;

                        // console.log(genereFilmJ);
                        // console.log(j);

                        for (var k = 0; k < genres.length; k++) {   // ciclo tutti i generi dell'API
                            var genereCicloK = genres[k].id;
                            // console.log(genereCicloK);
                            var nomeGenereCicloK = genres[k].name;
                            // console.log(nomeGenereCicloK);

                            if (genereFilmJ == genereCicloK) {  // prendo l'ID del genere del film e quando e' uguale all'ID della lista dei generi dell'API, prendo il valore testuale del genere
                                genereFilm += nomeGenereCicloK + ', ';
                                // console.log(genereFilm);     // DA USARE PER VEDERE I GENERI DEL FILM/SERIETV
                                // console.log(genereFilmJ);
                            }
                        }
                    },
                    error: function () {
                        alert('errore generico');
                    }
                });
            }
        } else if (filmGenre.length == 1) {     // se c'e' solo un genere
            // console.log(filmGenre[0]);
            // console.log('ciao');

            $.ajax({
                url: 'https://api.themoviedb.org/3/genre/' + url + '/list',
                data: {
                    api_key: '6bd6b0823733332d6f67f8c58faac567',
                    language: 'it-IT'
                },
                async: false,
                method: 'GET',
                success: function (data) {
                    var genres = data.genres;

                    // console.log(genereFilmJ);
                    // console.log(j);

                    for (var k = 0; k < genres.length; k++) {   // ciclo tutti i generi dell'API
                        var genereCicloK = genres[k].id;
                        // console.log(genereCicloK);
                        var nomeGenereCicloK = genres[k].name;
                        // console.log(nomeGenereCicloK);

                        if (filmGenre[0] == genereCicloK) {
                            genereFilm += nomeGenereCicloK + ', ';
                            // console.log(genereFilm);
                            // console.log(genereFilmJ);
                        }
                    }
                },
                error: function () {
                    alert('errore generico');
                }
            });
        }
        return genereFilm;
    }


    function aggiungiGenereAlFiltro(url) {     // FUNZIONE che cicla tutti i generi dell'API e aggiunge al filtro 'genre-selector' i generi che trova tra i film / serie tv
        $.ajax({
            url: 'https://api.themoviedb.org/3/genre/' + url + '/list',
            data: {
                api_key: '6bd6b0823733332d6f67f8c58faac567',
                language: 'it-IT'
            },
            async: false,
            method: 'GET',
            success: function (data) {
                var genres = data.genres;


                var contenutoGeneri = $('.contenuto .generi').text();
                var controlloPresenzaGenere = $('.genre-selector option').text();

                for (var k = 0; k < genres.length; k++) {   // ciclo tutti i generi dell'API
                    var nomeGenereCicloK = genres[k].name;

                    var popoloGeneri = {
                        valoreGenere: nomeGenereCicloK
                    }

                    if ((contenutoGeneri.includes(nomeGenereCicloK)) && (!(controlloPresenzaGenere.includes(nomeGenereCicloK)))) {  // SE tra i film/serie tv e' presente il genere E SE il genere NON e' stato gia' aggiunto tra le opzioni, aggiunge il genere alle opzioni
                        var genereTemplate = templateSceltaGenere(popoloGeneri);
                        $('.genre-selector').append(genereTemplate);
                    }
                }
            },
            error: function () {
                alert('errore generico');
            }
        });
    }


    function attoriFilmOSerieTV(movieOrTvSeries, that) {    // FUNZIONE che prende dall'API i primi 5 attori e li aggiunge all'HTML
        var idFilm = $(that).find('.id').text();
        if ($(that).find('.attori').text() == '') {     // se non si e' gia' entrati con il mouse su .contenuto prende dall'API i primi 5 attori e li aggiunge all'HTML
            $.ajax({
                url: 'https://api.themoviedb.org/3/' + movieOrTvSeries + '/' + idFilm + '/credits',
                data: {
                    api_key: '6bd6b0823733332d6f67f8c58faac567'
                },
                method: 'GET',
                success: function (data) {
                    var cast = data.cast;
                    var attori = '';
                    for (var i = 0; i < 5; i++) {   // prende i primi 5 attori
                        var attore = cast[i].name;
                        attori += attore + ', ';
                    }
                    $(that).find('.attori').text(attori);
                }
            });
        }
    }


// });
