import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  $schema: {
    appConfig: {
      test: {
        $default: 'test',
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
  ],
  appConfig: {
    /** Configuration from nuxt.config */
    test2: 2
  }
})
