import { faker } from '@faker-js/faker'
import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'

import { cursorPaginated } from '>/mockBackend/mockAxios'

import { sample } from './offers'

import { db, ctx } from './index'

let nextId = 1
export function generateIssue (params = {}) {
  if (!params.group) throw new Error('must provide group')
  if (!params.affectedUser) {
    const group = db.groups.find(group => group.id === params.group)
    if (group.members.length === 0) throw new Error('no group members to pick from')
    params.affectedUser = sample(group.members)
  }
  if (!params.createdBy) params.createdBy = ctx.authUser?.id
  if (!params.createdBy) throw new Error('must be logged in or provide createdBy param')
  return {
    id: nextId++,
    createdAt: subDays(new Date(), 7 + 6),
    createdBy: null,
    status: 'ongoing',
    type: 'conflict_resolution',
    topic: faker.lorem.paragraphs(3),
    votings: [
      generateVoting({
        createdAt: subDays(new Date(), 2 * 7 + 6),
        expiresAt: subDays(new Date(), 7 + 6),
      }),
      generateVoting({
        createdAt: subDays(new Date(), 7 + 6),
        expiresAt: subDays(new Date(), 6),
      }),
      generateVoting({
        createdAt: subDays(new Date(), 6),
        expiresAt: addDays(new Date(), 1),
      }),
    ],
    ...params,
  }
}

let nextOptionId = 1
export function generateOption (params = {}) {
  return {
    id: nextOptionId++,
    type: 'further_discussion',
    sumScore: null,
    yourScore: 0,
    ...params,
  }
}

let nextVotingId = 1
export function generateVoting (params = {}) {
  if (!params.createdAt) throw new Error('must provide createdAt')
  if (!params.expiresAt) throw new Error('must provide expiresAt')
  return {
    id: nextVotingId++,
    createdAt: null,
    expiresAt: null,
    acceptedOption: null,
    options: [
      generateOption({
        type: 'further_discussion',
      }),
      generateOption({
        type: 'remove_user',
      }),
      generateOption({
        type: 'no_change',
      }),
    ],
    participantCount: 6,
    ...params,
  }
}

export function createMockIssuesBackend () {
  cursorPaginated('/api/issues/', ({ params }) => db.issues.filter(issue => {
    // TODO: implement other filters?
    if (params.status && params.status !== issue.status) return false
    return true
  }))
}
