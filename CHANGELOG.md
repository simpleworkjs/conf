# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/simpleworkjs/conf/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/simpleworkjs/conf/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/simpleworkjs/conf/releases/tag/v0.1.0
