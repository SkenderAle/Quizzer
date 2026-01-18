// Service Worker per installazione app mobile
const CACHE_NAME = 'examlock-v2';
const urlsToCache = [
    './',
    './index.html',
    './quiz-locked.html',
    './styles.css',
    './config.js',
    './desktop-lock.js',
    './mobile-detection.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// Blocca accesso a siti esterni durante il quiz
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // Lista di siti da bloccare durante il quiz
    const blockedDomains = [
        'chat.openai.com',
        'bard.google.com',
        'copilot.microsoft.com',
        'google.com/search',
        'duckduckgo.com',
        'wikipedia.org'
    ];
    
    const isBlocked = blockedDomains.some(domain => 
        requestUrl.hostname.includes(domain)
    );
    
    if (isBlocked && event.request.mode === 'navigate') {
        event.respondWith(
            new Response(`
                <html>
                    <body style="font-family: Arial; text-align: center; padding: 50px;">
                        <h1>🚫 ACCESSO BLOCCATO</h1>
                        <p>Non puoi accedere a siti esterni durante il quiz.</p>
                        <p>Torna al quiz per continuare.</p>
                    </body>
                </html>
            `, {
                status: 403,
                headers: {'Content-Type': 'text/html'}
            })
        );
    }
});