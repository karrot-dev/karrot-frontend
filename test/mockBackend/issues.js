import { faker } from '@faker-js/faker'
import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'
import { sum, uniq } from 'lodash'

import { toResponse as toConversationResponse } from '>/mockBackend/conversations'
import { cursorPaginated, get, getById, post } from '>/mockBackend/mockAxios'
import { realSample } from '>/mockBackend/utils'

import { db, ctx, createIssue } from './index'

let nextId = 1
export function generateIssue (params = {}) {
  if (!params.group) throw new Error('must provide group')
  if (!params.affectedUser) {
    const group = db.groups.find(group => group.id === params.group)
    if (group.members.length === 0) throw new Error('no group members to pick from')
    params.affectedUser = realSample(group.members)
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
    // votes are internal only e.g. [{ user: 1, score: 2 }, { user: 2, score: 3 }]
    // we generate sumScore/yourScore from these...
    $votes: [],
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
    participantCount: 6, // TODO: calculate from $votes in toResponse
    ...params,
  }
}

function toResponse (issue) {
  return {
    ...issue,
    votings: issue.votings.map(voting => {
      return {
        ...voting,
        // TODO: is this visible the whole time?
        participantCount: uniq(voting.options.flatMap(option => option.$votes.map(vote => vote.user))).length,
        options: voting.options.map(option => {
          return {
            ...option,
            // TODO: I _guess_ we only show sumScore when there is accepted option?
            sumScore: voting.acceptedOption ? sum(option.$votes.map(vote => vote.score)) : null,
            yourScore: option.$votes.find(vote => vote.user === ctx.authUser.id)?.score ?? null,
          }
        }),
      }
    }),
  }
}

export function createMockIssuesBackend () {
  cursorPaginated('/api/issues/', ({ params }) => db.issues.filter(issue => {
    // TODO: implement other filters?
    if (params.status && params.status !== issue.status) return false
    return true
  }).map(toResponse))

  post('/api/issues/', ({ data }) => {
    return [200, toResponse(createIssue({
      ...data,
      createdAt: new Date(),
      status: 'ongoing',
    }))]
  })

  post('/api/issues/:id/vote/', ({ pathParams, data: newVotes }) => {
    const issue = db.orm.issues.get({ id: parseInt(pathParams.id) }, null)
    if (!issue) return [404] // TODO: not sure if this is what it does do
    const voting = issue.votings.find(voting => voting.expiresAt > new Date() && !voting.acceptedOption)
    if (!voting) throw new Error('no voting to vote on...')
    for (const newVote of newVotes) {
      const option = voting.options.find(option => option.id === newVote.option)
      if (!option) throw new Error('missing option')
      const vote = option.$votes.find(vote => vote.user === ctx.authUser.id)
      if (vote) {
        vote.score = newVote.score
      }
      else {
        option.$votes.push({ score: newVote.score, option: option.id })
      }
    }
    return [200, newVotes] // we return the request data for some reason...
  })

  // TODO: filter for access
  getById('/api/issues/:id/', () => db.issues.map(toResponse))

  // TODO: filter for access
  get('/api/issues/:id/conversation/', ({ pathParams }) => {
    const conversation = db.orm.conversations.get({ type: 'issue', targetId: parseInt(pathParams.id) }, null)
    if (!conversation) return [404]
    return [200, toConversationResponse(conversation)]
  })
}
