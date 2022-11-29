import { defineUntypedSchema } from 'untyped'

export default defineUntypedSchema({
  appConfig: {
    test2: {
      $default: 'from nuxt.schema'
    }
  },
  /** Config schema for another integration */
  anothetConfig: {
    aTest: '123'
  }
})
