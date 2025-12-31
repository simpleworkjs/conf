/**
 * Tests for @simpleworkjs/conf
 */

const { expect } = require('chai');
const path = require('path');
const fs = require('fs');

describe('@simpleworkjs/conf', function() {
	describe('Basic functionality', function() {
		it('should load base.js configuration', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'basic');
			process.chdir(fixturePath);

			const conf = require('../index.js');

			expect(conf).to.be.an('object');
			expect(conf.app.name).to.equal('Test App');
			expect(conf.app.port).to.equal(3000);
			expect(conf.database.host).to.equal('localhost');
		});

		it('should include environment property', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'basic');
			process.chdir(fixturePath);

			const conf = require('../index.js');

			expect(conf.environment).to.be.a('string');
			expect(conf.environment).to.equal('development'); // default
		});
	});

	describe('Environment-based configuration', function() {
		it('should load development.js when NODE_ENV=development', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'with-env');
			process.chdir(fixturePath);
			process.env.NODE_ENV = 'development';

			const conf = require('../index.js');

			expect(conf.app.debug).to.equal(true); // from development.js
			expect(conf.app.name).to.equal('Test App'); // from base.js
			expect(conf.environment).to.equal('development');
		});

		it('should load production.js when NODE_ENV=production', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'with-env');
			process.chdir(fixturePath);
			process.env.NODE_ENV = 'production';

			const conf = require('../index.js');

			expect(conf.app.port).to.equal(8080); // overridden by production.js
			expect(conf.database.host).to.equal('prod-db.example.com'); // from production.js
			expect(conf.app.name).to.equal('Test App'); // from base.js
			expect(conf.environment).to.equal('production');
		});

		it('should default to development when NODE_ENV is not set', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'with-env');
			process.chdir(fixturePath);
			delete process.env.NODE_ENV;

			const conf = require('../index.js');

			expect(conf.environment).to.equal('development');
			expect(conf.app.debug).to.equal(true); // from development.js
		});
	});

	describe('Secrets configuration', function() {
		it('should load and merge secrets.js', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'with-secrets');
			process.chdir(fixturePath);

			const conf = require('../index.js');

			expect(conf.api.token).to.equal('secret-token-123'); // overridden by secrets.js
			expect(conf.database.password).to.equal('secret-password'); // from secrets.js
			expect(conf.app.name).to.equal('Test App'); // from base.js
		});
	});

	describe('Deep merge behavior', function() {
		it('should deeply merge all configuration files', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'all-files');
			process.chdir(fixturePath);
			process.env.NODE_ENV = 'testing';

			const conf = require('../index.js');

			// Values from base.js
			expect(conf.level1.level2.fromBase).to.equal('base-value');
			expect(conf.onlyInBase).to.equal('base');

			// Values overridden by testing.js
			expect(conf.level1.level2.overrideByEnv).to.equal('env-value');
			expect(conf.level1.level2.onlyInEnv).to.equal('env');

			// Values overridden by secrets.js
			expect(conf.level1.level2.overrideBySecret).to.equal('secret-value');
			expect(conf.level1.level2.onlyInSecret).to.equal('secret');
		});

		it('should preserve nested objects that are not overridden', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'with-env');
			process.chdir(fixturePath);
			process.env.NODE_ENV = 'production';

			const conf = require('../index.js');

			// base.js has database.port but production.js doesn't override it
			expect(conf.database.port).to.equal(5432);
			expect(conf.database.host).to.equal('prod-db.example.com');
		});
	});

	describe('CONF_DIR environment variable', function() {
		it('should use CONF_DIR when set', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'basic', 'conf');
			process.env.CONF_DIR = fixturePath;

			const conf = require('../index.js');

			expect(conf.app.name).to.equal('Test App');
		});

		it('should prefer CONF_DIR over default location', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'with-secrets', 'conf');
			process.chdir(path.join(__dirname, 'fixtures', 'basic')); // different directory
			process.env.CONF_DIR = fixturePath;

			const conf = require('../index.js');

			expect(conf.api).to.exist;
			expect(conf.api.token).to.equal('secret-token-123');
		});
	});

	describe('Error handling', function() {
		it('should exit when base.js is missing', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'missing-base');
			process.chdir(fixturePath);

			// Mock process.exit to prevent actual exit
			const originalExit = process.exit;
			let exitCode;
			process.exit = (code) => { exitCode = code; throw new Error('EXIT'); };

			try {
				require('../index.js');
				expect.fail('Should have called process.exit');
			} catch (err) {
				expect(err.message).to.equal('EXIT');
				expect(exitCode).to.equal(1);
			} finally {
				process.exit = originalExit;
			}
		});

		it('should exit when base.js has syntax errors', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'syntax-error');
			process.chdir(fixturePath);

			const originalExit = process.exit;
			let exitCode;
			process.exit = (code) => { exitCode = code; throw new Error('EXIT'); };

			try {
				require('../index.js');
				expect.fail('Should have called process.exit');
			} catch (err) {
				expect(err.message).to.equal('EXIT');
				expect(exitCode).to.equal(1);
			} finally {
				process.exit = originalExit;
			}
		});

		it('should warn but not exit when environment file is missing', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'basic');
			process.chdir(fixturePath);
			process.env.NODE_ENV = 'staging'; // no staging.js file exists

			// Capture console.warn
			const originalWarn = console.warn;
			let warnCalled = false;
			console.warn = (msg) => { warnCalled = true; };

			try {
				const conf = require('../index.js');
				expect(conf).to.exist;
				expect(conf.app.name).to.equal('Test App');
				expect(warnCalled).to.be.true;
			} finally {
				console.warn = originalWarn;
			}
		});

		it('should warn but not exit when secrets.js is missing', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'basic');
			process.chdir(fixturePath);

			const originalWarn = console.warn;
			let warnCalled = false;
			console.warn = (msg) => { warnCalled = true; };

			try {
				const conf = require('../index.js');
				expect(conf).to.exist;
				expect(warnCalled).to.be.true;
			} finally {
				console.warn = originalWarn;
			}
		});
	});

	describe('Return value', function() {
		it('should return an object', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'basic');
			process.chdir(fixturePath);

			const conf = require('../index.js');
			expect(conf).to.be.an('object');
		});

		it('should be immutable after first require', function() {
			const fixturePath = path.join(__dirname, 'fixtures', 'basic');
			process.chdir(fixturePath);

			const conf1 = require('../index.js');
			conf1.testProperty = 'modified';

			const conf2 = require('../index.js');
			expect(conf2.testProperty).to.equal('modified'); // Same object reference
			expect(conf1).to.equal(conf2);
		});
	});
});
