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
- `secrets.js` - **Optional** - Sensitive data that should not be committed to version control. Use the `CONF_SECRETS` environment variable to point to a secrets file outside the `conf` directory (for example, `/etc/appName.js`).

### Load Order

Configuration files are loaded and merged in the following order:

1. **base.js** - Loaded first (required)
2. **<environment>.js** - Loaded second, overrides base settings
3. **secrets.js** (or the file pointed to by `CONF_SECRETS`) - Loaded third, overrides all previous settings
4. **`app_*` env vars** - Applied last, overrides everything (highest precedence)

Each subsequent layer deeply merges with the previous configuration, allowing you to override specific values while keeping others intact. Environment variables win over all files — this follows the [twelve-factor](https://12factor.net/config) convention that env vars are the highest-precedence config layer.

### Environment Variable Overrides (`app_*`)

Any environment variable whose name starts with `app_` is applied as a config
override with the highest precedence. The remainder of the name is split on
**double-underscore** (`__`) into a nested path into the config object:

| Env var | Sets | Type |
|---------|------|------|
| `app_database__host=env-db` | `conf.database.host` | string |
| `app_app__port=9090` | `conf.app.port` | number (`JSON.parse`) |
| `app_features__enableCache=false` | `conf.features.enableCache` | boolean (`JSON.parse`) |
| `app_oauth__jwtSecret=secret` | `conf.oauth.jwtSecret` | string |
| `app_oauth__token_lifetime__access_token=3600` | `conf.oauth.token_lifetime.access_token` | number |

Values are coerced via `JSON.parse` when the value is valid JSON (so numbers,
booleans, `null`, and JSON objects/arrays become real types), and kept as the
raw string otherwise (URLs, passwords, free-form text). Use double-underscore
`__` — not single `_` — so that keys containing underscores (like
`token_lifetime`) are kept intact rather than split further.

```bash
# Override a few values without touching any config file
app_database__host=prod-db.example.com \
app_database__password=super-secret \
app_app__port=8080 \
node app.js
```

Env vars with empty path segments (leading/trailing/repeated `__`, or just
`app_`) are ignored.

## How It Works

The package uses a multi-tiered configuration strategy inspired by Django's settings system:

1. **Shared Configuration** - Common settings go in `base.js`
2. **Environment-Specific** - Environment overrides go in `development.js`, `production.js`, etc.
3. **Secrets** - Sensitive data goes in `secrets.js` (add to `.gitignore`)
4. **Environment Variables** - Any `app_*` env var overrides everything above (highest precedence)

The environment is determined by the `NODE_ENV` environment variable (defaults to `development`).

> **Note on failures:** This library treats a broken or missing required configuration as a fatal startup error. If `base.js` cannot be loaded (missing file, syntax error, or runtime error), or if an unrecoverable error occurs while resolving or loading it, the library will call `process.exit(1)`. Optional files (`<environment>.js` and `secrets.js`) only log a warning and continue with an empty object when they are missing.

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
- **`CONF_SECRETS`** - Override the path to the secrets file (default: `<CONF_DIR>/secrets.js`). Relative paths are resolved from `process.cwd()`.
- **`app_*`** - Any env var prefixed with `app_` overrides the merged config at the
  highest precedence. The rest of the name is split on `__` into a nested path,
  and the value is `JSON.parse`-coerced when possible (see
  [Environment Variable Overrides](#environment-variable-overrides-app)).

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

### Custom Secrets File

You can point to a secrets file outside the default `conf/` directory. This is useful for deployments that store secrets in a system path such as `/etc/`:

```bash
CONF_SECRETS=/etc/appName.js node app.js
```

Relative paths are resolved from `process.cwd()`.

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
