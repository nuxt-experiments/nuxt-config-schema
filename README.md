# Nuxt Config Schema

This is a proof of concept module for a feature in Nuxt 3 that automatically infers and generates schema based on user provided configuration from several sources using [unjs/untyped](https://github.com/unjs/untyped) and supports extending layers.

Schema can be defined in `nuxt.schema.ts` or `$schema` field in `nuxt.config.ts`.

## Usage


1. Install `nuxt-config-schema` as dev dependency:

```sh
# npm
npm i -D nuxt-config-schema

# pnpm
pnpm add -D nuxt-config-schema

# yarn
yarn add nuxt-config-schema
```

2. Add module to `nuxt.config`:

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-config-schema'
  ]
})
```

You can access generated schema (json, markdown and types) from `.nuxt/schema/` directory and also `schema:resolved(schema)` hook from other modules.

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
