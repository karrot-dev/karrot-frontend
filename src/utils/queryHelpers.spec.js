import { extractCursor } from '@/utils/queryHelpers'

describe('queryHelpers', () => {
  describe('extractCursor', () => {
    it('can pull out cursor param from absolute path', () => {
      expect(
        extractCursor('/blah/foo/blah/?some=param&id=12&cursor=abc123&foo=bar'),
      ).toEqual('abc123')
    })

    it('can pull out cursor param from full path', () => {
      expect(
        extractCursor('https://example.com/blah/foo/blah/?some=param&id=12&cursor=abc123&foo=bar'),
      ).toEqual('abc123')
    })

    it('returns nothing when there is no cursor param', () => {
      expect(
        extractCursor('/blah/foo/blah/?some=param&id=12&foo=bar'),
      ).toBeNull()
    })

    it('returns nothing when there are no params', () => {
      expect(
        extractCursor('/blah/foo/blah/'),
      ).toBeNull()
    })
  })
})
