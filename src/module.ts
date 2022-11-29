import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'pathe'
import { defu, createDefu } from 'defu'
import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { resolveSchema, generateMarkdown, generateTypes } from 'untyped'
import type { Schema, SchemaDefinition } from 'untyped'
import type { NuxtConfig } from '@nuxt/schema'
// @ts-ignore
import untypedPlugin from 'untyped/babel-plugin'
import jiti from 'jiti'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['$schema']?: SchemaDefinition }
  interface NuxtOptions { ['$schema']: SchemaDefinition }
  interface NuxtHooks {
    'schema:resolved': (schema: Schema) => void
  }
}

export type NuxtSchema = NuxtConfig & SchemaDefinition

export default defineNuxtModule({
  meta: {
    name: 'nuxt-config-schema'
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Initialize untyped loaded with jiti
    const virtualImports = await resolver.resolvePath('./runtime/virtual-imports')
    const _require = jiti(dirname(import.meta.url), {
      esmResolve: true,
      interopDefault: true,
      cache: false,
      requireCache: false,
      alias: {
        '#imports': virtualImports
      },
      transformOptions: {
        babel: {
          plugins: [
            untypedPlugin
          ]
        }
      }
    })
    const tryResolve = (id: string) => { try { return _require.resolve(id) } catch (err) {} }

    // Mock defineAppConfig and defineNuxtConfig globals
    const fn = (val: any) => val
    // @ts-ignore
    globalThis.defineNuxtConfig = globalThis.defineNuxtConfig || fn
    // @ts-ignore
    globalThis.defineAppConfig = globalThis.defineAppConfig || fn

    // Scan for config sources to infer schema
    const configs = []
    for (const layer of nuxt.options._layers) {
      const filePath = tryResolve(resolve(layer.config.rootDir, 'nuxt.schema'))
      if (filePath && existsSync(filePath)) {
        let loadedConfig
        try {
          loadedConfig = _require(filePath)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[nuxt-config-schema] Unable to load schema from', filePath, err)
          continue
        }
        configs.push(loadedConfig)
      }
    }

    // Create custom merger to dedup defaults in arrays
    const _defu = createDefu((obj, key, value) => {
      if (Array.isArray(obj[key]) && Array.isArray(value)) {
        (obj as any)[key] = Array.from(new Set([...obj[key], ...value]))
        return true
      }
    })

    // Merge config sources and resolve schema
    // @ts-expect-error
    const meergedConfigs = defu(...configs)
    const inferedSchema = await resolveSchema(meergedConfigs)
    const userSchema = await resolveSchema(nuxt.options.$schema)
    const schema = _defu(inferedSchema, userSchema)

    // Allow hooking
    await nuxt.hooks.callHook('schema:resolved', schema)

    // Merge defaults to nuxt options
    nuxt.options = _defu(nuxt.options, schema.default as any) as any

    // Write it to build dir
    await mkdir(resolve(nuxt.options.buildDir, 'schema'), { recursive: true })
    await writeFile(resolve(nuxt.options.buildDir, 'schema/nuxt.schema.json'), JSON.stringify(schema, null, 2), 'utf8')
    const markdown = '# User config schema' + generateMarkdown(schema)
    await writeFile(resolve(nuxt.options.buildDir, 'schema/nuxt.schema.md'), markdown, 'utf8')
    const types = generateTypes(schema, { addExport: true, interfaceName: 'NuxtUserConfig' })
    await writeFile(resolve(nuxt.options.buildDir, 'schema/nuxt.schema.d.ts'), types, 'utf8')
  }
})
