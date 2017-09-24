<script>
import { connect } from 'vuex-connect'
import MobileNavigationUI from './MobileNavigationUI.vue'

export default connect({
  gettersToProps: {
    currentGroup: 'groups/activeGroup',
  },
})('MobileNavigationUI', MobileNavigationUI)
</script>
