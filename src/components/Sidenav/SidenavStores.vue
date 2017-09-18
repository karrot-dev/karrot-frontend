<script>
import { connect } from 'vuex-connect'
import SidenavStoresUI from './SidenavStoresUI.vue'

export default connect({
  gettersToProps: {
    stores: 'stores/list',
  },
})('SidenavStoresUI', SidenavStoresUI)
</script>
