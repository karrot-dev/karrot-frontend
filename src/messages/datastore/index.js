import conversations, { plugin as conversationsPlugin } from '@/messages/datastore/conversations'
import currentThread, { plugin as currentThreadPlugin } from '@/messages/datastore/currentThread'
import detail, { plugin as detailPlugin } from '@/messages/datastore/detail'
import latestMessages, { plugin as latestMessagesPlugin } from '@/messages/datastore/latestMessages'

export default {
  modules: {
    conversations,
    currentThread,
    detail,
    latestMessages,
  },
  plugins: [
    conversationsPlugin,
    currentThreadPlugin,
    detailPlugin,
    latestMessagesPlugin,
  ],
}
