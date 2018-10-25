<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import ApplicationFormUI from '@/applications/components/ApplicationFormUI'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
    status: 'groupApplications/applyStatus',
  },
  actionsToEvents: {
    apply: 'groupApplications/apply',
  },
  methodsToEvents: {
    cancel: (store, groupId) => {
      router.push({ name: 'groupPreview', params: { groupId } })
    },
  },
})('ApplicationForm', ApplicationFormUI)
</script>
