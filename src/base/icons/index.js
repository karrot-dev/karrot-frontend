import Vue from 'vue'
import iconsData from './icons.json'

const iconsVM = new Vue({
  data () {
    return {
      iconStore: {
        ...iconsData,
      },
    }
  },
  methods: {
    get (name) {
      return this.iconStore[name]
    },
    getAll () {
      return this.iconStore
    },
    set (value) {
      this.iconStore = { ...value }
    },
    reset () {
      this.iconStore = { ...iconsData }
    },
  },
})

export const IconPlugin = {
  install (Vue, options) {
    Vue.prototype.$icon = iconsVM.get
  },
}

export default iconsVM
