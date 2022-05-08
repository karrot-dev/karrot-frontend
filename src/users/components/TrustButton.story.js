import { h } from 'vue'
import { createDatastore, statusMocks } from '>/helpers'
import { storiesOf } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'

const datastore = createDatastore({
  users: { getters: { get: () => id => id } },
})

import TrustButton from './TrustButton'

let groupIdCnt = 1

// TODO use enrichedFactories
const groupFactory = ({
  isCurrentGroup = false,
  isMember = true,
} = {}) => {
  const groupId = groupIdCnt++
  const groupName = `group ${groupId}`
  return {
    id: groupId,
    name: groupName,
    isMember,
    isCurrentGroup,
  }
}

function membershipFactory ({
  trusted = false,
  trustedByCount = 2,
  isEditor = true,
  trustThresholdForNewcomer = 3,
} = {}) {
  const trustedBy = []
  for (let i = 1; i <= trustedByCount; i++) {
    trustedBy.push({
      id: i,
      displayName: `user ${i}`,
      isCurrentUser: trusted && i === 1,
    })
  }
  return {
    createdAt: new Date(),
    roles: [],
    trustedBy,
    trusted,
    trustProgress: isEditor ? 1 : trustedByCount / trustThresholdForNewcomer,
    isEditor,
    trustThresholdForNewcomer,
    trustUserStatus: statusMocks.default(),
    revokeTrustStatus: statusMocks.default(),
  }
}

const baseUser = {
  id: 1,
  email: 'asdf@asdf.com',
  displayName: 'storybook user',
  isCurrentUser: false,
  membership: membershipFactory(),
  groups: [
    groupFactory({ isCurrentGroup: true }),
    groupFactory({ isMember: true }),
    groupFactory({ isMember: false }),
  ],
}

const defaultOn = {
  onCreateTrust: action('create trust'),
  onDetail: action('open detail sidebar'),
  onSelectGroup: action('select group'),
}

storiesOf('TrustButton', module)
  .add('Trust Button - is editor', () => ({
    render: () => h(TrustButton, {
      user: baseUser,
      group: groupFactory(),
      membership: membershipFactory({ trustedByCount: 2 }),
      ...defaultOn,
    }),
    randomothething: 'is here',
    $$store: 'notastore',
    $store: 'alsonotastore',
    store: datastore,
  }))
  // .add('Trust Button - is newcomer', () => defaults({
  //   render: () => h(TrustButton, {
  //     user: baseUser,
  //     group: groupFactory(),
  //     membership: membershipFactory({ isEditor: false, trustedByCount: 2 }),
  //     ...defaultOn,
  //   }),
  //   store: datastore,
  // }))
  // .add('Trust Button - is newcomer without trust', () => defaults({
  //   render: () => h(TrustButton, {
  //     user: baseUser,
  //     group: groupFactory(),
  //     membership: membershipFactory({ isEditor: false, trustedByCount: 0 }),
  //     ...defaultOn,
  //   }),
  //   store: datastore,
  // }))
  // .add('Trust Button - one other trust', () => defaults({
  //   render: () => h(TrustButton, {
  //     user: baseUser,
  //     group: groupFactory(),
  //     membership: membershipFactory({ trustedByCount: 1 }),
  //     ...defaultOn,
  //   }),
  //   store: datastore,
  // }))
  // .add('Trust Button - multiple others trust', () => defaults({
  //   render: () => h(TrustButton, {
  //     user: baseUser,
  //     group: groupFactory(),
  //     membership: membershipFactory({ trustedByCount: 5 }),
  //     ...defaultOn,
  //   }),
  //   store: datastore,
  // }))
  // .add('Trust Button - I and others trust', () => defaults({
  //   render: () => h(TrustButton, {
  //     user: baseUser,
  //     group: groupFactory(),
  //     membership: membershipFactory({ trusted: true, trustedByCount: 5 }),
  //     ...defaultOn,
  //   }),
  //   store: datastore,
  // }))
  // .add('Trust Button - I trust', () => defaults({
  //   render: () => h(TrustButton, {
  //     user: baseUser,
  //     group: groupFactory(),
  //     membership: membershipFactory({ trusted: true, trustedByCount: 1 }),
  //     ...defaultOn,
  //   }),
  //   store: datastore,
  // }))
  // .add('My Trust Button', () => defaults({
  //   render: () => h(TrustButton, {
  //     user: {
  //       ...baseUser,
  //       isCurrentUser: true,
  //     },
  //     group: groupFactory(),
  //     membership: membershipFactory({ trustedByCount: 2 }),
  //     ...defaultOn,
  //   }),
  //   store: datastore,
  // }))
  // .add('small - My Trust Button', () => defaults({
  //   render: () => h(TrustButton, {
  //     user: {
  //       ...baseUser,
  //       isCurrentUser: true,
  //     },
  //     group: groupFactory(),
  //     membership: membershipFactory({ trustedByCount: 2 }),
  //     small: true,
  //     ...defaultOn,
  //   }),
  //   store: datastore,
  // }))
