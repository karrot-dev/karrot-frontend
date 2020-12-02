<script>
import { connect } from 'vuex-connect'
import EditActivityTypesUI from '@/group/components/EditActivityTypesUI'

export default connect({
  gettersToProps: {
    activityTypes: 'activityTypes/byCurrentGroup',
    // status: 'activityTypes/saveStatus',
    activityTypeCreateStatus: 'activityTypes/createStatus',
  },
  actionsToEvents: {
    create: 'activityTypes/create',
    save: 'activityTypes/save',
  },
  // methodsToEvents: {
  //   reset: ({ dispatch }, id) => dispatch('groups/meta/clear', ['save', id]),
  // },
})('EditActivityTypes', EditActivityTypesUI)
</script>
