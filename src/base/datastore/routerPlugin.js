import router from '@/base/router'
import * as Sentry from '@sentry/browser'

export default datastore => {
  const isLoggedIn = () => datastore.getters['auth/isLoggedIn']
  const getUserGroupId = () => isLoggedIn() && datastore.getters['auth/user'].currentGroup

  router.beforeEach(async (to, from, nextFn) => {
    datastore.commit('routeMeta/setNext', to)
    datastore.dispatch('routeError/clear')
    let next

    // handle invite parameter
    const inviteToken = to.query.invite
    if (inviteToken) {
      if (isLoggedIn()) {
        datastore.dispatch('invitations/accept', inviteToken)
        next = { path: '/' }
      }
      else {
        datastore.dispatch('auth/setAcceptInviteAfterLogin', inviteToken)
        next = { name: 'signup' }
      }
    }

    // redirect homescreen correctly
    else if (to.path === '/') {
      const groupId = getUserGroupId()

      if (groupId) {
        next = { name: 'group', params: { groupId } }
      }
      else {
        next = { name: 'groupsGallery' }
      }
    }

    // check meta.requireLoggedIn
    else if (to.matched.some(m => m.meta.requireLoggedIn) && !isLoggedIn()) {
      const { name, params, query } = to
      datastore.dispatch('auth/setRedirectTo', { name, params, query })
      next = { name: 'login' }
    }

    // check meta.requireLoggedOut
    else if (to.matched.some(m => m.meta.requireLoggedOut) && isLoggedIn()) {
      next = { path: '/' }
    }

    if (next) {
      nextFn(next)
      return
    }

    const { redirect } = await maybeDispatchActions(datastore, to, from)
    if (redirect) {
      nextFn({ replace: true, ...redirect })
      return
    }

    nextFn()
    datastore.commit('breadcrumbs/set', findBreadcrumbs(to.matched) || [])
  })

  router.afterEach(async () => {
    try {
      datastore.dispatch('currentGroup/markUserActive')
    }
    catch (err) {
      Sentry.captureException(err)
    }
    datastore.commit('routeMeta/setNext', null)
  })

  datastore.watch((state, getters) => [
    getters['breadcrumbs/allNames'],
    getters['latestMessages/unreadCount'],
  ], ([breadcrumbNames, unreadCount]) => {
    let names = breadcrumbNames.slice().reverse()
    names.push('Karrot')
    let title = names.join(' · ')

    if (unreadCount > 0) {
      title = `(${unreadCount}) ${title}`
    }

    document.title = title
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

export async function maybeDispatchActions (datastore, to, from) {
  for (let m of from.matched.slice().reverse()) {
    if (m.meta.afterLeave) {
      await datastore.dispatch(m.meta.afterLeave, {
        ...parseAsIntegers(from.params),
        routeFrom: from,
        routeTo: to,
      })
    }
  }
  for (let m of to.matched) {
    if (m.meta.beforeEnter) {
      try {
        await datastore.dispatch(m.meta.beforeEnter, {
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
          await datastore.dispatch('routeError/set', error.data)
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
