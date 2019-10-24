import differenceInSeconds from 'date-fns/differenceInSeconds'
import dateFnsHelper from '@/utils/dateFnsHelper'

// time difference in seconds of any two messages to be included into the same group
const MESSAGE_GROUP_DISTANCE = 60
// time difference in seconds of subsequent messages to be included into the same group
const SUBSEQUENT_MESSAGE_DISTANCE = 30

export default function groupedMessagesMixin (path) {
  return ({
    computed: {
      groupedMessages () {
        const messages = path.reduce((acc, key) => acc[key], this)
        let groupHeading = { timestamp: '', createdAt: 0 }
        let prevMessage = { createdAt: 0, author: { id: -1 } }
        for (const message of messages) {
          const timestamp = dateFnsHelper.formatDistanceToNow(message.createdAt)
          // group messages together if their author is the same and:
          // 1. their "... ago" label is the same
          // 2. the difference to last group heading is small enough
          //    (prevents messages from jumping from one group to another)
          // 3. two subsequent messages are close enough
          if (message.author.id === prevMessage.author.id &&
          (timestamp === groupHeading.timestamp ||
            differenceInSeconds(message.createdAt, groupHeading.createdAt) < MESSAGE_GROUP_DISTANCE ||
            differenceInSeconds(message.createdAt, prevMessage.createdAt) < SUBSEQUENT_MESSAGE_DISTANCE
          )) {
            message.continuation = true
          }
          else {
            message.continuation = false
            groupHeading = { timestamp, createdAt: message.createdAt }
          }
          prevMessage = message
        }
        return messages
      },
    },
  })
}
