import { onlineManager, focusManager } from 'vue-query'

export function useCordovaOnlineAndFocusState () {
  // Hook vue-query up to cordova online state
  // https://tanstack.com/query/v4/docs/reference/onlineManager#onlinemanagerseteventlistener
  onlineManager.setEventListener(setOnline => {
    return subscribe({
      online: () => setOnline(true),
      offline: () => setOnline(false),
    })
  })

  // Hook vue-query up to cordova focus state
  // https://tanstack.com/query/v4/docs/guides/window-focus-refetching#custom-window-focus-event
  focusManager.setEventListener(setFocused => {
    return subscribe({
      resume: () => setFocused(true),
      pause: () => setFocused(false),
    })
  })
}

// Just a utility to subscribe to events with handlers returning an unsubscribe function
function subscribe (options) {
  for (const type of Object.keys(options)) {
    const fn = options[type]
    document.addEventListener(type, fn, false)
  }
  return () => {
    for (const type of Object.keys(options)) {
      const fn = options[type]
      document.removeEventListener(type, fn)
    }
  }
}
