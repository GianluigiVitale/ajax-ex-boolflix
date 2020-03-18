// $(document).ready(function(){
    var source = $('#template-film-serietv').html();
    var template = Handlebars.compile(source);


    // var valoreInput = $('input').val();
    // $('.ricerca-utente-film').empty();
    // $.ajax({
    //     url: 'https://api.themoviedb.org/3/search/movie',
    //     data: {
    //         api_key: '6bd6b0823733332d6f67f8c58faac567',
    //         query: valoreInput,
    //         language: 'it-IT'
    //     },
    //     method: 'GET',
    //     success: function (data) {
    //         var films = data.results;
    //         for (var i = 0; i < films.length; i++) {
    //             var film = films[i];
    //             var votoFilmArrotondatoDa1a5 = Math.ceil(film.vote_average / 2);
    //
    //             var stelle = [];
    //             for (var j = 1; j <= 5; j++) {
    //                 if (j <= votoFilmArrotondatoDa1a5) {
    //                     stelle.push('<i class="fas fa-star"></i>');
    //                 } else {
    //                     stelle.push('<i class="far fa-star"></i>');
    //                 }
    //             }
    //
    //             var valoriFilm = {
    //                 titolo: film.title,
    //                 titoloOriginale: film.original_title,
    //                 lingua: film.original_language,
    //                 voto: stelle
    //             }
    //             var filmTemplate = template(valoriFilm);
    //             $('.ricerca-utente-film').append(filmTemplate);
    //         }
    //     },
    //     error: function () {
    //         alert('errore generico');
    //     }
    // });

    $("input").keyup(function(event) {    // quando viene rilasciato un tasto dentro 'input'
        if (event.keyCode === 13) {             // se si preme il tasto invio
            $('button').click();
        }
    });


    $('button').click(function() {  // al click del 'button' viene inviato l'input e si visuallizano i film e le serie tv che contengono le parole inserite nell'input
        var valoreInput = $('input').val();
        $('.ricerca-utente-film').empty();
        $('.ricerca-utente-serieTV').empty();

        $.ajax({        // chiamata ajax per FILM
            url: 'https://api.themoviedb.org/3/search/movie',
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

                    var valoriFilm = {
                        titolo: film.title,
                        titoloOriginale: film.original_title,
                        lingua: lingua,
                        voto: stelle
                    }
                    var filmTemplate = template(valoriFilm);
                    $('.ricerca-utente-film').append(filmTemplate);
                }
            },
            error: function () {
                alert('errore generico');
            }
        });

        $.ajax({    // Chiamata ajax per SERIE TV
            url: 'https://api.themoviedb.org/3/search/tv',
            data: {
                api_key: '6bd6b0823733332d6f67f8c58faac567',
                query: valoreInput,
                language: 'it-IT'
            },
            method: 'GET',
            success: function (data) {
                var serieTV = data.results;
                for (var i = 0; i < serieTV.length; i++) {
                    var serie = serieTV[i];

                    var stelle = valutazioneStelle(serie);
                    var lingua = originalLanguage(serie);

                    var valoriSerieTV = {
                        titolo: serie.name,
                        titoloOriginale: serie.original_name,
                        lingua: lingua,
                        voto: stelle
                    }
                    var serieTvTemplate = template(valoriSerieTV);
                    $('.ricerca-utente-serieTV').append(serieTvTemplate);
                }
            },
            error: function () {
                alert('errore generico');
            }
        });
    });


    // FUNZIONI USATE


    function valutazioneStelle(film) {     // WARNING: variabile globale 'film'     FUNZIONE che serve per dare una valutazione con le stelle da 1 a 5
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

    function originalLanguage(film) {   // WARNING: variabile globale 'film'    FUNZIONE che serve per visualizzare la bandiera dello stato da cui proviene il film / serie tv
        var lingua = '';
        if (film.original_language == 'it') {
            lingua += ('<img src="img/italy.png" alt="italy flag">');
        } else if (film.original_language == 'en') {
            lingua += ('<img src="img/united-states.png" alt="united-states flag">');
        } else if (film.original_language == 'fr') {
            lingua += ('<img src="img/france.png" alt="france flag">');
        } else if (film.original_language == 'es') {
            lingua += ('<img src="img/spain.png" alt="spain flag">');
        } else if (film.original_language == 'de') {
            lingua += ('<img src="img/germany.png" alt="germany flag">');
        } else if (film.original_language == 'zh') {
            lingua += ('<img src="img/china.png" alt="china flag">');
        } else {
            lingua += ('<img src="img/world.png" alt="world icon">');
        }
        return lingua;
    }

// });
