<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

<script>
import { connect } from 'vuex-connect'
import SidenavGroupUI from './SidenavGroupUI'

export default connect({
  gettersToProps: {
    groupId: 'currentGroup/id',
    theme: 'currentGroup/theme',
    features: 'currentGroup/features',
    wallUnreadCount: 'status/currentGroupWallUnreadCount',
    feedbackPossibleCount: 'status/currentGroupFeedbackPossibleCount',
    pendingApplicationCount: 'status/currentGroupPendingApplicationCount',
  },
})('SidenavGroup', SidenavGroupUI)
</script>
