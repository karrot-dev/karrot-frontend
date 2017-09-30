<script>
import { connect } from 'vuex-connect'
import GroupOptionsUI from './GroupOptionsUI.vue'

export default connect({
  gettersToProps: {
    activeGroupId: 'groups/activeGroupId',
  },
})('GroupOptionsUI', GroupOptionsUI)
</script>
