let movies = {
    horror: [],
    comedy: [],
    action: []
}
let movieUL = document.getElementsByClassName("movie-list")[0]
function fetchMovies() {
    fetch("http://localhost:4000/movies")
        .then(function (resp) { return resp.json() })
        .then(function (resp) {
            movies.horror = resp.horror
            movies.comedy = resp.comedy
            movies.action = resp.action
            movies.horror.forEach(function (movie) { appendMovie(movie) })
        })
}
fetchMovies()

function appendMovie(movie) {
    let li = document.createElement("li")
    li.innerHTML = `
        <div class="movie-card">
            <h4>${movie.title}</h4>
            <h4>Duration in Hours: ${movie["duration-in-hours"]}</h4>
            <img src=${movie.cover}/>
            <button>View Cast</button>
        </div>
    `
    movieUL.append(li)
}