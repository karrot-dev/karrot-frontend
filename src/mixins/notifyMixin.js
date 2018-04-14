export default {
  methods: {
    notify (message, config) {
      let defaultConfig = {
        type: 'positive',
        actions: [
          {
            icon: 'close',
            handler: () => {},
          },
        ],
      }

      this.$q.notify({
        ...defaultConfig,
        ...config,
        message: this.$t(message),
      })
    },
  },
}
