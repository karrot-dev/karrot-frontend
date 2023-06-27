import { dom } from 'quasar'
import { vi } from 'vitest'

import { useDesktopUserAgent, useMobileUserAgent } from '>/helpers'
const { height } = dom

describe('detectMobileKeyboard', () => {
  let detectMobileKeyboard

  beforeEach(async () => {
    vi.resetModules()
    vi.spyOn(window, 'addEventListener')
  })

  describe('desktop', () => {
    beforeEach(async () => {
      useDesktopUserAgent()
      detectMobileKeyboard = (await import('./detectMobileKeyboard')).default
    })
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
    // beforeEach(() => { mockPlatform.is.mobile = true })
    beforeEach(async () => {
      useMobileUserAgent()
      detectMobileKeyboard = (await import('./detectMobileKeyboard')).default
    })
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
