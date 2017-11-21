<script>
import { connect } from 'vuex-connect'
import GroupEdit from '@/components/Group/GroupEdit'

export default connect({
  gettersToProps: {
    timezones: 'groups/timezones',
    allGroups: 'groups/all',
    status: 'groups/activeGroupSaveStatus',
    group: 'groups/activeGroup',
  },
  actionsToEvents: {
    save: 'groups/save',
  },
  methodsToEvents: {
    reset: ({ dispatch }, id) => dispatch('groups/meta/clear', ['save', id]),
  },
})('GroupEdit', GroupEdit)
</script>
