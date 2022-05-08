import { reactive } from 'vue'

const state = reactive({
  value: new Date(),
})

setInterval(() => { state.value = new Date() }, 10 * 1000)

export default state
