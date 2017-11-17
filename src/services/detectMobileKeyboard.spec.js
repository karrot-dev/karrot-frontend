import { dom } from 'quasar'
const { height } = dom

Object.defineProperty(window.navigator, 'userAgent', (userAgent => {
  return {
    get () {
      return userAgent
    },
    set (newVal) {
      userAgent = newVal
    },
  }
})(window.navigator.userAgent))

const desktopUserAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0'
const mobileUserAgent = 'Mozilla/5.0 (Linux; Android 4.4.2; de-de; SAMSUNG GT-I9195 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36'

describe('detectMobileKeyboard', () => {
  let originalWindowAddEventListener, detectMobileKeyboard

  function loadWithUserAgent (userAgent) {
    window.navigator.userAgent = userAgent
    detectMobileKeyboard = require('./detectMobileKeyboard').default
  }

  beforeEach(() => {
    originalWindowAddEventListener = window.addEventListener
    window.addEventListener = jest.fn().mockImplementation(function () {
      originalWindowAddEventListener.apply(window, arguments)
    })
  })

  afterEach(() => {
    window.addEventListener = originalWindowAddEventListener
  })

  beforeEach(() => jest.resetModules())

  describe('desktop', () => {
    beforeEach(() => loadWithUserAgent(desktopUserAgent))
    it('defaults to closed', () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
    })
    it('does not register resize handler', () => {
      expect(window.addEventListener).not.toBeCalledWith('resize', expect.any(Function))
    })
    it('says closed even if size changes by >150', async () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
      window.innerHeight = height(window) - 151
      window.dispatchEvent(new Event('resize'))
      expect(detectMobileKeyboard.is.open).toBe(false)
    })
  })

  describe('mobile', () => {
    beforeEach(() => loadWithUserAgent(mobileUserAgent))
    it('defaults to closed', () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
    })
    it('registers resize handler', () => {
      expect(window.addEventListener).toBeCalledWith('resize', expect.any(Function))
    })
    it('says closed if size changes by <=150', async () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
      window.innerHeight = height(window) - 150
      window.dispatchEvent(new Event('resize'))
      expect(detectMobileKeyboard.is.open).toBe(false)
    })
    it('says open if size changes by >150', async () => {
      expect(detectMobileKeyboard.is.open).toBe(false)
      window.innerHeight = height(window) - 151
      window.dispatchEvent(new Event('resize'))
      expect(detectMobileKeyboard.is.open).toBe(true)
    })
  })
})
