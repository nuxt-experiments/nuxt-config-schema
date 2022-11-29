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
  appConfig: {
    test1: '123'
  },
  anotherConfig: {

  },
  modules: [
    '../src/module'
  ],
  extends: [
    './base'
  ]
})
