<script>
import { connect } from 'vuex-connect'
import GroupEdit from '@/group/components/GroupEdit'

export default connect({
  gettersToProps: {
    timezones: 'timezones/autocompleteData',
    allGroups: 'groups/all',
    status: 'groups/createStatus',
  },
  actionsToEvents: {
    save: 'groups/create',
  },
  methodsToEvents: {
    reset: ({ dispatch }) => dispatch('groups/meta/clear', ['create']),
  },
})('GroupCreate', GroupEdit)
</script>
