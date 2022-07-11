<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

export default async ({ store: datastore, Vue }) => {
  return new Vue({
    watch: {
      '$q.appVisible' (val) {
        // listen on tab & window visibility, mostly works on desktop browsers
        datastore.dispatch('presence/toggle/away', !val)
      },
    },
    created () {
      let timer = null
      const setAway = () => datastore.dispatch('presence/toggle/away', true)
      const resetTimer = () => {
        clearTimeout(timer)
        datastore.dispatch('presence/toggle/away', false)
        timer = setTimeout(setAway, 30 * 1000) // 30 seconds
      }
=======
import { watch } from 'vue'
import { AppVisibility } from 'quasar'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

export default async ({ store: datastore, app }) => {
  let timer = null
  const setAway = () => datastore.dispatch('presence/toggle/away', true)
  const resetTimer = () => {
    clearTimeout(timer)
    datastore.dispatch('presence/toggle/away', false)
    timer = setTimeout(setAway, 30 * 1000) // 30 seconds
  }

  ['load', 'mousemove', 'keydown', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'click']
    .forEach(event => document.addEventListener(event, resetTimer, { passive: true }))

  watch(() => AppVisibility.appVisible, val => {
    // listen on tab & window visibility, mostly works on desktop browsers
    datastore.dispatch('presence/toggle/away', !val)
  })
}
