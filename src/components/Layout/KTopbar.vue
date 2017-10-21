<script>
import { connect } from 'vuex-connect'
import KTopbarUI from './KTopbarUI.vue'

export default connect({
  actionsToEvents: {
    logout: 'auth/logout',
    showSearch: 'search/show',
    hideSearch: 'search/hide',
  },
  gettersToProps: {
    breadcrumbs: 'breadcrumbs/all',
    currentUserId: 'auth/userId',
    searchOpen: 'search/open',
  },
  methodsToEvents: {
    toggleSidenav ({ commit }) {
      this.$emit('toggleSidenav')
    },
  },
})('KTopbar', KTopbarUI)
</script>
