import { defineUntypedSchema } from 'untyped'

export default defineUntypedSchema({
  appConfig: {
    test_from_schema: {
      $default: 'test',
      $schema: {
        description: 'manual description'
      }
    }
  }
})
