<script>
import { connect } from 'vuex-connect'
import StoreOptionsUI from './StoreOptionsUI.vue'

export default connect({
  gettersToProps: {
    storeId: 'stores/activeStoreId',
  },
  actionsToEvents: {
    // leave: 'groups/leave',
  },
})('StoreOptions', StoreOptionsUI)
</script>
