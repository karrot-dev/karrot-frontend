<script>
import { connect } from 'vuex-connect'
import ConflictSetupUI from '@/issues/components/ConflictSetupUI'
import router from '@/base/router'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
  },
  actionsToEvents: {
    startConflictResolution: 'detail/openForConflict',
  },
  methodsToEvents: {
    cancel: (_, userId) => {
      router.push({ name: 'user', params: { userId } })
    },
    startConflictResolution: (params) => {
      router.push({ name: 'issueDetail', params })
    },
  },
})('ConflictSetup', ConflictSetupUI)
</script>
