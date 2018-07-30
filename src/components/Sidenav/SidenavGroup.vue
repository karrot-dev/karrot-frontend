<script>
import { connect } from 'vuex-connect'
import SidenavGroupUI from './SidenavGroupUI'

export default connect({
  gettersToProps: {
    groupId: 'currentGroup/id',
    expanded: 'sidenavBoxes/toggle/group',
  },
  actionsToEvents: {
    toggleBox: 'sidenavBoxes/toggle/group',
  },
})('SidenavGroup', SidenavGroupUI)
</script>
