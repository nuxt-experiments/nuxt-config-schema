import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Direct schema defenition
  $schema: {
    appConfig: {
      test1: {
        $default: 'from nuxt config',
        $schema: {
          description: 'manual description'
        }
      }
    }
  },
  modules: [
    '../src/module'
  ],
  extends: [
    './base'
  ]
})
