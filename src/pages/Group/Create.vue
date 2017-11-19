<script>
import jstz from 'jstimezonedetect'
import { connect } from 'vuex-connect'
import GroupEdit from '@/components/Group/GroupEdit'

export default connect({
  gettersToProps: {
    timezones: 'groups/timezones',
    allGroups: 'groups/all',
    status: 'groups/createStatus',
  },
  methodsToProps: {
    value: () => ({
      name: undefined,
      password: undefined,
      publicDescription: undefined,
      description: undefined,
      timezone: jstz.determine().name(),
      latitude: undefined,
      longitude: undefined,
      address: undefined,
    }),
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
