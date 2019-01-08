import Vue from 'vue'

export default new Vue({
  data: {
    value: new Date(),
  },
  created () {
    setInterval(() => { this.value = new Date() }, 10 * 1000)
  },
})
