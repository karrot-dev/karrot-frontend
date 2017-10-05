<script>
import { connect } from 'vuex-connect'
import SidenavStoreUI from './SidenavStoreUI.vue'

export default connect({
  gettersToProps: {
    storeId: 'stores/activeStoreId',
  },
})('SidenavStore', SidenavStoreUI)
</script>
