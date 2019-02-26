export default function bindRoute (params) {
  // from https://jsfiddle.net/Herteby/1z4qsjds/
  const mixin = {
    computed: {},
  }
  for (let key in params) {
    let def = params[key]
    mixin.computed[key] = {
      get () {
        if (this.$route.query.hasOwnProperty(key)) {
          return this.$route.query[key]
        }
        else {
          return def
        }
      },
      set (val) {
        if (val === def) {
          // if value is same as the default, remove it from the query to keep the URL neat
          const query = { ...this.$route.query }
          delete query[key]
          this.$router.replace({ query })
        }
        else {
          this.$router.replace({ query: { ...this.$route.query, ...{ [key]: val } } })
        }
      },
    }
  }
  return mixin
}
