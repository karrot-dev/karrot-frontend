/**
 * Testing our test harness!
 */

import authUserAPI from '@/authuser/api/authUser'
import groupsInfoAPI from '@/groupInfo/api/groupsInfo'
import userAPI from '@/users/api/users'

import { loginAs, createUser, db, useMockBackend, createGroup } from './mockBackend'
import { addMemberToGroup } from './mockBackend/groups'

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
    addMemberToGroup(user, group)
    const groupRes = (await groupsInfoAPI.list())[0]
    expect(groupRes.memberCount).toEqual(1)
    expect(groupRes.isMember).toEqual(false)

    // make sure it shows as member if we're logged in
    loginAs(user)
    const groupRes2 = (await groupsInfoAPI.list())[0]
    expect(groupRes2.isMember).toEqual(true)
  })
})
