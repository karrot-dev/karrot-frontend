export default {
  props: {
    hasMore: { default: false, type: Boolean },
    fetchMore: { type: Function },
  },
  methods: {
    loadMore (index, done) {
      if (!this.hasMore) {
        done()
        return
      }
      this.fetchMore().then(done)
    },
  },
}
