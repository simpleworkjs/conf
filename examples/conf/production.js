/**
 * Production environment configuration
 *
 * These settings override base.js when NODE_ENV=production
 */

module.exports = {
	app: {
		logLevel: 'warn', // Less verbose logging in production
		port: 8080
	},

	database: {
		host: 'prod-db.example.com',
		port: 5432,
		name: 'myapp_prod',
		poolSize: 20, // Larger pool for production
		options: {
			logging: false, // Disable query logging
			ssl: true
		}
	},

	api: {
		timeout: 10000, // Longer timeout for production
		retries: 5
	},

	features: {
		enableCache: true,
		enableMetrics: true,
		enableDebugRoutes: false, // Disable debug routes
		maxUploadSize: '50mb'
	},

	security: {
		sessionTimeout: 1800, // 30 minutes in production
		bcryptRounds: 12 // More rounds for better security
	}
};
