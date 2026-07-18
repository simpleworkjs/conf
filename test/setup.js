/**
 * Test setup file
 * Loaded before all tests via .mocharc.json
 */

const path = require('path');

// Store original process.cwd and env for restoration
global.originalCwd = process.cwd();
global.originalEnv = { ...process.env };

// Store original console methods for restoration
global.originalWarn = console.warn;
global.originalError = console.error;

// Setup root hooks for all tests
exports.mochaHooks = {
	beforeEach() {
		// Suppress expected warnings/errors from optional config files and
		// error-path tests so the test output stays readable. Individual tests
		// can still override these stubs to assert on console output.
		console.warn = () => {};
		console.error = () => {};

		// Clear the cache for the main index.js module
		const indexPath = path.join(__dirname, '..', 'index.js');
		delete require.cache[require.resolve(indexPath)];

		// Clear cache for all fixture files
		Object.keys(require.cache).forEach(key => {
			if (key.includes('fixtures')) {
				delete require.cache[key];
			}
		});
	},

	afterEach() {
		// Restore console methods
		console.warn = global.originalWarn;
		console.error = global.originalError;

		// Restore process.cwd
		if (process.chdir) {
			try {
				process.chdir(global.originalCwd);
			} catch (e) {
				// Ignore errors
			}
		}

		// Restore original environment
		Object.keys(process.env).forEach(key => {
			if (!(key in global.originalEnv)) {
				delete process.env[key];
			}
		});
		Object.assign(process.env, global.originalEnv);
	}
};
