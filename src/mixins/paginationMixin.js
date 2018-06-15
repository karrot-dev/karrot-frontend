export default {
  props: {
    hasMore: { default: false, type: Boolean },
    fetchMore: { type: Function },
  },
  methods: {
    async loadMore (index, done) {
      if (!this.hasMore) {
        await this.$nextTick()
        done()
        return
      }
      await this.fetchMore()
      done()
    },
  },
}
