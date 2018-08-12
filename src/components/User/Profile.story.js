import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Memberships from './Memberships'

let groupIdCnt = 1

function membershipFactory ({
  isCurrentGroup = false,
  isMember = true,
  trusted = false,
  trustedByCount = 2,
} = {}) {
  const groupId = groupIdCnt++
  const groupName = `group ${groupId}`
  const trustedBy = []
  for (let i = 1; i <= trustedByCount; i++) {
    trustedBy.push({
      id: i,
      displayName: `user ${i}`,
    })
  }
  return {
    createdAt: new Date(),
    roles: [],
    trustedBy,
    trusted,
    group: {
      id: groupId,
      name: groupName,
      isMember,
      isCurrentGroup,
    },
  }
}

const user = {
  id: 1,
  displayName: 'storybook user',
  isCurrentUser: false,
  memberships: [
    membershipFactory({ isCurrentGroup: true }),
    membershipFactory({ isMember: false, trustedByCount: 5 }),
    membershipFactory({ trusted: true }),
    membershipFactory({ trustedByCount: 5 }),
  ],
}

const defaultOn = {
  createTrust: action('create trust'),
}

storiesOf('User Profile', module)
  .add('memberships', () => defaults({
    render: h => h(Memberships, {
      props: {
        user,
      },
      on: defaultOn,
    }),
  }))
