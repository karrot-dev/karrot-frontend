import { render } from '@testing-library/vue'
import { times } from 'lodash'
import { vi } from 'vitest'

import { resetServices } from '@/utils/datastore/helpers'

import '>/routerMocks'
import { sleep, withDefaults } from '>/helpers'
import { createGroup, createIssue, createUser, db, loginAs, setPageSize } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import { useMockBackend } from '>/mockBackend/setup'

import IssueList from './IssueList.vue'

import { flushPromises } from '@vue/test-utils'

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

    const users = times(10, () => createUser())

    for (const user of users) {
      addUserToGroup(user, group)
    }

    // our trouble making auth user creates an issue for everyone in the group
    issues = users.map(user => createIssue({
      group: group.id,
      createdBy: authUser.id,
      affectedUser: user.id,
    }))

    setPageSize(3) // force pagination to get used

    loginAs(authUser)
  })

  it('lists issues with pagination', async () => {
    const { findByText } = render(IssueList, await withDefaults())
    for (const issue of issues) {
      const affectedUser = db.orm.users.get({ id: issue.affectedUser })
      await findByText(affectedUser.displayName)
    }
  })
})
