<script>
import { connect } from 'vuex-connect'
import KTopbarUI from './KTopbarUI'

export default connect({
  gettersToProps: {
    currentGroup: 'currentGroup/value',
    breadcrumbs: 'breadcrumbs/all',
    user: 'auth/user',
    searchOpen: 'search/open',
    away: 'presence/toggle/away',
    connected: 'connectivity/connected',
  },
  actionsToEvents: {
    logout: 'auth/logout',
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
