import { reactive, watch } from 'vue'
import datastore from '@/store'

const state = reactive({
  foreground: true,
  online: null,
})

state.online = navigator.connection.type !== 'none'
document.addEventListener('deviceready', () => {
  document.addEventListener('online', () => {
    state.online = true
  }, false)
  document.addEventListener('offline', () => {
    state.online = false
  }, false)

  document.addEventListener('resume', () => {
    state.foreground = true
  }, false)

  document.addEventListener('pause', () => {
    state.foreground = false
  }, false)
}, false)

// wait 5 seconds before triggering refresh
const refresh = () => setTimeout(() => datastore.commit('refresh/requestRefresh', true), 5000)

watch(() => status.online, val => {
  if (val) refresh()
})

watch(() => status.foreground, val => {
  if (val) refresh()
})
