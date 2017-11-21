import router from '@/router'

export default store => {
  let isLoggedIn = () => store.getters['auth/isLoggedIn']
  let hasActiveGroup = () => !!store.getters['groups/activeGroup']
  let getUserGroupId = () => isLoggedIn() && store.getters['auth/user'].currentGroup
  let getBreadcrumbNames = () => store.getters['breadcrumbs/allNames']

  router.beforeEach((to, from, next) => {
    store.dispatch('routeError/clear')

    // handle invite parameter
    const inviteToken = to.query.invite
    if (inviteToken) {
      if (isLoggedIn()) {
        store.dispatch('invitations/accept', inviteToken)
        next('/')
      }
      else {
        store.dispatch('auth/setAcceptInviteAfterLogin', inviteToken)
        next({ name: 'signup' })
      }
    }

    // redirect homescreen correctly
    else if (to.path === '/') {
      if (getUserGroupId()) {
        next({ name: 'group', params: { groupId: getUserGroupId() } })
      }
      else {
        next({ name: 'groupsGallery' })
      }
    }

    // check meta.requireLoggedIn
    else if (to.matched.some(m => m.meta.requireLoggedIn) && !isLoggedIn()) {
      let { name, params, query } = to
      store.dispatch('auth/setRedirectTo', { name, params, query })
      next({ name: 'login' })
    }

    // check meta.requireLoggedOut
    else if (to.matched.some(m => m.meta.requireLoggedOut) && isLoggedIn()) {
      next('/')
    }

    else {
      next()
    }
  })

  router.beforeEach(async (to, from, next) => {
    for (let m of from.matched) {
      if (m.meta.afterLeave) {
        console.log('afterLeave', m.meta.afterLeave)
        await store.dispatch(m.meta.afterLeave)
      }
    }
    for (let m of to.matched) {
      if (m.meta.beforeEnter) {
        try {
          console.log('beforeEnter', to.params)
          await store.dispatch(m.meta.beforeEnter, parseAsIntegers(to.params))
        }
        catch (error) {
          if (error.type === 'RouteError') {
            await store.dispatch('routeError/set', error.data)
            // no further loading needed
            return
          }
          else {
            // can't be handled here
            throw error
          }
        }
      }
    }
    store.dispatch('breadcrumbs/setAll', findBreadcrumbs(to.matched) || [])

    if (to.params.historyId) {
      store.dispatch('history/setActive', parseInt(to.params.historyId, 10))
    }

    /* If:
        - the group is not mentioned in the URL
        - we do not have an active group
        - the user has a currentGroup
      Then:
        - set the users current group to be the active one
     */
    if (!to.params.groupId && !hasActiveGroup() && isLoggedIn()) {
      let groupId = getUserGroupId()
      if (groupId) store.dispatch('groups/selectGroup', groupId)
    }

    next()
  })

  router.afterEach(() => window.scrollTo(0, 0))

  store.watch(getBreadcrumbNames, breadcrumbs => {
    let names = getBreadcrumbNames().slice().reverse()
    names.push('Karrot')
    document.title = names.join(' · ')
  })
}

export function findBreadcrumbs (matched) {
  // Combine all the breadcrumbs from the root
  return matched.reduce((acc, m) => {
    if (m.meta && m.meta.breadcrumbs) {
      acc.push(...m.meta.breadcrumbs)
    }
    return acc
  }, [])
}

export function parseAsIntegers (obj) {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[k] = parseInt(v, 10)
  }, {})
}
