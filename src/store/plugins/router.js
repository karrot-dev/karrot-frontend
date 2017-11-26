import router from '@/router'

export default store => {
  let isLoggedIn = () => store.getters['auth/isLoggedIn']
  let hasActiveGroup = () => !!store.getters['currentGroup/get']
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
    await maybeDispatchActions(store, to, from)

    store.dispatch('breadcrumbs/setAll', findBreadcrumbs(to.matched) || [])

    /* If:
        - the group is not mentioned in the URL
        - we do not have an current group
        - the user has a currentGroup
      Then:
        - set the users current group to be the active one
     */
    if (!to.params.groupId && !hasActiveGroup() && isLoggedIn()) {
      let groupId = getUserGroupId()
      if (groupId) store.dispatch('groups/select', { groupId })
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

export async function maybeDispatchActions (store, to, from) {
  for (let m of from.matched.reverse()) {
    if (m.meta.afterLeave) {
      await store.dispatch(m.meta.afterLeave)
    }
  }
  for (let m of to.matched) {
    if (m.meta.beforeEnter) {
      try {
        await store.dispatch(m.meta.beforeEnter, parseAsIntegers(to.params))
      }
      catch (error) {
        if (error.type === 'RouteError') {
          await store.dispatch('routeError/set', error.data)
          // no further loading should be done
          return
        }
        else {
          // can't be handled here
          throw error
        }
      }
    }
  }
}

export function parseAsIntegers (obj) {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[k] = parseInt(v, 10)
    return acc
  }, {})
}
