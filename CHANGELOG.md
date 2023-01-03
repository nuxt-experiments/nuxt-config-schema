# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.4.0](https://github.com/pi0/nuxt-config-schema/compare/v0.3.8...v0.4.0) (2023-01-03)


### ⚠ BREAKING CHANGES

* avoid merging schema defaults to nuxt config

* avoid merging schema defaults to nuxt config ([fa095d1](https://github.com/pi0/nuxt-config-schema/commit/fa095d14f034b668397bf62156fe5a2fe7d29c00))

### [0.3.8](https://github.com/pi0/nuxt-config-schema/compare/v0.3.7...v0.3.8) (2023-01-03)

### [0.3.7](https://github.com/pi0/nuxt-config-schema/compare/v0.3.6...v0.3.7) (2022-12-21)


### Features

* `schema:beforeWrite` and `schema:written` hooks ([a152530](https://github.com/pi0/nuxt-config-schema/commit/a1525300e4ca499ffb9f514d3206aa71a5340b44))

### [0.3.6](https://github.com/pi0/nuxt-config-schema/compare/v0.3.5...v0.3.6) (2022-12-14)

### [0.3.5](https://github.com/pi0/nuxt-config-schema/compare/v0.3.4...v0.3.5) (2022-12-13)

### [0.3.4](https://github.com/pi0/nuxt-config-schema/compare/v0.3.3...v0.3.4) (2022-11-29)

### [0.3.3](https://github.com/pi0/nuxt-config-schema/compare/v0.3.2...v0.3.3) (2022-11-29)


### Features

* schema declarations for `nuxt.config` and `app.config` ([011e3e3](https://github.com/pi0/nuxt-config-schema/commit/011e3e366c8dc6bdd693905c1d25eb0f3fc0e1a0))

### [0.3.2](https://github.com/pi0/nuxt-config-schema/compare/v0.3.1...v0.3.2) (2022-11-29)


### Features

* allow chaining resolvers with upper layer ([84c215f](https://github.com/pi0/nuxt-config-schema/commit/84c215fb91b6705a9c74e45d8fe55840d5517d2b))

### [0.3.1](https://github.com/pi0/nuxt-config-schema/compare/v0.3.0...v0.3.1) (2022-11-29)

## [0.3.0](https://github.com/pi0/nuxt-config-schema/compare/v0.2.1...v0.3.0) (2022-11-29)


### ⚠ BREAKING CHANGES

* explicit `$schema` and `nuxt.schema` sources

### Features

* allow defining with `defineNuxtConfigSchema` ([a6b3057](https://github.com/pi0/nuxt-config-schema/commit/a6b30570014680897b86c574b79d2e7e76aa3ed9))
* explicit `$schema` and `nuxt.schema` sources ([1c71b41](https://github.com/pi0/nuxt-config-schema/commit/1c71b4135f5c411af78464878c3535d2fa57964f))


### Bug Fixes

* apply defaults after hook ([21c4849](https://github.com/pi0/nuxt-config-schema/commit/21c48495302230dd128b07a052c5c1064be991f9))

### [0.2.1](https://github.com/pi0/nuxt-config-schema/compare/v0.2.0...v0.2.1) (2022-11-29)


### Bug Fixes

* soft warning if unable to load config ([b691f55](https://github.com/pi0/nuxt-config-schema/commit/b691f5573d2c5ef3aa799d8b3ff5a2e35941225d))

## 0.2.0 (2022-11-29)


### Features

* apply defaults from schema and use correct types ([3362d14](https://github.com/pi0/nuxt-config-schema/commit/3362d140d2715e6e6b4a58edeede7aa74a4caf02))
* mock global `defineNuxtConfig` and `defineAppConfig` ([faa6945](https://github.com/pi0/nuxt-config-schema/commit/faa6945852dba49aba292446a54bf1c2385b2228))
