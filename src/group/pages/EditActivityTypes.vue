<script>
import { connect } from 'vuex-connect'
import EditActivityTypesUI from '@/group/components/EditActivityTypesUI'

export default connect({
  gettersToProps: {
    activityTypes: 'activityTypes/all',
    status: 'activityTypes/saveStatus',
  },
  actionsToEvents: {
    save: 'activityTypes/save',
  },
  // methodsToEvents: {
  //   reset: ({ dispatch }, id) => dispatch('groups/meta/clear', ['save', id]),
  // },
})('EditActivityTypes', EditActivityTypesUI)
</script>
