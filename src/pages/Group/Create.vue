<script>
import { connect } from 'vuex-connect'
import GroupEdit from '@/components/Group/GroupEdit'

export default connect({
  gettersToProps: {
    status: 'groups/status',
    timezones: 'groups/timezones',
    allGroups: 'groups/all',
    requestError: 'groups/saveError',
  },
  actionsToEvents: {
    save: 'groups/create',
  },
  lifecycle: {
    mounted: ({ dispatch }) => dispatch('groups/fetchTimezones'),
  },
})('GroupCreate', GroupEdit)
</script>
