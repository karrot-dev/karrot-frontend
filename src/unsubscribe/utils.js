import base62 from 'base62/lib/custom'

// This must match the one used inside django signing
const CHARSET = base62.indexCharset('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')

export function parseToken (token) {
  const [encodedValue, encodedTimestamp] = token.split(':', 3)
  if (!encodedValue || !encodedTimestamp) throw new Error('invalid token')
  const timestamp = base62.decode(encodedTimestamp, CHARSET) * 1000
  const {
    c: conversationId = null,
    t: threadId = null,
    g: groupId = null,
    gn: groupName,
  } = JSON.parse(atob(encodedValue))
  return {
    conversationId,
    threadId,
    groupId,
    groupName,
    timestamp,
  }
}
