<script>
import { connect } from 'vuex-connect'
import KTopbarUI from './KTopbarUI'

export default connect({
  gettersToProps: {
    currentGroup: 'currentGroup/value',
    myGroups: 'groups/mine',
    breadcrumbs: 'breadcrumbs/all',
    user: 'auth/user',
    searchOpen: 'search/open',
    away: 'presence/toggle/away',
    connected: 'connectivity/connected',
    reconnecting: 'connectivity/reconnecting',
  },
  actionsToEvents: {
    logout: 'auth/logout',
    reconnect: 'connectivity/reconnect',
  },
  mutationsToEvents: {
    'show-search': 'search/show',
    'hide-search': 'search/hide',
  },
  methodsToEvents: {
    toggleSidenav ({ commit }) {
      this.$emit('toggle-sidenav')
    },
  },
})('KTopbar', KTopbarUI)
</script>
