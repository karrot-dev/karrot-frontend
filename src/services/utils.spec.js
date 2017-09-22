import { underscorize } from './utils'

describe('utils', () => {
  it('underscorizes', () => {
    expect(underscorize('displayName')).toEqual('display_name')
  })
})
