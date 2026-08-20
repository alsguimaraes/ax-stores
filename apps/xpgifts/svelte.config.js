import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		// Disable a11y warnings for work-in-progress UI elements
		dev: false,
		discloseVersion: false,
		experimental: {
			async: true,
		},
	},
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		experimental: {
			remoteFunctions: false,
		},
		adapter: adapter({
			config: "./wrangler.jsonc",
			precompress: true,
		}),
		csp: {
			mode: "auto",
			directives: {
				"script-src": ["'self'", "https://challenges.cloudflare.com/"],
				"worker-src": ["'self'", "https://challenges.cloudflare.com/"],
				"frame-src": ["'self'", "https://challenges.cloudflare.com/"],
				"default-src": ["'self'", "https://challenges.cloudflare.com/"],
				"media-src": ["'self'", "blob:"],
				"img-src": ["'self'", "https://media.xpgifts.com/", "data:", "blob:"],
				"frame-ancestors": ["'self'"],
				"form-action": ["'self'"],
				"font-src": ["'self'", "data:"],
				"base-uri": ["'self'"],
				"object-src": ["'none'"],
				"script-src-attr": ["'none'"],
				"style-src": ["'self'", "https:", "unsafe-inline"],
			},
		},
		alias: {
			$components: "src/lib/components/*",
		},
	},
};

export default config;
