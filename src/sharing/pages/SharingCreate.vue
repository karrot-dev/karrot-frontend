<script>
import { connect } from 'vuex-connect'
import SharingEdit from '@/sharing/pages/SharingEdit'

export default connect({
  /*
  gettersToProps: {
    timezones: 'timezones/autocompleteData',
    allGroups: 'groups/all',
    status: 'groups/createStatus',
  },
  actionsToEvents: {
    save: 'groups/create',
  },
  methodsToEvents: {
    reset: ({ dispatch }) => dispatch('meta/clear', ['create']),
  },
   */
})('SharingCreate', SharingEdit)
</script>
