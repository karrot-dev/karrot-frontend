<script>
import { connect } from 'vuex-connect'
import router from '@/base/router'
import ApplicationFormUI from '@/applications/components/ApplicationFormUI'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
    status: 'applications/applyStatus',
  },
  actionsToEvents: {
    apply: 'applications/apply',
  },
  methodsToEvents: {
    cancel: (_, groupId) => {
      router.push({ name: 'groupPreview', params: { groupId } })
    },
  },
})('ApplicationForm', ApplicationFormUI)
</script>
