document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let searchText = document.getElementById('searchText').value;
    fetchMovies(searchText);
});

function fetchMovies(searchText) {
    // Remplacez `YOUR_API_KEY` par votre clé API TMDB
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=ec0f0883f1a23d5918a53751e8995e80&query=${searchText}`)
    .then(response => response.json())
    .then(data => showResults(data.results))
    .catch(error => {
        console.error('Fetching failed:', error);
        document.getElementById('results').innerHTML = '<p>Vous êtes actuellement hors ligne et cette recherche n\'est pas disponible.</p>';
    });
}

function showResults(movies) {
    let output = '';
    movies.forEach(movie => {
        // Assurez-vous d'inclure un identifiant unique pour chaque élément, comme l'ID du film
        output += `
            <div class="card mb-3 movie" data-id="${movie.id}" style="max-width: 540px;">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img" alt="${movie.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">${movie.overview}</p>
                            <p class="card-text"><small class="text-muted">Release date: ${movie.release_date}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById('results').innerHTML = output;

    // Ajout des écouteurs d'événements pour chaque film
    document.querySelectorAll('.movie').forEach(item => {
        item.addEventListener('click', function() {
            const movieId = this.getAttribute('data-id');
            window.location.href = `details.html?movieId=${movieId}`;
        });
    });    
}

function fetchMovieDetails(movieId) {
    if (!movieId) {
        console.error("No movie ID provided");
        return;
    }
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=ec0f0883f1a23d5918a53751e8995e80`)
    .then(response => response.json())
    .then(data => {
        // Mise en cache des détails du film récupérés
        if ('caches' in window) {
            caches.open('v1').then(cache => {
                cache.put(`/movie/${movieId}`, new Response(JSON.stringify(data)));
            });
        }
        showMovieDetails(data);
    })
    .catch(error => {
        console.error('Fetching failed:', error);
        document.getElementById('results').innerHTML = '<p>Vous êtes actuellement hors ligne et cette recherche n\'est pas disponible.</p>';
    });
}

function showMovieDetailsInModal(movie) {
    const detailsHTML = `
        <div>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="img-fluid">
            <h5>${movie.title}</h5>
            <p>${movie.overview}</p>
            <p><small class="text-muted">Release date: ${movie.release_date}</small></p>
        </div>
    `;

    document.getElementById('movieDetails').innerHTML = detailsHTML;
    $('#movieModal').modal('show');
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/PWA/pwa2/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
