// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
