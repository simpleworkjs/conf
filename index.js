'use strict';

const extend = require('extend');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

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

module.exports = extend(
	true, // enable deep copy
	load(path.join(configRoot, 'base'), true),
	load(path.join(configRoot, environment)),
	load(path.join(configRoot, 'secrets')),
	{environment}
);
