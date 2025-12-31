/**
 * Base configuration
 *
 * This file contains the default configuration shared across all environments.
 * Values here can be overridden by environment-specific files.
 */

module.exports = {
	app: {
		name: 'My Application',
		version: '1.0.0',
		port: 3000,
		logLevel: 'info'
	},

	database: {
		host: 'localhost',
		port: 5432,
		name: 'myapp_dev',
		poolSize: 10,
		// Sensitive values like passwords should go in secrets.js
	},

	api: {
		timeout: 5000,
		retries: 3,
		endpoints: {
			users: '/api/v1/users',
			posts: '/api/v1/posts'
		}
	},

	features: {
		enableCache: true,
		enableMetrics: false,
		maxUploadSize: '10mb'
	},

	security: {
		sessionTimeout: 3600, // 1 hour in seconds
		bcryptRounds: 10
	}
};
