window.addEventListener("load", function () {
    fetchMovies();
});

function fetchMovies() {
    const options = getOptions();
    const language = "pt-br";

    fetch(`https://api.themoviedb.org/3/movie/popular?language=${language}&page=1`, options)
        .then(response => response.json())
        .then(movies => {
            const firstTenFilms = movies.results.slice(0, 10);
            displayTitles(firstTenFilms);
        })
        .catch(err => console.error(err));
}

function getOptions() {
    return {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODcwMmY4ZjNhZmFlNjc5YjZhMTYwNGZiYzVmODhmYyIsInN1YiI6IjY1ZmI3ZTdjMDQ3MzNmMDE2NGU2NmMwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.37dVj3a7gB2tfM87GdmTjbrOIMGUuURKQfYm7XuZyKc'
        }
    };
}

function displayTitles(movies) {
    movies.forEach(movie => {
        const boxMovie = createBoxMovie(movie);
        document.getElementById("boxMovies").appendChild(boxMovie);
    });
}

function createBoxMovie(movie) {
    const boxMovie = createElement("div", "boxMovie");
    const url = "https://image.tmdb.org/t/p/w500";

    boxMovie.appendChild(createElementWithText("p", "movieTitle", movie.title));
    boxMovie.appendChild(createImageElement("img", "movieCover", `${url}${movie.backdrop_path}`));
    boxMovie.appendChild(createPopularityElement(movie));
    boxMovie.appendChild(createModal(movie, url));

    return boxMovie;
}

function createElement(elementType, className) {
    const element = document.createElement(elementType);
    element.className = className;
    return element;
}

function createElementWithText(elementType, className, textContent) {
    const element = createElement(elementType, className);
    element.textContent = textContent;
    return element;
}

function createImageElement(elementType, className, src) {
    const element = createElement(elementType, className);
    element.setAttribute("src", src);
    return element;
}

function createPopularityElement(movie) {
    const popularity = createElementWithText("div", "popularity", parseFloat(movie.popularity).toFixed(1));
    popularity.appendChild(createImageElement("img", "", "img/starIcon.svg"));
    return popularity;
}

function createModal(movie, url) {
    const modal = createElement("div", "modal");
    modal.id = "modal-" + movie.id; // Use the movie id to create a unique id

     // Create the close button
     const closeButton = createElement("i", "fas fa-times close-button");
     closeButton.addEventListener("click", function() {
         modal.style.display = "none";
     });
     modal.appendChild(closeButton);

    modal.appendChild(createImageElement("img", "modalImage", `${url}${movie.backdrop_path}`));
    modal.appendChild(createElementWithText("h2", "modalTitle", movie.title));
    modal.appendChild(createPopularityElement(movie));
    modal.appendChild(createVoteAverageElement(movie));
    modal.appendChild(createOverviewAndGenresElement(movie));

    addModalEventListeners(modal);

    return modal;
}

function createVoteAverageElement(movie) {
    const voteAverageModal = createElementWithText("div", "voteAverageModal", parseFloat(movie.vote_average).toFixed(1));
    voteAverageModal.appendChild(createImageElement("img", "", "img/joia.svg"));
    voteAverageModal.className = "voteAverageModal";
    return voteAverageModal;
}

function createOverviewAndGenresElement(movie) {
    const overviewAndGenres = createElement("div", "overviewAndGenres");
    overviewAndGenres.appendChild(createElementWithText("p", "", movie.overview));
    overviewAndGenres.appendChild(createGenresElement(movie));
    return overviewAndGenres;
}

function createGenresElement(movie) {
    const genresModal = createElement("p", "");
    const options = getOptions();
    const language = "pt-br";

    fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${language}`, options)
        .then(response => response.json())
        .then(movie => {
            let genres = movie.genres.map(genre => genre.name).join(', ');
            genresModal.textContent = "Gêneros: " + genres;
        })
        .catch(err => console.error(err));

    return genresModal;
}

function addModalEventListeners() {
    document.addEventListener("click", function (event) {
        if (event.target.className === "movieCover") {
            const modal = event.target.parentNode.querySelector('.modal');
            document.querySelectorAll('.modal').forEach(otherModal => {
                if (otherModal !== modal) {
                    otherModal.style.display = "none";
                }
            });
            modal.style.display = "block";
        } else if (!event.target.closest('.modal')) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = "none";
            });
        }
    });
}