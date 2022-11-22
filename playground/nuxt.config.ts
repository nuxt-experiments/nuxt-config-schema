import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
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
