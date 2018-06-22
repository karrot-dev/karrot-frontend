import router from '@/router'

export default store => {
  let isLoggedIn = () => store.getters['auth/isLoggedIn']
  let getUserGroupId = () => isLoggedIn() && store.getters['auth/user'].currentGroup
  let getGroup = (id) => store.getters['groups/get'](id)
  let getBreadcrumbNames = () => store.getters['breadcrumbs/allNames']

  router.beforeEach(async (to, from, nextFn) => {
    store.dispatch('routeError/clear')
    let next = {}

    // handle invite parameter
    const inviteToken = to.query.invite
    if (inviteToken) {
      if (isLoggedIn()) {
        store.dispatch('invitations/accept', inviteToken)
        next = { path: '/' }
      }
      else {
        store.dispatch('auth/setAcceptInviteAfterLogin', inviteToken)
        next = { name: 'signup' }
      }
    }

    // redirect homescreen correctly
    else if (to.path === '/') {
      const groupId = getUserGroupId()
      if (groupId && getGroup(groupId) && getGroup(groupId).isMember) {
        next = { name: 'group', params: { groupId: getUserGroupId() } }
      }
      else {
        next = { name: 'groupsGallery' }
      }
    }

    // check meta.requireLoggedIn
    else if (to.matched.some(m => m.meta.requireLoggedIn) && !isLoggedIn()) {
      let { name, params, query } = to
      store.dispatch('auth/setRedirectTo', { name, params, query })
      next = { name: 'login' }
    }

    // check meta.requireLoggedOut
    else if (to.matched.some(m => m.meta.requireLoggedOut) && isLoggedIn()) {
      next = { path: '/' }
    }

    const { redirect } = await maybeDispatchActions(store, to, from)
    if (redirect) {
      next = redirect
    }
    else {
      store.dispatch('breadcrumbs/setAll', findBreadcrumbs(to.matched) || [])
    }

    nextFn({ replace: true, ...next })
  })

  router.afterEach((to) => {
    store.dispatch('currentGroup/markUserActive').catch(() => {})
  })

  store.watch(getBreadcrumbNames, () => {
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
  for (let m of from.matched.slice().reverse()) {
    if (m.meta.afterLeave) {
      await store.dispatch(m.meta.afterLeave)
    }
  }
  for (let m of to.matched) {
    if (m.meta.beforeEnter) {
      try {
        await store.dispatch(m.meta.beforeEnter, {
          ...parseAsIntegers(to.params),
          routeFrom: from,
          routeTo: to,
        })
      }
      catch (error) {
        if (error.type === 'RouteRedirect') {
          return { redirect: error.data }
        }
        else if (error.type === 'RouteError') {
          await store.dispatch('routeError/set', error.data)
          // no further loading should be done
          return {}
        }
        else {
          // can't be handled here
          throw error
        }
      }
    }
  }
  return {}
}

export function parseAsIntegers (obj) {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[k] = parseInt(v, 10)
    return acc
  }, {})
}
