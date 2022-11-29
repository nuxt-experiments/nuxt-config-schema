export default defineNuxtConfigSchema({
  appConfig: {
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
