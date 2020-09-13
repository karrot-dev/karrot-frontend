import Vue from 'vue'
import datastore from '@/store'

const status = new Vue({
  data () {
    return {
      foreground: true,
      online: null,
    }
  },
  created () {
    this.online = navigator.connection.type !== 'none'
    document.addEventListener('deviceready', () => {
      document.addEventListener('online', () => {
        this.online = true
      }, false)
      document.addEventListener('offline', () => {
        this.online = false
      }, false)

      document.addEventListener('resume', () => {
        this.foreground = true
      }, false)

      document.addEventListener('pause', () => {
        this.foreground = false
      }, false)
    }, false)
  },
})

// wait 5 seconds before triggering refresh
const refresh = () => setTimeout(() => datastore.commit('refresh/requestRefresh', true), 5000)

status.$watch('online', val => {
  if (val) refresh()
})

status.$watch('foreground', val => {
  if (val) refresh()
})
