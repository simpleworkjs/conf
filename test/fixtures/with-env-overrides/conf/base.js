/**
 * Fixture for environment-variable override tests
 *
 * Mirrors the shape of examples/conf/base.js so the app_* override tests have
 * real keys to override and new keys to create.
 */
module.exports = {
	app: {
		name: 'Test App',
		port: 3000
	},

	database: {
		host: 'localhost',
		port: 5432
	},

	features: {
		enableCache: true
	},

	oauth: {
		token_lifetime: {
			access_token: 3600,
			refresh_token: 2592000
		}
	}
};