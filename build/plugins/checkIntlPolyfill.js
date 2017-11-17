/* eslint-disable no-unused-expressions */
(function (main) {
  if (window.Intl) return main()
  var js = document.createElement('script')
  js.src = 'https://polyfill.io/v2/polyfill.js?features=Intl&unknown=polyfill'
  js.onload = main
  js.onerror = function () {
    console.error('Could not load polyfills script!')
    main()
  }
  document.head.appendChild(js)
})
