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

    nextFn()
  })

  router.afterEach(async (to, from) => {
    const { redirects, routeErrors } = await maybeDispatchActions(datastore, to, from)
    // trigger first redirect or routeError, if any
    if (redirects.length > 0) {
      router.replace(redirects[0])
    }
    else if (routeErrors.length > 0) {
      datastore.dispatch('routeError/set', routeErrors[0])
    }

    datastore.commit('breadcrumbs/set', findBreadcrumbs(to.matched) || [])
    datastore.commit('routeMeta/setNext', null)

    try {
      datastore.dispatch('currentGroup/markUserActive')
    }
    catch (err) {
      Sentry.captureException(err)
    }
  })

  datastore.watch((state, getters) => [
    getters['breadcrumbs/allNames'],
    getters['latestMessages/unseenCount'],
  ], ([breadcrumbNames, unseenCount]) => {
    let names = breadcrumbNames.slice().reverse()
    names.push('Karrot')
    let title = names.join(' · ')

    if (unseenCount > 0) {
      title = `(${unseenCount}) ${title}`
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
  const changedParams = Object.keys(to.params).filter(k => {
    // route params are sometimes strings, sometimes integers - let's just gloss over that...
    // eslint-disable-next-line eqeqeq
    return to.params[k] != from.params[k]
  })

  // find all common matches, to skip their actions
  const isNewMatch = (f, i) =>
    f.path !== (from.matched[i] || {}).path || // identify same matches by path
    changedParams.some(p => f.path.includes(`/:${p}`)) // make a new match if params in this route have been updated

  const firstNewMatchIdx = Math.max(0, to.matched.findIndex(isNewMatch))

  for (let m of from.matched.slice(firstNewMatchIdx).reverse()) {
    if (m.meta.afterLeave) {
      await datastore.dispatch(m.meta.afterLeave, {
        ...parseAsIntegers(from.params),
        routeFrom: from,
        routeTo: to,
      })
    }
  }

  const runBeforeEnter = async (beforeEnter) => {
    try {
      await datastore.dispatch(beforeEnter, {
        ...parseAsIntegers(to.params),
        routeFrom: from,
        routeTo: to,
      })
      return {}
    }
    catch (error) {
      if (error.type === 'RouteRedirect') {
        return { redirect: error.data }
      }
      else if (error.type === 'RouteError') {
        return { routeError: error.data }
      }
      else {
        // can't be handled here
        return { error }
      }
    }
  }
  const results = await Promise.all(to.matched.slice(firstNewMatchIdx)
    .map(m => m.meta.beforeEnter)
    .filter(v => !!v)
    .map(runBeforeEnter))

  // show a warning for every error that occured
  results
    .filter(r => r.error)
    .forEach(r => console.warn('Error while loading the page:', r.error))

  return {
    redirects: results.map(r => r.redirect).filter(v => !!v),
    routeErrors: results.map(r => r.routeError).filter(v => !!v),
  }
}

export function parseAsIntegers (obj) {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[k] = parseInt(v, 10)
    return acc
  }, {})
}
