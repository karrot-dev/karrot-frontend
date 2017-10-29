<script>
import { connect } from 'vuex-connect'
import SidenavStoreUI from './SidenavStoreUI'

export default connect({
  gettersToProps: {
    storeId: 'stores/activeStoreId',
  },
})('SidenavStore', SidenavStoreUI)
</script>
