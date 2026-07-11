/**
 * Secrets fixture for environment-variable override tests
 *
 * Values here must be overridden by app_* env vars (env wins over secrets).
 */
module.exports = {
	database: {
		password: 'secret-password'
	},

	oauth: {
		jwtSecret: 'from-secrets'
	}
};