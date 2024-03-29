import { vi } from 'vitest'

const validToken = `
  eyJ1IjoxLCJnIjoxLCJnbiI6Ikdyb3V
  wIEpvZGlib3JvdWdoIiwiYyI6MSwibi
  I6Im5ld19hcHBsaWNhdGlvbiJ9:1giL
  8Q:MHK-OCcBEY41GgzlKSwhn1W7ie4
`.replace(/\s/g, '')

describe('spec', () => {
  beforeEach(() => { vi.resetModules() })

  it('can parse tokens', async () => {
    const { parseToken } = await import('./utils')
    expect(parseToken(validToken)).toEqual({
      conversationId: 1,
      groupId: 1,
      groupName: 'Group Jodiborough',
      notificationType: 'new_application',
      threadId: null,
    })
  })

  it('errors with invalid tokens', async () => {
    const { parseToken } = await import('./utils')
    expect(() => parseToken('totallynotavalidtoken')).toThrow()
  })
})
