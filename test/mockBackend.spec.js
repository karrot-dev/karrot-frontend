/**
 * Testing our test harness!
 */

import { faker } from '@faker-js/faker'

import authUserAPI from '@/authuser/api/authUser'
import groupsInfoAPI from '@/groupInfo/api/groupsInfo'
import offersAPI from '@/offers/api/offers'
import userAPI from '@/users/api/users'

import { toOfferResponse } from '>/mockBackend/offers'
import { useMockBackend } from '>/mockBackend/setup'

import { loginAs, createUser, db, createGroup, createOffer } from './mockBackend'
import { addUserToGroup } from './mockBackend/groups'

describe('mock backend', () => {
  useMockBackend()

  it('can register users', async () => {
    const user = createUser()
    expect(db.users).toContain(user)
    expect(db.users).toHaveLength(1)
    loginAs(user)
    const userResponse = await userAPI.list()
    expect(userResponse).toHaveLength(1)
    expect(userResponse).not.toEqual([user])
    const keys = ['id', 'username', 'displayName', 'latitude', 'longitude', 'photoUrls']
    expect(Object.keys(userResponse[0])).toEqual(keys)
    for (const key of keys) {
      expect(userResponse[0][key]).toEqual(user[key])
    }
  })

  it('can login', async () => {
    expect(db.users).toHaveLength(0) // make sure it got reset
    const user = createUser()
    loginAs(user)
    expect(await authUserAPI.get()).toEqual(user)
  })

  it('can retrieve group info', async () => {
    const user = createUser()
    const group = createGroup()
    addUserToGroup(user, group)
    const groupRes = (await groupsInfoAPI.list())[0]
    expect(groupRes.memberCount).toBe(1)
    expect(groupRes.isMember).toBe(false)

    // make sure it shows as member if we're logged in
    loginAs(user)
    const groupRes2 = (await groupsInfoAPI.list())[0]
    expect(groupRes2.isMember).toBe(true)
  })

  it('can create and retrieve an offer', async () => {
    const group = createGroup()
    const user = createUser()
    addUserToGroup(user, group)
    loginAs(user)
    const offerData = {
      name: faker.lorem.words(5),
      description: faker.lorem.paragraphs(2),
      group: group.id,
    }
    const createdOffer = await offersAPI.create(offerData)
    expect(db.offers).toHaveLength(1)
    expect(createdOffer).toEqual(toOfferResponse(db.offers[0]))
    for (const key of Object.keys(offerData)) {
      expect(createdOffer[key]).toEqual(offerData[key])
      expect(db.offers[0][key]).toEqual(offerData[key])
    }
    const fetchedOffer = await offersAPI.get(createdOffer.id)
    expect(fetchedOffer).toEqual(createdOffer)
    expect(fetchedOffer).toEqual(toOfferResponse(db.offers[0]))
  })

  it('does not show you offers for other groups', async () => {
    const groupA = createGroup()
    const groupB = createGroup()
    const user = createUser()
    addUserToGroup(user, groupA)
    const offerA = createOffer({ group: groupA.id })
    createOffer({ group: groupB.id })
    loginAs(user)
    expect((await offersAPI.list()).results).toEqual([toOfferResponse(offerA)])
  })
})
