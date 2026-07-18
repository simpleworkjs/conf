# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-07-17

### Added
- `CONF_SECRETS` environment variable to override the path to the secrets file.
  Useful for deployments that store secrets outside the project directory, e.g.
  `CONF_SECRETS=/etc/appName.js`. Relative paths are resolved from
  `process.cwd()`.

### Changed
- `CONF_DIR` relative paths are now resolved from `process.cwd()`.
- Upgraded CI coverage upload to `codecov/codecov-action@v4` with token.
- Improved config loader error handling: `MODULE_NOT_FOUND` is now only treated
  as a missing config file when the config file itself is absent; runtime errors
  in required files cause `process.exit(1)`.
- Suppressed expected console warnings/errors during tests for cleaner output.

### Fixed
- Renamed misleading test asserting cached module identity.
- Documented `process.exit(1)` behavior for broken/missing required config files.

## [1.1.0] - 2026-07-11

### Added
- `app_*` environment-variable overrides: any env var whose name starts with
  `app_` overrides the merged configuration as the highest-precedence layer
  (winning over `base.js`, `<environment>.js`, and `secrets.js`). The remainder
  of the name is split on double-underscore (`__`) into a nested path. Values
  are coerced via `JSON.parse` when possible (numbers, booleans, null, JSON
  objects/arrays) and kept as raw strings otherwise. For example:
  `app_database__host=env-db` sets `conf.database.host`; `app_app__port=9090`
  sets a numeric `conf.app.port`; `app_smtp__secure=false` sets a boolean
  `false`; `app_oauth__token_lifetime__access_token=3600` reaches the
  underscore-bearing key `oauth.token_lifetime.access_token`.

## [1.0.0] - 2025-12-30

### Added
- TypeScript definitions (index.d.ts) for better IDE support and type safety
- Comprehensive JSDoc comments for all functions
- Support for `CONF_DIR` environment variable to override config directory location
- Example configuration files in `examples/` directory
- Example Express application demonstrating usage
- Keywords in package.json for better npm discoverability
- Detailed API reference in README
- Best practices section in README
- Comprehensive test suite using Mocha and Chai
- Test coverage reporting with c8
- GitHub Actions CI/CD workflow
- Tests for all core functionality, error handling, and edge cases
- Development and contributing guidelines

### Changed
- Improved README with better structure, table of contents, and formatting
- Enhanced package.json with metadata, files list, and engine requirements
- Refactored path construction using Node.js `path` module for better reliability
- Updated LICENSE copyright year to 2025
- Improved error messages and warnings

### Fixed
- Fixed `console.dir` bug (changed to `console.error` for proper error logging)
- More robust config directory detection using `process.cwd()` instead of string splitting

## [0.1.0] - 2024

### Added
- Initial release
- Multi-tiered configuration loading (base, environment, secrets)
- Deep merge of configuration objects using `extend` package
- Environment-based configuration (NODE_ENV)
- Support for both JavaScript and JSON configuration files
- Automatic `environment` property injection

[Unreleased]: https://github.com/simpleworkjs/conf/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/simpleworkjs/conf/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/simpleworkjs/conf/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/simpleworkjs/conf/releases/tag/v0.1.0
