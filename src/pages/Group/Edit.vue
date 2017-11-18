<script>
import { connect } from 'vuex-connect'
import GroupEdit from '@/components/Group/GroupEdit'

export default connect({
  gettersToProps: {
    value: 'groups/activeGroup',
    timezones: 'groups/timezones',
    allGroups: 'groups/all',
    status: 'groups/activeGroupSaveStatus',
  },
  actionsToEvents: {
    save: 'groups/save',
  },
  methodsToEvents: {
    reset: ({ dispatch }, id) => dispatch('groups/meta/clear', ['save', id]),
  },
  lifecycle: {
    mounted: ({ dispatch }) => dispatch('groups/fetchTimezones'),
  },
})('GroupEdit', GroupEdit)
</script>
