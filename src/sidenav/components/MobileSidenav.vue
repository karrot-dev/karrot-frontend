<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<script>
import { connect } from 'vuex-connect'
import MobileSidenavUI from './MobileSidenavUI'

export default connect({
  actionsToEvents: {
    logout: 'auth/logout',
  },
  gettersToProps: {
    currentUserId: 'auth/userId',
  },
  methodsToEvents: {
    toggleSidenav ({ commit }) {
      this.$emit('toggle-sidenav')
    },
  },
})('MobileSidenav', MobileSidenavUI)
</script>
