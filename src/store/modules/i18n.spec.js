jest.mock('@/locales', () => {})

describe('i18n', () => {
  beforeEach(() => jest.resetModules())
  beforeEach(() => Object.defineProperty(global.navigator, 'languages', { writable: true }))

  it('finds most fitting locale', async () => {
    global.navigator.languages = ['fr', 'fr_FR', 'de-CH', 'en']
    jest.setMock('@/locales', {
      de: {},
      en: {},
    })
    expect(require('./i18n').detectLocale()).toEqual('de')
  })

  it('finds country-specific locale', async () => {
    global.navigator.languages = ['fr', 'de-CH', 'en']
    jest.setMock('@/locales', {
      'de-ch': {},
      de: {},
      en: {},
    })
    expect(require('./i18n').detectLocale()).toEqual('de-ch')
  })
})
