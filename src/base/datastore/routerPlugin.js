import router from '@/router'

export default datastore => {
  router.beforeEach(to => {
    datastore.commit('routeMeta/setNext', to)
  })

  router.afterEach(async (to, from) => {
    const { redirects, routeErrors } = await maybeDispatchActions(datastore, to, from)
    // trigger first redirect or routeError, if any
    if (redirects.length > 0) {
      router.replace(redirects[0]).catch(() => {})
    }
    else if (routeErrors.length > 0) {
      datastore.dispatch('routeError/set', routeErrors[0])
    }

    datastore.commit('routeMeta/setNext', null)
  })
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

  const firstNewMatchIdx = to.matched.findIndex(isNewMatch)

  // abort early if route is identical
  if (firstNewMatchIdx === -1) {
    return {
      redirects: [],
      routeErrors: [],
    }
  }

  const flatten = list => [].concat(...list)

  const afterLeaveActions = from.matched.slice(firstNewMatchIdx).reverse().map(m => m.meta.afterLeave)

  for (const action of flatten(afterLeaveActions)) {
    if (action) {
      await datastore.dispatch(action, {
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

  const beforeEnter = to.matched.slice(firstNewMatchIdx).map(m => m.meta.beforeEnter)
  const results = await Promise.all(flatten(beforeEnter)
    .filter(v => Boolean(v))
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
