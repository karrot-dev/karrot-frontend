<script>
import { connect } from 'vuex-connect'
import StoreOptionsUI from './StoreOptionsUI'

export default connect({
  gettersToProps: {
    storeId: 'stores/activeStoreId',
  },
})('StoreOptions', StoreOptionsUI)
</script>
