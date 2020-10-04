<script>
import { connect } from 'vuex-connect'
import GroupSettings from '@/group/components/GroupSettings'

export default connect({
  gettersToProps: {
    group: 'currentGroup/value',
    groups: 'groups/mineWithApplications',
    status: 'unsubscribe/allEmailsPerGroupStatus',
    getNotificationTypeStatus: 'currentGroup/getNotificationTypeStatus',
  },
  actionsToEvents: {
    'change-notification-type': 'currentGroup/changeNotificationType',
    'select-group': 'currentGroup/select',
    'unsubscribe-all-emails': 'unsubscribe/allEmailsPerGroup',
    'clear-unsubscribe-all-status': 'unsubscribe/clear',
  },
})('GroupSettings', GroupSettings)
</script>
