<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<script>
import { connect } from 'vuex-connect'
import GroupOptionsUI from './GroupOptionsUI'

export default connect({
  gettersToProps: {
    currentGroupId: 'currentGroup/id',
    roles: 'currentGroup/roles',
  },
  actionsToEvents: {
    leave: 'groups/leave',
  },
})('GroupOptions', GroupOptionsUI)
</script>
