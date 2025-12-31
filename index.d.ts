/**
 * Configuration object interface
 *
 * The configuration object is created by merging base, environment-specific,
 * and secrets configuration files. You can extend this interface to add
 * type safety for your specific configuration structure.
 *
 * @example
 * ```typescript
 * // Extend the Config interface for your application
 * declare module '@simpleworkjs/conf' {
 *   interface Config {
 *     app: {
 *       name: string;
 *       port: number;
 *     };
 *     database: {
 *       host: string;
 *       name: string;
 *       password?: string;
 *     };
 *   }
 * }
 *
 * // Now you get full type safety
 * import conf = require('@simpleworkjs/conf');
 * const port: number = conf.app.port;
 * ```
 */
export interface Config {
	/**
	 * The current environment name (e.g., 'development', 'production')
	 * Determined by NODE_ENV environment variable, defaults to 'development'
	 */
	environment: string;

	/**
	 * Allow any additional properties
	 * Users should extend this interface to add their specific configuration types
	 */
	[key: string]: any;
}

/**
 * The configuration object exported by @simpleworkjs/conf
 *
 * This object is the result of merging:
 * 1. conf/base.js (required)
 * 2. conf/<environment>.js (optional, based on NODE_ENV)
 * 3. conf/secrets.js (optional, for sensitive data)
 *
 * @example
 * ```javascript
 * const conf = require('@simpleworkjs/conf');
 * console.log(conf.environment); // 'development'
 * console.log(conf.app.port);    // Your custom config values
 * ```
 */
declare const config: Config;

export = config;
