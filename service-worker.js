const CACHE_NAME = 'v1';
const urlsToCache = [
    '/',
    '/PWA/pwa2/offline.html',
    '/PWA/pwa2/index.html',
    '/PWA/pwa2/details.html', // Si vous avez une page de détails séparée
    '/PWA/pwa2/style.css',
    '/PWA/pwa2/app.js',
    '/PWA/pwa2/details.js',
    '/PWA/pwa2/icon.png',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            const cachePromises = urlsToCache.map(urlToCache => {
                return cache.add(urlToCache).catch(err => Promise.reject(`Failed to cache ${urlToCache}: ${err}`));
            });
            return Promise.all(cachePromises).catch(err => {
                console.error(err);
            });
        })
    );
});

self.addEventListener('fetch', event => {
    // Vérifie si la requête est de type navigation (ex. chargement de page)
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request.url).catch(error => {
                // Retourne la page `details.html` du cache si la requête réseau échoue
                return caches.match('/PWA/pwa2/details.html');
            })
        );
    } else {
        // Gestion des requêtes non-navigation (ex. fichiers CSS, JS, images)
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retourne la réponse mise en cache si elle existe,
                // sinon effectue une requête réseau.
                return response || fetch(event.request).then(response => {
                    // Optionnel : mise en cache de la nouvelle ressource récupérée
                    return caches.open('v1').then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            }).catch(() => {
                // Gestion des erreurs ou retour d'une ressource par défaut
                // si la ressource n'est pas dans le cache et que le réseau est inaccessible.
                return caches.match('/offline.html');
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => caches.match('/PWA/pwa2/offline.html'));
            })
    );
});
