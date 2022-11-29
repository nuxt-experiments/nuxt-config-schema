export default defineNuxtConfigSchema({
  appConfig: {
    /** Configuration from nuxt.schema in base */
    base: 'from base/nuxt.schema',
    colors: {
      $resolve: (value = []) => ['gray'].concat(value)
    }
  }
})
