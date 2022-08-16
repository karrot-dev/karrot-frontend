import conversations, { plugin as conversationsPlugin } from '@/messages/datastore/conversations'
import currentThread, { plugin as currentThreadPlugin } from '@/messages/datastore/currentThread'
import detail, { plugin as detailPlugin } from '@/messages/datastore/detail'

export default {
  modules: {
    conversations,
    currentThread,
    detail,
  },
  plugins: [
    conversationsPlugin,
    currentThreadPlugin,
    detailPlugin,
  ],
}
