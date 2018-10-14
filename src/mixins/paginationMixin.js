export default {
  props: {
    canFetchPast: { default: false, type: Boolean },
    fetchPast: { type: Function },
    fetchPastStatus: { default: null, type: Object },
  },
  methods: {
    async maybeFetchPast (index, done) {
      if (this.fetchPastStatus && this.fetchPastStatus.pending) {
        await this.$nextTick()
        // don't call done() here because we didn't start the request
        return
      }
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
