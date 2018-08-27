<script>
import { connect } from 'vuex-connect'
import KTopbarUI from './KTopbarUI'

export default connect({
  gettersToProps: {
    breadcrumbs: 'breadcrumbs/all',
    user: 'auth/user',
    searchOpen: 'search/open',
    away: 'presence/toggle/away',
    unreadCount: 'latestMessages/unreadCount',
    allUnreadMuted: 'latestMessages/allUnreadMuted',
  },
  actionsToEvents: {
    logout: 'auth/logout',
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
