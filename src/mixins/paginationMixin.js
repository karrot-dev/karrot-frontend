export default {
  props: {
    canFetchPast: { default: false, type: Boolean },
    fetchPast: { type: Function },
  },
  methods: {
    async maybeFetchPast (index, done) {
      if (!this.canFetchPast) {
        await this.$nextTick()
        done()
        return
      }
      await this.fetchPast()
      done()
    },
  },
}
