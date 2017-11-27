<script>
import { connect } from 'vuex-connect'
import GroupEdit from '@/components/Group/GroupEdit'

export default connect({
  gettersToProps: {
    value: 'currentGroup/value',
    timezones: 'timezones/autocompleteData',
    allGroups: 'groups/all',
    status: 'groups/saveStatus',
  },
  actionsToEvents: {
    save: 'groups/save',
  },
  methodsToEvents: {
    reset: ({ dispatch }, id) => dispatch('groups/meta/clear', ['save', id]),
  },
})('GroupEdit', GroupEdit)
</script>
