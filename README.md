# @simpleworkjs/conf

Configuration management for the SimpleWorkJS framework

[![npm version](https://img.shields.io/npm/v/@simpleworkjs/conf.svg)](https://www.npmjs.com/package/@simpleworkjs/conf)
[![Tests](https://github.com/simpleworkjs/conf/workflows/Tests/badge.svg)](https://github.com/simpleworkjs/conf/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

📚 **[View Full Documentation](https://simpleworkjs.github.io/conf/)**

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration Structure](#configuration-structure)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Development](#development)

## Installation

```bash
npm install --save @simpleworkjs/conf
```

## Quick Start

Create a `conf` directory in your project root (at the same level as `node_modules`):

```
your-project/
├── node_modules/
├── conf/
│   ├── base.js           # Required - base configuration
│   ├── development.js    # Optional - development environment config
│   ├── production.js     # Optional - production environment config
│   └── secrets.js        # Optional - sensitive data (add to .gitignore!)
└── package.json
```

Configuration files can be either JSON or JavaScript files exporting an object.

**Example `conf/base.js`:**
```js
module.exports = {
	app: {
		name: 'My Application',
		port: 3000
	},
	database: {
		host: 'localhost',
		name: 'myapp'
	}
};
```

**Example `conf/production.js`:**
```js
module.exports = {
	app: {
		port: 8080
	},
	database: {
		host: 'prod-db.example.com'
	}
};
```

**Example `conf/secrets.js`:**
```js
module.exports = {
	database: {
		password: 'super-secret-password',
		username: 'dbuser'
	},
	apiKeys: {
		stripe: 'sk_live_...'
	}
};
```

**Usage in your application:**
```js
const conf = require('@simpleworkjs/conf');

console.log(conf.app.name);        // 'My Application'
console.log(conf.database.host);   // 'localhost' in development, 'prod-db.example.com' in production
console.log(conf.database.password); // 'super-secret-password' (from secrets.js)
console.log(conf.environment);     // 'development' or 'production'
```

**Important:** Add `secrets.js` to your `.gitignore` file to prevent committing sensitive data.

## Configuration Structure

### Directory Layout

The `conf` directory should be at the root of your project:

- `base.js` - **Required** - Contains shared configuration used across all environments
- `<environment>.js` - **Optional** - Environment-specific overrides (e.g., `development.js`, `production.js`, `staging.js`)
- `secrets.js` - **Optional** - Sensitive data that should not be committed to version control

### Load Order

Configuration files are loaded and merged in the following order:

1. **base.js** - Loaded first (required)
2. **<environment>.js** - Loaded second, overrides base settings
3. **secrets.js** - Loaded last, overrides all previous settings

Each subsequent file deeply merges with the previous configuration, allowing you to override specific values while keeping others intact.

## How It Works

The package uses a multi-tiered configuration strategy inspired by Django's settings system:

1. **Shared Configuration** - Common settings go in `base.js`
2. **Environment-Specific** - Environment overrides go in `development.js`, `production.js`, etc.
3. **Secrets** - Sensitive data goes in `secrets.js` (add to `.gitignore`)

The environment is determined by the `NODE_ENV` environment variable (defaults to `development`).

### Example Scenario

Consider this configuration:

**base.js:**
```js
{
  app: { name: 'MyApp', port: 3000 },
  api: { url: 'https://api.example.com', timeout: 5000 }
}
```

**production.js:**
```js
{
  app: { port: 8080 },
  api: { timeout: 10000 }
}
```

**secrets.js:**
```js
{
  api: { token: 'secret-api-key' }
}
```

**Result in production:**
```js
{
  app: { name: 'MyApp', port: 8080 },          // port from production.js
  api: {
    url: 'https://api.example.com',            // from base.js
    timeout: 10000,                             // from production.js
    token: 'secret-api-key'                     // from secrets.js
  },
  environment: 'production'                     // auto-added
}
```

## API Reference

### Environment Variables

- **`NODE_ENV`** - Sets the environment (default: `development`)
- **`CONF_DIR`** - Override the configuration directory path (default: `./conf`)

### Configuration Object

The exported configuration object includes all merged settings plus:

- **`environment`** - The current environment name (from `NODE_ENV`)

## Examples

### Using with Express

```js
const conf = require('@simpleworkjs/conf');
const express = require('express');

const app = express();

app.listen(conf.app.port, () => {
  console.log(`Server running on port ${conf.app.port}`);
});
```

### Different Environments

```bash
# Development (default)
npm start

# Production
NODE_ENV=production npm start

# Custom environment
NODE_ENV=staging npm start  # Loads conf/staging.js
```

### Custom Config Directory

```bash
CONF_DIR=/path/to/config node app.js
```

## Best Practices

1. **Always commit** `base.js` and environment-specific files to version control
2. **Never commit** `secrets.js` - add it to `.gitignore`
3. **Use environment files** for environment-specific URLs, ports, and settings
4. **Use secrets.js** for API keys, passwords, tokens, and other sensitive data
5. **Keep base.js minimal** - only include truly shared configuration
6. **Document your config** - add comments explaining what each setting does

## Development

### Running Tests

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Run tests to ensure they pass: `npm test`
5. Commit your changes: `git commit -m 'Add my feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

### Testing

The test suite uses Mocha and Chai and includes:

- Basic configuration loading
- Environment-based configuration
- Secrets file handling
- Deep merge behavior
- Error handling
- Environment variable support

Tests run on multiple Node.js versions (16, 18, 20, 22) and operating systems (Ubuntu, Windows, macOS) via GitHub Actions.

## License

MIT © simpleworkjs
