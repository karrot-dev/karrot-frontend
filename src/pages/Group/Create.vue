<script>
import { connect } from 'vuex-connect'
import GroupEdit from '@/components/Group/GroupEdit'

export default connect({
  gettersToProps: {
    timezones: 'groups/timezones',
    allGroups: 'groups/all',
    status: 'groups/createStatus',
  },
  actionsToEvents: {
    save: 'groups/create',
  },
  methodsToEvents: {
    reset: ({ dispatch }) => dispatch('meta/clear', ['create']),
  },
  lifecycle: {
    mounted: ({ dispatch }) => dispatch('groups/fetchTimezones'),
  },
})('GroupCreate', GroupEdit)
</script>
