// import { Events } from 'quasar'

export default store => {
  let timer = null
  const setAway = () => store.dispatch('presence/toggle/away', true)
  const resetTimer = () => {
    clearTimeout(timer)
    store.dispatch('presence/toggle/away', false)
    timer = setTimeout(setAway, 30 * 1000) // 30 seconds
  }

  ['load', 'mousemove', 'keydown', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'click']
    .forEach(event => document.addEventListener(event, resetTimer))

  // listen on tab & window visibility, mostly works on desktop browser
  /* Events.$on('app:visibility', state => {
    store.dispatch('presence/toggle/away', state === 'hidden')
  }) */
}
