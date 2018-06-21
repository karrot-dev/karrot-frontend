import { dom } from 'quasar'
import Vue from 'vue'
import { configureQuasar, useDesktopUserAgent, useMobileUserAgent } from '>/helpers'

const { height } = dom

describe('detectMobileKeyboard', () => {
  let originalWindowAddEventListener, detectMobileKeyboard

  beforeEach(() => {
    jest.resetModules()
    originalWindowAddEventListener = window.addEventListener
    window.addEventListener = jest.fn().mockImplementation(function () {
      originalWindowAddEventListener.apply(window, arguments)
    })
    configureQuasar(Vue)
    detectMobileKeyboard = require('./detectMobileKeyboard').default
  })

  afterEach(() => {
    window.addEventListener = originalWindowAddEventListener
  })

  describe('desktop', () => {
    beforeEach(() => useDesktopUserAgent())
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
    beforeEach(() => useMobileUserAgent())
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
