import { storiesOf } from '@storybook/vue'

import CommunityFeed from './CommunityFeed'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

const range = n => [...Array(n).keys()]

let topicId = 0
const makeTopic = () => ({
  id: topicId++,
  link: '',
  isUnread: true,
  lastPosterAvatar: 'https://avatars3.githubusercontent.com/u/4410802?v=4',
  lastPosterUsername: 'tiltec',
  title: 'asdf',
  lastPostedAt: new Date(),
})

const topics = range(5).map(makeTopic)

storiesOf('CommunityFeed', module)
  .add('CommunityFeed', () => defaults({
    render: h => h(CommunityFeed),
    store: createDatastore({
      communityFeed: {
        getters: {
          unreadCount: () => 5,
          topics: () => topics,
        },
      },
    }),
  }))
