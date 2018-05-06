<script>
import { connect } from 'vuex-connect'
import MobileNavigationUI from './MobileNavigationUI'

export default connect({
  gettersToProps: {
    currentGroupId: 'currentGroup/id',
  },
})('MobileNavigation', MobileNavigationUI)
</script>
