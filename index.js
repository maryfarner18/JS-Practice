let movies = {
    horror: [],
    comedy: [],
    action: []
}
let horrorList = document.getElementById("horror")
let comedyList = document.getElementById("comedy")
let actionList = document.getElementById("action")
function fetchMovies() {
    fetch("http://localhost:4000/movies")
        .then(function (resp) { return resp.json() })
        .then(function (resp) {
            movies.horror = resp.horror
            movies.comedy = resp.comedy
            movies.action = resp.action
            movies.horror.forEach(function (movie) { appendMovie(movie, horrorList) })
            movies.comedy.forEach(function (movie) { appendMovie(movie, comedyList) })
            movies.action.forEach(function (movie) { appendMovie(movie, actionList) })
        })
}
fetchMovies()

function appendMovie(movie, container) {
    let li = document.createElement("li")
    li.innerHTML = `
        <div class="movie-card">
            <h3>${movie.title}</h3>
            <h5>Duration in Hours: ${movie["duration-in-hours"]}</h5>
            <img src=${movie.cover}/>
            <button>View Cast</button>
        </div>
        <br/>
    `
    container.append(li)
}