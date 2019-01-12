<script>
import { connect } from 'vuex-connect'
import SetupUI from '@/conflictResolution/components/SetupUI'
import router from '@/base/router'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
  },
  actionsToEvents: {
    startConflictResolution: 'conflictResolution/startConflictResolution',
  },
  methodsToEvents: {
    cancel: (_, groupId) => {
      router.push({ name: 'group', params: { groupId } })
    },
  },
})('Setup', SetupUI)
</script>
