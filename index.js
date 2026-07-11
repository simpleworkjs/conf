'use strict';

const extend = require('extend');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

/**
 * Prefix for environment-variable configuration overrides.
 *
 * Any environment variable whose name starts with `app_` is treated as a config
 * override. The remainder of the name is split on double-underscore (`__`) into
 * a nested path into the config object, and the value is applied with the
 * highest precedence (winning over base.js, <environment>.js, and secrets.js).
 *
 * Examples:
 *   app_app__port=9090                 -> conf.app.port = 9090        (number)
 *   app_database__host=env-host        -> conf.database.host = 'env-host'
 *   app_features__enableCache=false     -> conf.features.enableCache = false (boolean)
 *   app_oauth__token_lifetime__access_token=3600
 *                                      -> conf.oauth.token_lifetime.access_token = 3600
 *
 * Values are coerced via JSON.parse when possible (so numbers, booleans, null,
 * and JSON objects/arrays become real types); anything that fails to parse is
 * kept as the raw string. This means `app_smtp__secure=false` becomes the
 * boolean `false`, while `app_ldap__url=ldap://host` stays the string
 * `ldap://host`.
 */
const ENV_PREFIX = 'app_';

/**
 * Coerce a raw environment-variable string into a typed value.
 *
 * Tries JSON.parse first so numbers, booleans, null, and JSON objects/arrays
 * become real types. Falls back to the raw string for anything that is not
 * valid JSON (URLs, passwords, free-form text, etc.).
 *
 * @param {string} raw - The raw environment variable value
 * @returns {*} The coerced value
 */
function coerce(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}

/**
 * Apply `app_*` environment-variable overrides onto a config object, in place.
 *
 * Each `app_`-prefixed env var is split on `__` into path segments and the
 * value is set at that nested path, creating intermediate objects as needed.
 * Names with empty segments (leading/trailing/repeated `__`) are ignored.
 *
 * @param {Object} config - The merged configuration object to override
 * @returns {Object} The same object, with env overrides applied
 */
function applyEnvOverrides(config) {
	for (const key of Object.keys(process.env)) {
		if (!key.startsWith(ENV_PREFIX)) continue;

		const segments = key.slice(ENV_PREFIX.length).split('__');
		if (segments.some(segment => segment === '')) continue;

		let obj = config;
		for (let i = 0; i < segments.length; i++) {
			if (i === segments.length - 1) {
				obj[segments[i]] = coerce(process.env[key]);
			} else {
				if (typeof obj[segments[i]] !== 'object' || obj[segments[i]] === null) {
					obj[segments[i]] = {};
				}
				obj = obj[segments[i]];
			}
		}
	}
	return config;
}

/**
 * Get the configuration directory root path
 * @returns {string} The absolute path to the conf directory
 */
function getConfigRoot() {
	// Allow override via environment variable
	if (process.env.CONF_DIR) {
		return process.env.CONF_DIR;
	}

	// When installed as a package, look for conf dir in the project root
	// Start from current working directory
	const projectRoot = process.cwd();
	return path.join(projectRoot, 'conf');
}

/**
 * Load a configuration file
 * @param {string} filePath - Path to the configuration file
 * @param {boolean} required - Whether the file is required
 * @returns {Object} The loaded configuration object or empty object if not found
 */
function load(filePath, required){
	try {
		return require(filePath);
	} catch(error){
		if(error.name === 'SyntaxError'){
			console.error(`Loading ${filePath} file failed!\n`, error);
			process.exit(1);
		} else if (error.code === 'MODULE_NOT_FOUND'){
			console.warn(`No config file ${filePath} FOUND! This may cause issues...`);
			if (required){
				process.exit(1);
			}
			return {};
		}else{
			console.error(`Unknown error in loading ${filePath} config file.\n`, error);
		}
	}
};

const configRoot = getConfigRoot();

const config = extend(
	true, // enable deep copy
	load(path.join(configRoot, 'base'), true),
	load(path.join(configRoot, environment)),
	load(path.join(configRoot, 'secrets')),
	{environment}
);

// Apply `app_*` environment-variable overrides last, so they win over every
// configuration file (including secrets.js). This is the 12-factor convention:
// environment variables are the highest-precedence configuration layer.
module.exports = applyEnvOverrides(config);