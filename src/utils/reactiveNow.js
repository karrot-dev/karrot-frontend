import { createApp } from 'vue'

export default createApp({
  data () {
    return {
      value: new Date(),
    }
  },
  created () {
    setInterval(() => { this.value = new Date() }, 10 * 1000)
  },
})
