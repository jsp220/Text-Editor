const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

// Cache First strategy for how the service worker will generate a response

const pageCache = new CacheFirst({
	cacheName: 'page-cache',

	plugins: [
		// response status code has to be 0 or 200 to be cacheable
		new CacheableResponsePlugin({
			statuses: [0, 200],
		}),
		// cache expires after 30 days
		new ExpirationPlugin({
			maxAgeSeconds: 30 * 24 * 60 * 60,
		}),
	],
});

// load index.html into cache during the install phase of this service worker
warmStrategyCache({
	urls: ['/index.html', '/'],
	strategy: pageCache,
});


registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// cache assets using stale-while-revalidate strategy
registerRoute(
	({ request }) => ['style', 'script', 'worker'].includes(request.destination),
	new StaleWhileRevalidate({
		cacheName: 'asset-cache',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			})
		],
	})
);
