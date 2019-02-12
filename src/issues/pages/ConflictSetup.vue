<script>
import { connect } from 'vuex-connect'
import ConflictSetupUI from '@/issues/components/ConflictSetupUI'
import router from '@/base/router'

export default connect({
  gettersToProps: {
    currentGroup: 'currentGroup/value',
  },
  methodsToEvents: {
    cancel: (_, userId) => {
      router.push({ name: 'user', params: { userId } })
    },
  },
  actionsToEvents: {
    startConflictResolution: 'issues/createIssue',
  },
})('ConflictSetup', ConflictSetupUI)
</script>
