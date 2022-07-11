// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
