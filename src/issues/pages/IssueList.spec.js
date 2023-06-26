import { render } from '@testing-library/vue'
import { times } from 'lodash'
import { vi } from 'vitest'

import { resetServices } from '@/utils/datastore/helpers'

import '>/routerMocks'
import { withDefaults } from '>/helpers'
import { createGroup, createIssue, createUser, db, loginAs, setPageSize, useMockBackend } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'

import IssueList from './IssueList.vue'

describe('IssueList', () => {
  let issues
  useMockBackend()

  beforeEach(() => {
    vi.resetModules()
    resetServices()
  })
  beforeEach(() => {
    const group = createGroup()

    const authUser = createUser()
    addUserToGroup(authUser, group)
    authUser.currentGroup = group.id

    const users = times(10, () => {
      const user = createUser()
      addUserToGroup(user, group)
      return user
    })

    // our trouble making auth user creates an issue for everyone in the group
    issues = users.map(user => createIssue({
      group: group.id,
      createdBy: authUser.id,
      affectedUser: user.id,
    }))

    setPageSize(3) // force pagination to get used

    loginAs(authUser)
  })

  it('lists activities', async () => {
    const { findByText } = render(IssueList, await withDefaults())
    for (const issue of issues) {
      const affectedUser = db.orm.users.get({ id: issue.affectedUser })
      await findByText(affectedUser.displayName)
    }
  })
})
