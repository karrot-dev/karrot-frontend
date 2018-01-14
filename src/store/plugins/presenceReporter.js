import { Events } from 'quasar'

export default store => {
  let timer = null
  const setAway = () => store.dispatch('presence/toggle/away', true)
  const resetTimer = () => {
    clearTimeout(timer)
    store.dispatch('presence/toggle/away', false)
    timer = setTimeout(setAway, 30 * 1000) // 30 seconds
  }

  // listen on events
  document.onload = resetTimer
  document.onmousemove = resetTimer
  document.onmousedown = resetTimer // touchscreen presses
  document.ontouchstart = resetTimer
  document.onclick = resetTimer // touchpad clicks
  document.onscroll = resetTimer // scrolling with arrow keys
  document.onkeypress = resetTimer

  // listen on tab & window visibility, mostly works on desktop browser
  Events.$on('app:visibility', state => {
    store.dispatch('presence/toggle/away', state === 'hidden')
  })
}
