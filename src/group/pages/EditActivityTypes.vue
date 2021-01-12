<script>
import { connect } from 'vuex-connect'
import EditActivityTypesUI from '@/group/components/EditActivityTypesUI'

export default connect({
  gettersToProps: {
    activityTypes: 'activityTypes/byCurrentGroup',
    activityTypeCreateStatus: 'activityTypes/createStatus',
  },
  actionsToEvents: {
    create: 'activityTypes/create',
    save: 'activityTypes/save',
  },
})('EditActivityTypes', EditActivityTypesUI)
</script>
