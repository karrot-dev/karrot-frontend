document.adoptedStyleSheets = []

Object.assign(global.CSSStyleSheet.prototype, {
  replaceSync: () => {},
})
