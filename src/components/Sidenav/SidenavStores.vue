<script>
import { connect } from 'vuex-connect'
import SidenavStoresUI from './SidenavStoresUI'

export default connect({
  gettersToProps: {
    stores: 'stores/byActiveGroup',
    statusObj: 'stores/statusObj',
  },
})('SidenavStores', SidenavStoresUI)
</script>
