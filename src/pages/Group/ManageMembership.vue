<script>
import { connect } from 'vuex-connect'
import GroupManageMembership from '@/components/Group/GroupManageMembership'

export default connect({
  gettersToProps: {
    users: 'users/byCurrentGroup',
  },
  actionsToEvents: {
    save: 'currentGroup/changeRole',
  },
})('GroupManageMembership', GroupManageMembership)
</script>
