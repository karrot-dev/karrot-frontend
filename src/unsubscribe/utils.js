export function parseToken (token) {
  const [encodedValue] = token.split(':', 3)
  if (!encodedValue) throw new Error('invalid token')
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
  }
}
