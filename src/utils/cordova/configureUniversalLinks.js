document.addEventListener('deviceready', onDeviceReady, false)

function onDeviceReady () {
  const { universalLinks } = window
  if (universalLinks) {
    universalLinks.subscribe('karrot', ({ path, hash }) => {
      if (path === '/' && hash) {
        window.location.hash = hash
      }
    })
  }
  else {
    console.error('window.universalLinks is not available, handling links will not work')
  }
}
