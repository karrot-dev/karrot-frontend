import createPersistedState from 'vuex-persistedstate'

export default createPersistedState({
  paths: [
    'i18n.locale',
    'auth.push.intention',
    'auth.push.token',
  ],
})
