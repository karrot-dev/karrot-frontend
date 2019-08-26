const editableFn = _value => ({
  get: () => _value,
  set: (v) => { _value = v },
  configurable: true,
})

Object.defineProperty(navigator, 'userAgent', editableFn(navigator.userAgent))
