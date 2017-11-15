<script>
import { connect } from 'vuex-connect'
import StoreEdit from '@/components/Store/StoreEdit'

export default connect({
  gettersToProps: {
    value: 'stores/activeStore',
    status: 'stores/status',
    allStores: 'stores/byActiveGroup',
    requestError: 'stores/error',
  },
  actionsToEvents: {
    save: 'stores/save',
  },
})('StoreEdit', StoreEdit)
</script>
