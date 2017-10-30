<script>
import { connect } from 'vuex-connect'
import GroupManageAgreement from '@/components/Group/GroupManageAgreement'

export default connect({
  gettersToProps: {
    agreement: 'groups/activeGroupAgreement',
  },
  actionsToEvents: {
    save: 'groups/activeGroupAgreementSave',
    replace: 'groups/activeGroupAgreementReplace',
    remove: 'groups/activeGroupAgreementRemove',
  },
})('GroupManageAgreement', GroupManageAgreement)
</script>
