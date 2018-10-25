import { createStore, statusMocks, storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

const store = createStore({
  users: { getters: { get: () => id => id } },
})

import Profile from './ProfileUI'
import TrustButton from './TrustButton'

let groupIdCnt = 1

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
  createTrust: action('create trust'),
  detail: action('open detail sidebar'),
  selectGroup: action('select group'),
}

storiesOf('User Profile', module)
  .add('Profile', () => defaults({
    render: h => h(Profile, {
      props: {
        user: baseUser,
        currentGroup: { name: 'my current group' },
      },
      on: defaultOn,
    }),
    store,
  }))
  .add('Trust Button - is editor', () => defaults({
    render: h => h(TrustButton, {
      props: {
        user: baseUser,
        group: groupFactory(),
        membership: membershipFactory({ trustedByCount: 2 }),
      },
      on: defaultOn,
    }),
    store,
  }))
  .add('Trust Button - is newcomer', () => defaults({
    render: h => h(TrustButton, {
      props: {
        user: baseUser,
        group: groupFactory(),
        membership: membershipFactory({ isEditor: false, trustedByCount: 2 }),
      },
      on: defaultOn,
    }),
    store,
  }))
  .add('Trust Button - is newcomer without trust', () => defaults({
    render: h => h(TrustButton, {
      props: {
        user: baseUser,
        group: groupFactory(),
        membership: membershipFactory({ isEditor: false, trustedByCount: 0 }),
      },
      on: defaultOn,
    }),
    store,
  }))
  .add('Trust Button - one other trust', () => defaults({
    render: h => h(TrustButton, {
      props: {
        user: baseUser,
        group: groupFactory(),
        membership: membershipFactory({ trustedByCount: 1 }),
      },
      on: defaultOn,
    }),
    store,
  }))
  .add('Trust Button - multiple others trust', () => defaults({
    render: h => h(TrustButton, {
      props: {
        user: baseUser,
        group: groupFactory(),
        membership: membershipFactory({ trustedByCount: 5 }),
      },
      on: defaultOn,
    }),
    store,
  }))
  .add('Trust Button - I and others trust', () => defaults({
    render: h => h(TrustButton, {
      props: {
        user: baseUser,
        group: groupFactory(),
        membership: membershipFactory({ trusted: true, trustedByCount: 5 }),
      },
      on: defaultOn,
    }),
    store,
  }))
  .add('Trust Button - I trust', () => defaults({
    render: h => h(TrustButton, {
      props: {
        user: baseUser,
        group: groupFactory(),
        membership: membershipFactory({ trusted: true, trustedByCount: 1 }),
      },
      on: defaultOn,
    }),
    store,
  }))
  .add('My Trust Button', () => defaults({
    render: h => h(TrustButton, {
      props: {
        user: {
          ...baseUser,
          isCurrentUser: true,
        },
        group: groupFactory(),
        membership: membershipFactory({ trustedByCount: 2 }),
      },
      on: defaultOn,
    }),
    store,
  }))
