# Examples

This directory contains example configuration files and a sample application demonstrating how to use `@simpleworkjs/conf`.

## Files

- **conf/base.js** - Base configuration shared across all environments
- **conf/development.js** - Development environment overrides
- **conf/production.js** - Production environment overrides
- **conf/secrets.js.example** - Template for sensitive configuration (copy to `secrets.js`)
- **app.js** - Example Express application using the configuration

## Running the Examples

### 1. Setup

Copy the example configuration to your project root:

```bash
# From your project root
cp -r node_modules/@simpleworkjs/conf/examples/conf ./conf
```

### 2. Create secrets file

```bash
cp conf/secrets.js.example conf/secrets.js
```

Edit `conf/secrets.js` with your actual credentials (this file should be in `.gitignore`).

### 3. Run the example application

```bash
# Development (default)
node examples/app.js

# Production
NODE_ENV=production node examples/app.js
```

### 4. Test the endpoints

```bash
# Home page
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health

# Debug config (only available in development)
curl http://localhost:3000/debug/config
```

## What to Notice

- The `environment` property is automatically added to the config
- Values from `base.js` are overridden by environment-specific files
- Secrets from `secrets.js` override everything else
- The configuration is deeply merged, so you only need to specify what changes

## Next Steps

1. Customize the configuration files for your needs
2. Add `conf/secrets.js` to your `.gitignore`
3. Use `conf` throughout your application with `require('@simpleworkjs/conf')`
