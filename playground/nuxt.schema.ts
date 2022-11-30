export default defineNuxtConfigSchema({
  appConfig: {
    /**
     * An optional configuration
     *
     * @type {string}
     */
    optional: undefined,
    test2: {
      $default: 'from nuxt.schema'
    },
    colors: ['green']
  },
  /** Config schema for another integration */
  anotherConfig: {
    aTest: '123'
  }
})
