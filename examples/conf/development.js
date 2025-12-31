/**
 * Development environment configuration
 *
 * These settings override base.js when NODE_ENV=development (the default)
 */

module.exports = {
	app: {
		logLevel: 'debug', // More verbose logging in development
		port: 3000
	},

	database: {
		host: 'localhost',
		name: 'myapp_dev',
		// In development, you might use SQLite or a local DB
		options: {
			logging: true // Enable query logging
		}
	},

	features: {
		enableMetrics: true, // Enable metrics for local testing
		enableDebugRoutes: true
	},

	// Development-specific settings
	devTools: {
		hotReload: true,
		sourceMaps: true
	}
};
