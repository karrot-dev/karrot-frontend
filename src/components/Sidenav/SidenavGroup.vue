<script>
import { connect } from 'vuex-connect'
import SidenavGroupUI from './SidenavGroupUI'

export default connect({
  gettersToProps: {
    collapsed: 'sidenavBoxes/groupCollapsed',
  },
  mutationsToEvents: {
    toggleBoxCollapsed: 'sidenavBoxes/toggleGroupCollapsed',
  },
})('SidenavGroup', SidenavGroupUI)
</script>
