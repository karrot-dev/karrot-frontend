import { reactive } from 'vue'
import iconsData from './icons.json'

const state = reactive({
  iconStore: {
    ...iconsData,
  },
})

export default {
  get (name) {
    return state.iconStore[name]
  },
  getAll () {
    return state.iconStore
  },
  set (value) {
    state.iconStore = { ...value }
  },
  reset () {
    state.iconStore = { ...iconsData }
  },
}
