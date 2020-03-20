// $(document).ready(function(){
    var source = $('#template-film-serietv').html();    // Handlebars
    var template = Handlebars.compile(source);

    $(document).on('mouseover', '.contenuto', function() {  // quando si entra con il mouse su .contenuto prende dall'API i primi 5 attori e li aggiunge all'HTML
        var idFilm = $(this).find('.id').text();
        var that = $(this);
        if ($(that).find('.attori').text() == '') {     // se non si e' gia' entrati con il mouse su .contenuto prende dall'API i primi 5 attori e li aggiunge all'HTML
            $.ajax({
                url: 'https://api.themoviedb.org/3/movie/' + idFilm + '/credits',
                data: {
                    api_key: '6bd6b0823733332d6f67f8c58faac567'
                },
                method: 'GET',
                success: function (data) {
                    var cast = data.cast;
                    var attori = '';
                    for (var i = 0; i < 5; i++) {
                        var attore = cast[i].name;
                        attori += attore + ', ';
                    }
                    $(that).find('.attori').text(attori);
                }
            });
        }
    });


    $("input").keyup(function(event) {    // quando viene rilasciato un tasto dentro 'input'
        if (event.keyCode === 13) {             // se si preme il tasto invio
            $('.fa-search').click();
        }
    });


    $('.fa-search').click(function() {      // al click del '.fa-search' viene inviato l'input e si visuallizano i film e le serie tv che contengono le parole inserite nell'input
        var valoreInput = $('input').val();
        if (valoreInput.trim().length > 0) {         // se l'input ha contenuto
            $('.ricerca-utente-film').empty();
            $('.ricerca-utente-serieTV').empty();

            chiamataAjaxSearch('movie', 'title', 'original_title', '.ricerca-utente-film', valoreInput);
            chiamataAjaxSearch('tv', 'name', 'original_name', '.ricerca-utente-serieTV', valoreInput);
        } else {
            alert('Pefavore inserisci un film o serie tv');
        }
    });



    // FUNZIONI USATE



    function chiamataAjaxSearch(url, titolo, titoloOriginale, appendFilmOSerie, valoreInput) {    // FUNZIONE che richiama un film o una serie tv da API MovieDB e la visualizza a schermo (handlebars)
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
                var films = data.results;
                for (var i = 0; i < films.length; i++) {
                    var film = films[i];
                    var filmId = film.id;
                    // console.log(filmId);

                    var stelle = valutazioneStelle(film);
                    var lingua = originalLanguageFlag(film);
                    var copertina = controlloCopertina(film);

                    var valoriFilm = {
                        copertina: copertina,
                        copertinaNome: 'copertina di ' + film[titolo],
                        titolo: film[titolo],
                        titoloOriginale: film[titoloOriginale],
                        lingua: lingua,
                        voto: stelle,
                        overview: film.overview,
                        id: film.id
                    }
                    var filmTemplate = template(valoriFilm);
                    $(appendFilmOSerie).append(filmTemplate);
                }
            },
            error: function () {
                alert('errore generico');
            }
        });
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


    function originalLanguageFlag(film) {       // FUNZIONE che serve per visualizzare la bandiera dello stato da cui proviene il film / serie tv
        var lingua = '';
        var linguePresenti = ['it','en', 'fr', 'es', 'de', 'zh'];
        for (var i = 0; i < linguePresenti.length; i++) {
            if (linguePresenti[i] == film.original_language) {
                lingua += linguePresenti[i];
            }
        }
        if (lingua == '') {
            lingua += 'world';
        }
        return lingua;
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

// });
