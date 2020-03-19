// $(document).ready(function(){
    var source = $('#template-film-serietv').html();    // Handlebars
    var template = Handlebars.compile(source);


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

            chiamataAjax('https://api.themoviedb.org/3/search/movie', 'title', 'original_title', '.ricerca-utente-film', valoreInput);
            chiamataAjax('https://api.themoviedb.org/3/search/tv', 'name', 'original_name', '.ricerca-utente-serieTV', valoreInput);
        } else {
            alert('Pefavore inserisci un film o serie tv');
        }
    });



    // FUNZIONI USATE



    function chiamataAjax(url, titolo, titoloOriginale, appendFilmOSerie, valoreInput) {    // FUNZIONE che richiama un film o una serie tv da API MovieDB e la visualizza a schermo (handlebars)
        $.ajax({
            url: url,
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

                    var stelle = valutazioneStelle(film);
                    var lingua = originalLanguage(film);
                    var copertina = controlloCopertina(film);

                    var valoriFilm = {
                        copertina: copertina,
                        copertinaNome: 'copertina di ' + film[titolo],
                        titolo: film[titolo],
                        titoloOriginale: film[titoloOriginale],
                        lingua: lingua,
                        voto: stelle,
                        overview: film.overview
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


    function originalLanguage(film) {       // FUNZIONE che serve per visualizzare la bandiera dello stato da cui proviene il film / serie tv
        var lingua = '';
        if (film.original_language == 'it') {
            lingua += ('<img class="lingua-originale" src="img/italy.png" alt="italy flag">');
        } else if (film.original_language == 'en') {
            lingua += ('<img class="lingua-originale" src="img/united-states.png" alt="united-states flag">');
        } else if (film.original_language == 'fr') {
            lingua += ('<img class="lingua-originale" src="img/france.png" alt="france flag">');
        } else if (film.original_language == 'es') {
            lingua += ('<img class="lingua-originale" src="img/spain.png" alt="spain flag">');
        } else if (film.original_language == 'de') {
            lingua += ('<img class="lingua-originale" src="img/germany.png" alt="germany flag">');
        } else if (film.original_language == 'zh') {
            lingua += ('<img class="lingua-originale" src="img/china.png" alt="china flag">');
        } else {
            lingua += ('<img class="lingua-originale" src="img/world.png" alt="world icon">');
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
