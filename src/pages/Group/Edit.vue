<script>
import { connect } from 'vuex-connect'
import GroupEdit from '@/components/Group/GroupEdit'

export default connect({
  gettersToProps: {
    group: 'groups/activeGroup',
    status: 'groups/status',
    timezones: 'groups/timezones',
    allGroups: 'groups/all',
  },
  actionsToEvents: {
    save: 'groups/save',
  },
  lifecycle: {
    mounted: ({ dispatch }) => dispatch('groups/fetchTimezones'),
  },
})('GroupEdit', GroupEdit)
</script>
