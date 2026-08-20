import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';

const securityHeaders = {
	'Permissions-Policy': 'geolocation=(self), microphone=(), camera=()',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Cross-Origin-Resource-Policy': 'same-origin',
	'Origin-Agent-Cluster': '?1',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
	'X-Content-Type-Options': 'nosniff',
	'X-DNS-Prefetch-Control': 'off',
	'X-Download-Options': 'noopen',
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Permitted-Cross-Domain-Policies': 'none',
	'X-XSS-Protection': '0'
};

export const vcHandler: Handle = async ({ event, resolve }) => {
	const lang = event.cookies.get('lang') || 'en';
	const theme = event.cookies.get('theme') || 'light';

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html
				.replace('%sveltekit.lang%', lang)
				.replace('data-theme=""', `data-theme="${theme}"`);
		},
		filterSerializedResponseHeaders: (name) => {
			return name === 'content-type';
		}
	});

	for (const [header, value] of Object.entries(securityHeaders)) {
		response.headers.set(header, value);
	}
	return response;
};

export const handle = sequence(vcHandler);

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	console.error(error, event, status, message);
	// Report error and send event for extra context
	// Sentry.captureException(error, {
	// 	extra: { event, status }
	// });
	return {
		message: 'An unexpected error occurred.',
		code: 'UNEXPECTED'
	};
};
