import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'pathe'
import { defu } from 'defu'
import { defineNuxtModule } from '@nuxt/kit'
import { resolveSchema, generateMarkdown, generateTypes } from 'untyped'
import type { Schema } from 'untyped'
// @ts-ignore
import untypedPlugin from 'untyped/babel-plugin'
import jiti from 'jiti'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['$schema']: Schema }
  interface NuxtOptions { ['$schema']?: Schema }
  interface NuxtHooks {
    'schema:resolved': (schema: Schema) => void
  }
}

export default defineNuxtModule({
  meta: {
    name: 'nuxt-config-schema'
  },
  async setup (_options, nuxt) {
    // Initialize untyped loaded with jiti
    const _require = jiti(dirname(import.meta.url), {
      esmResolve: true,
      interopDefault: true,
      alias: {
        '#imports': fileURLToPath(new URL('./runtime/virtual-imports.ts', import.meta.url))
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
      for (const file of [layer.configFile, 'app.config', 'nuxt.schema']) {
        const filePath = tryResolve(resolve(layer.config.rootDir, file))
        if (filePath && existsSync(filePath)) {
          let loadedConfig = _require(filePath)
          delete loadedConfig.$schema
          if (file === 'app.config') {
            loadedConfig = { appConfig: loadedConfig }
          }
          configs.push(loadedConfig)
        }
      }
    }

    // Meged config sources and resolve schema
    // @ts-expect-error
    const meergedConfigs = defu(...configs)
    const inferedSchema = await resolveSchema(meergedConfigs)

    // Merge with direct schema
    const schema = defu(inferedSchema, nuxt.options.$schema)

    // Allow hooking
    await nuxt.hooks.callHook('schema:resolved', schema)

    // Write it to build dir
    await mkdir(resolve(nuxt.options.buildDir, 'schema'), { recursive: true })
    await writeFile(resolve(nuxt.options.buildDir, 'schema/nuxt.schema.json'), JSON.stringify(schema, null, 2), 'utf8')
    const markdown = '# User config schema' + generateMarkdown(schema)
    await writeFile(resolve(nuxt.options.buildDir, 'schema/nuxt.schema.md'), markdown, 'utf8')
    const types = generateTypes(schema, { addExport: true, interfaceName: 'NuxtUserConfig' })
    await writeFile(resolve(nuxt.options.buildDir, 'schema/nuxt.schema.d.ts'), types, 'utf8')
  }
})
