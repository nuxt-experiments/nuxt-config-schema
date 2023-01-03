import { existsSync } from 'node:fs'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'pathe'
import { createDefu } from 'defu'
import { defineNuxtModule, createResolver } from '@nuxt/kit'
import {
  resolveSchema as resolveUntypedSchema,
  generateMarkdown,
  generateTypes,
} from 'untyped'
import type { Schema, SchemaDefinition } from 'untyped'
// @ts-ignore
import untypedPlugin from 'untyped/babel-plugin'
import jiti from 'jiti'

// TODO: Merge with raw schema of Nuxt for better type hints
export type NuxtConfigSchema = SchemaDefinition

declare module '@nuxt/schema' {
  interface NuxtConfig {
    ['$schema']?: NuxtConfigSchema
  }
  interface NuxtOptions {
    ['$schema']: NuxtConfigSchema
  }
  interface NuxtHooks {
    'schema:resolved': (schema: Schema) => void
    'schema:beforeWrite': (schema: Schema) => void
    'schema:written': () => void
  }
}

declare global {
  const defineNuxtConfigSchema: (schema: NuxtConfigSchema) => NuxtConfigSchema
}

export default defineNuxtModule({
  meta: {
    name: 'nuxt-config-schema',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Initialize untyped/jiti loader
    const virtualImports = await resolver.resolvePath(
      './runtime/virtual-imports'
    )
    const _require = jiti(dirname(import.meta.url), {
      esmResolve: true,
      interopDefault: true,
      cache: false,
      requireCache: false,
      alias: {
        '#imports': virtualImports,
        'nuxt/config': virtualImports,
      },
      transformOptions: {
        babel: {
          plugins: [untypedPlugin],
        },
      },
    })

    // Create custom merger to dedup defaults in arrays
    const _defu = createDefu((obj, key, value) => {
      if (Array.isArray(obj[key]) && Array.isArray(value)) {
        ;(obj as any)[key] = Array.from(new Set([...obj[key], ...value]))
        return true
      }
    })

    // Register module types
    nuxt.hook('prepare:types', (ctx) => {
      ctx.references.push({ path: 'nuxt-config-schema' })
      ctx.references.push({ path: 'schema/nuxt.schema.d.ts' })
    })

    // Resolve schema after all modules initialized
    let schema: Schema
    nuxt.hook('modules:done', async () => {
      schema = await resolveSchema()
    })

    // Writie schema after build to allow further modifications
    nuxt.hooks.hook('build:done', async () => {
      await nuxt.hooks.callHook('schema:beforeWrite', schema)
      await writeSchema(schema)
      await nuxt.hooks.callHook('schema:written')
    })

    // --- Bound utils ---

    async function resolveSchema() {
      // Global import
      // @ts-ignore
      globalThis.defineNuxtConfigSchema = (val: any) => val

      // Load schema from layers
      const schemas: Schema[] = []
      for (const layer of nuxt.options._layers) {
        const filePath = await resolver.resolvePath(
          resolve(layer.config.rootDir, 'nuxt.schema')
        )
        if (filePath && existsSync(filePath)) {
          let loadedConfig
          try {
            loadedConfig = _require(filePath)
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(
              '[nuxt-config-schema] Unable to load schema from',
              filePath,
              err
            )
            continue
          }
          const lastLayerDefaults = schemas.length
            ? (schemas[schemas.length - 1].default as any)
            : {}
          const schema = await resolveUntypedSchema(
            loadedConfig,
            lastLayerDefaults
          )
          schemas.push(schema)
        }
      }

      // Merge config sources and resolve schema
      // @ts-expect-error
      const mergedSchema = _defu(...schemas) as Schema
      const userSchema = await resolveUntypedSchema(
        nuxt.options.$schema,
        mergedSchema.default as any
      )
      const schema = _defu(userSchema, mergedSchema) as Schema

      // Allow hooking
      await nuxt.hooks.callHook('schema:resolved', schema)

      return schema
    }

    async function writeSchema(schema: Schema) {
      // Write it to build dir
      await mkdir(resolve(nuxt.options.buildDir, 'schema'), { recursive: true })
      await writeFile(
        resolve(nuxt.options.buildDir, 'schema/nuxt.schema.json'),
        JSON.stringify(schema, null, 2),
        'utf8'
      )
      const markdown = '# User config schema' + generateMarkdown(schema)
      await writeFile(
        resolve(nuxt.options.buildDir, 'schema/nuxt.schema.md'),
        markdown,
        'utf8'
      )
      const _types = generateTypes(schema, {
        addExport: true,
        interfaceName: 'NuxtUserConfig',
        partial: true,
      })
      const types =
        _types +
        `
export type UserAppConfig = Exclude<NuxtUserConfig['appConfig'], undefined>

declare module '@nuxt/schema' {
  interface NuxtConfig extends NuxtUserConfig {}
  interface NuxtOptions extends NuxtUserConfig {}
  interface AppConfigInput extends UserAppConfig {}
  interface AppConfig extends UserAppConfig {}
}`
      const typesPath = resolve(
        nuxt.options.buildDir,
        'schema/nuxt.schema.d.ts'
      )
      await writeFile(typesPath, types, 'utf8')
    }
  },
})
