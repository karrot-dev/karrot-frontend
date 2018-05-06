<script>
import { connect } from 'vuex-connect'
import SidenavGroupUI from './SidenavGroupUI'

export default connect({
  gettersToProps: {
    expanded: 'sidenavBoxes/toggle/group',
  },
  actionsToEvents: {
    toggleBox: 'sidenavBoxes/toggle/group',
  },
})('SidenavGroup', SidenavGroupUI)
</script>
