document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('movieId');
    fetchMovieDetails(movieId);
});

function fetchMovieDetails(movieId) {
    // Remplacez `YOUR_API_KEY` par votre clé API TMDB
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=ec0f0883f1a23d5918a53751e8995e80`)
    .then(response => response.json())
    .then(data => {
        showMovieDetails(data);
    })
    .catch(err => console.error(err));
}

function showMovieDetails(movie) {
    const detailsContainer = document.getElementById('movieDetails');
    const detailsHTML = `
        <div>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="img-fluid">
            <h3>${movie.title}</h3>
            <p>${movie.overview}</p>
            <p><small>Release date: ${movie.release_date}</small></p>
        </div>
    `;

    detailsContainer.innerHTML = detailsHTML;
}
