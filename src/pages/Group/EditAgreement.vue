<script>
import { connect } from 'vuex-connect'
import GroupEditAgreement from '@/components/Group/GroupEditAgreement'

export default connect({
  gettersToProps: {
    agreement: 'groups/activeGroupAgreement',
  },
  actionsToEvents: {
    save: 'groups/activeGroupAgreementSave',
  },
})('GroupEditAgreement', GroupEditAgreement)
</script>
