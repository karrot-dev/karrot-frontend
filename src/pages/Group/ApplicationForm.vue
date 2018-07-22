<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import ApplicationFormUI from '@/components/Group/ApplicationFormUI'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
  },
  actionsToEvents: {
    submit: 'groups/apply',
  },
  methodsToEvents: {
    cancel: (store, { groupId }) => {
      router.push({ name: 'groupPreview', params: { groupId } })
    },
  },
})('ApplicationForm', ApplicationFormUI)
</script>
