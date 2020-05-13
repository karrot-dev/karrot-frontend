import conversationsPlugin from '@/messages/datastore/conversationsPlugin'
import conversations from '@/messages/datastore/conversations'
import currentThread from '@/messages/datastore/currentThread'
import detail, { plugin as detailPlugin } from '@/messages/datastore/detail'
import latestMessages from '@/messages/datastore/latestMessages'

export default {
  modules: {
    conversations,
    currentThread,
    detail,
    latestMessages,
  },
  plugins: [
    conversationsPlugin,
    detailPlugin,
  ],
}
