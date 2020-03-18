// $(document).ready(function(){
    var source = $('#template-film').html();
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

    $("input").keyup(function(event) {    // quando viene rilasciato un tasto dentro #message
        if (event.keyCode === 13) {             // se si preme il tasto invio
            $('button').click();
        }
    });


    $('button').click(function() {
        var valoreInput = $('input').val();
        $('.ricerca-utente-film').empty();
        $.ajax({
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
                    var votoFilmArrotondatoDa1a5 = Math.ceil(film.vote_average / 2);

                    var stelle = '';
                    for (var j = 1; j <= 5; j++) {
                        if (j <= votoFilmArrotondatoDa1a5) {
                            stelle += ('<i class="fas fa-star"></i>');
                        } else {
                            stelle += ('<i class="far fa-star"></i>');
                        }
                    }

                    var valoriFilm = {
                        titolo: film.title,
                        titoloOriginale: film.original_title,
                        lingua: film.original_language,
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
    });


// });
