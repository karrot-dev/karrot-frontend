<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import ApplicationFormUI from '@/components/Group/ApplicationFormUI'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
  },
  actionsToEvents: {
    save: 'groups/save',
  },
  methodsToEvents: {
    cancel: (store, { groupId }) => {
      router.push({ name: 'groupPreview', params: { groupId } })
      console.log('Push the button!')
    },
  },
})('ApplicationForm', ApplicationFormUI)
</script>
