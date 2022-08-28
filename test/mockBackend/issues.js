import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'

import { sample } from './offers'

import { db, ctx } from './index'

let nextId = 1
export function generateIssue (params = {}) {
  if (!params.group) throw new Error('must provide group')
  if (!params.affectedUser) {
    const group = db.groups.find(group => group.id === params.group)
    params.affectedUser = sample(group.members).id
  }
  return {
    id: nextId++,
    createdAt: subDays(new Date(), 7 + 6),
    createdBy: ctx.authUser.id,
    status: 'ongoing',
    type: 'conflict_resolution',
    topic: 'I complain about this user',
    votings: [
      generateVoting({
        expiresAt: subDays(new Date(), 7 + 6),
      }),
      generateVoting({
        expiresAt: subDays(new Date(), 6),
      }),
      generateVoting({
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
  return {
    id: nextVotingId++,
    createdAt: subDays(new Date(), 6),
    expiresAt: addDays(new Date(), 7),
    acceptedOption: 74,
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
