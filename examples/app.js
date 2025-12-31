/**
 * Example application using @simpleworkjs/conf
 *
 * This demonstrates how to use the configuration in your application.
 *
 * To run this example:
 * 1. Copy the conf/ directory to your project root
 * 2. Copy conf/secrets.js.example to conf/secrets.js and fill in values
 * 3. Run: node app.js
 */

const conf = require('@simpleworkjs/conf');

console.log('=== Configuration Example ===\n');

// Display current environment
console.log(`Environment: ${conf.environment}`);
console.log(`App Name: ${conf.app.name}`);
console.log(`App Version: ${conf.app.version}`);
console.log(`Port: ${conf.app.port}`);
console.log(`Log Level: ${conf.app.logLevel}\n`);

// Database configuration
console.log('Database Configuration:');
console.log(`  Host: ${conf.database.host}`);
console.log(`  Port: ${conf.database.port}`);
console.log(`  Database: ${conf.database.name}`);
console.log(`  Pool Size: ${conf.database.poolSize}`);
console.log(`  Username: ${conf.database.username || '(not set)'}`);
console.log(`  Password: ${conf.database.password ? '***' : '(not set)'}\n`);

// API configuration
console.log('API Configuration:');
console.log(`  Timeout: ${conf.api.timeout}ms`);
console.log(`  Retries: ${conf.api.retries}`);
console.log(`  Token: ${conf.api.token ? '***' : '(not set)'}\n`);

// Features
console.log('Feature Flags:');
console.log(`  Cache Enabled: ${conf.features.enableCache}`);
console.log(`  Metrics Enabled: ${conf.features.enableMetrics}`);
console.log(`  Debug Routes: ${conf.features.enableDebugRoutes || false}`);
console.log(`  Max Upload Size: ${conf.features.maxUploadSize}\n`);

// Security
console.log('Security Settings:');
console.log(`  Session Timeout: ${conf.security.sessionTimeout}s`);
console.log(`  BCrypt Rounds: ${conf.security.bcryptRounds}\n`);

// Example: Using config in a real application
// This is how you'd typically use the config

const express = require('express'); // Requires: npm install express

const app = express();

app.get('/', (req, res) => {
	res.json({
		app: conf.app.name,
		version: conf.app.version,
		environment: conf.environment
	});
});

app.get('/health', (req, res) => {
	res.json({
		status: 'healthy',
		timestamp: new Date().toISOString(),
		environment: conf.environment
	});
});

// Only enable debug routes in development
if (conf.features.enableDebugRoutes) {
	app.get('/debug/config', (req, res) => {
		// Never expose secrets in a real application!
		const safeConfig = { ...conf };
		delete safeConfig.database?.password;
		delete safeConfig.api?.token;
		delete safeConfig.services;
		res.json(safeConfig);
	});
}

app.listen(conf.app.port, () => {
	console.log(`Server running on port ${conf.app.port}`);
	console.log(`Environment: ${conf.environment}`);
	console.log(`Log Level: ${conf.app.logLevel}`);
});
