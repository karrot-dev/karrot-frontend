import { underscorize, objectDiff } from './utils'

describe('utils', () => {
  beforeEach(() => jest.resetModules())
  it('underscorizes', () => {
    expect(underscorize('displayName')).toEqual('display_name')
  })
})

describe('objectDiff', () => {
  it('works', () => {
    expect(objectDiff({ a: 'cat', b: 'calm' }, { a: 'mouse', b: 'calm' })).toEqual({ a: 'mouse' })
  })
})
