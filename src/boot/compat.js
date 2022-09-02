// eslint-disable-next-line
// import { times } from 'lodash'
import { configureCompat } from 'vue'

/*
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

 */

// for compatibility with vue-croppa
// can be deleted once vue-croppa supports vue 3 or we don't use it anymore
// see https://github.com/zhanziyang/vue-croppa/issues/235
// also check quasar.conf.js

configureCompat({
  MODE: 3,
})

export default ({ app }) => {
  // TODO: should be able to remove this with vue v3.3.x
  app.config.unwrapInjectedRef = true
}
