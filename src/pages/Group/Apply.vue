<script>
import { connect } from 'vuex-connect'
import ApplicationForm from '@/components/Group/ApplicationForm'

export default connect({
  gettersToProps: {
    value: 'currentGroup/value',
    status: 'groups/saveStatus',
  },
  actionsToEvents: {
    save: 'groups/save',
  },
  methodsToEvents: {
    cancel: (store, { groupId }) => {
      router.push({ name: 'groupPreview', params: { groupId } })
    },
  }
})('GroupEdit', GroupEdit)
</script>
