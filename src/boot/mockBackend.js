/*

This is for using mockBackend in the frontend as you browse around

*/

import { times } from 'lodash'

import { createGroup, createIssue, createUser, loginAs, setPageSize, setupMockBackend } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'

setupMockBackend()

const authUser = createUser()

const group = createGroup()
addUserToGroup(authUser, group)

const users = times(10, () => {
  const user = createUser()
  addUserToGroup(user, group)
  return user
})

setPageSize(3)

// our trouble making auth user creates an issue for everyone in the group
users.map(user => createIssue({
  group: group.id,
  createdBy: authUser.id,
  affectedUser: user.id,
  status: 'ongoing',
}))

loginAs(authUser)
