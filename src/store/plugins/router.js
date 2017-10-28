import router from '@/router'

export default store => {
  let isLoggedIn = () => store.getters['auth/isLoggedIn']
  let hasActiveGroup = () => !!store.getters['groups/activeGroup']
  let getUserGroupId = () => isLoggedIn() && store.getters['auth/user'].currentGroup
  let getBreadcrumbNames = () => store.getters['breadcrumbs/allNames']

  router.beforeEach((to, from, next) => {
    // start loading bar for each route transition, in addition to API requests
    store.dispatch('loadingprogress/start')

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
      let { name, params } = to
      store.dispatch('auth/setRedirectTo', { name, params })
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

  router.afterEach((to, from) => {
    window.scrollTo(0, 0)

    store.dispatch('loadingprogress/stop')

    store.dispatch('breadcrumbs/setAll', findBreadcrumbs(to.matched) || [])

    // save active group/store/user
    if (to.params.groupId) {
      store.dispatch('groups/selectGroup', parseInt(to.params.groupId, 10))
    }
    if (to.params.groupInfoId) {
      store.dispatch('groups/selectGroupInfo', parseInt(to.params.groupInfoId, 10))
    }
    if (to.params.storeId) {
      store.dispatch('stores/selectStore', parseInt(to.params.storeId, 10))
    }
    else {
      store.dispatch('stores/clearSelectedStore')
    }
    if (to.params.userId) {
      store.dispatch('users/selectUser', parseInt(to.params.userId, 10))
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
  })

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
