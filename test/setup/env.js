import { vi } from 'vitest'

process.env.KARROT = {
  THEME: 'dev',
}

// We use scrollIntoView but in jsdom it doesn't make sense:
//   "We can't really implemented it since we don't do layout."
// See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = vi.fn()
