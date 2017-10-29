<script>
import { connect } from 'vuex-connect'
import MobileNavigationUI from './MobileNavigationUI'

export default connect({
  gettersToProps: {
    activeGroupId: 'groups/activeGroupId',
  },
})('MobileNavigation', MobileNavigationUI)
</script>
