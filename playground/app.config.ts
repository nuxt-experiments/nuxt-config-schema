import { defineAppConfig } from '#imports'

export default defineAppConfig({
  $schema: {
    test: {
      $schema: {
        description: 'manual description'
      }
    }
  },
  /** Configuration from app.config */
  test1: 1
})
