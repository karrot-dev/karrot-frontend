<script>
import { connect } from 'vuex-connect'
import SetupUI from '@/conflictResolution/components/SetupUI'
import router from '@/base/router'

export default connect({
  gettersToProps: {
    user: 'users/activeUser',
    group: 'groups/activePreview',
  },
  actionsToEvents: {
    startConflictResolution: 'conflictResolution/startConflictResolution',
  },
  methodsToEvents: {
    cancel: (_, userId) => {
      router.push({ name: 'user', params: { userId } })
    },
  },
})('Setup', SetupUI)
</script>
