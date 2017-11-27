<script>
import { connect } from 'vuex-connect'
import GroupManageAgreement from '@/components/Group/GroupManageAgreement'

export default connect({
  gettersToProps: {
    agreement: 'currentGroup/agreement',
  },
  actionsToEvents: {
    save: 'currentGroup/agreementSave',
    replace: 'currentGroup/agreementReplace',
    remove: 'currentGroup/agreementRemove',
  },
})('GroupManageAgreement', GroupManageAgreement)
</script>
