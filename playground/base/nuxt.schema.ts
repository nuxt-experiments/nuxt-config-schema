export default defineNuxtConfigSchema({
  appConfig: {
    /** Configuration from nuxt.schema in base */
    base: 'from base/nuxt.schema',
    colors: {
      $resolve: (value = []) => ['gray'].concat(value)
    },
    /**
     * Links to be added somewhere
     *
     * @typedef Link
     * @property {string} icon - Icon name
     * @property {string} href - Link when clicking on the icon
     * @property {number} label - Label of the icon
     *
     * @type {Link[]}
     */
    links: []
  }
})
