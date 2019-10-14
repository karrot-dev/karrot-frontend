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
    get: function (name, fw) {
      return this.iconStore[name] + (fw ? ' fa-fw' : '')
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
