import { createConnect } from 'vuex-connect'

export const connect = createConnect((options, lifecycle) => {
  options.beforeRouteEnter = function (to, from, next) {
    return lifecycle.beforeRouteEnter.call(this, this.store, to, from, next)
  }

  options.beforeRouteUpdate = function (to, from, next) {
    return lifecycle.beforeRouteUpdate.call(this, this.store, to, from, next)
  }

  options.beforeRouteLeave = function (to, from, next) {
    return lifecycle.beforeRouteLeave.call(this, this.store, to, from, next)
  }
})
