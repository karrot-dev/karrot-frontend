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
    changeNotificationType: 'currentGroup/changeNotificationType',
    selectGroup: 'currentGroup/select',
    unsubscribeAllEmails: 'unsubscribe/allEmailsPerGroup',
    clearUnsubscribeAllStatus: 'unsubscribe/clear',
  },
})('GroupSettings', GroupSettings)
</script>
