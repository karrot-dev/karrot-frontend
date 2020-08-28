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
    showSearch: 'search/show',
    hideSearch: 'search/hide',
  },
  methodsToEvents: {
    toggleSidenav ({ commit }) {
      this.$emit('toggleSidenav')
    },
  },
})('KTopbar', KTopbarUI)
</script>
