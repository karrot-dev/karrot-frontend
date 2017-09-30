<script>
import { connect } from 'vuex-connect'
import MobileNavigationUI from './MobileNavigationUI.vue'

export default connect({
  gettersToProps: {
    activeGroupId: 'groups/activeGroupId',
  },
})('MobileNavigationUI', MobileNavigationUI)
</script>
