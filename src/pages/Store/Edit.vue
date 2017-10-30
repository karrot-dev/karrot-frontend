<script>
import { connect } from 'vuex-connect'
import StoreEdit from '@/components/Store/StoreEdit'

export default connect({
  gettersToProps: {
    store: 'stores/activeStore',
    status: 'stores/status',
    allStores: 'stores/byActiveGroup',
    requestError: 'stores/error',
    statusList: 'stores/statusList',
  },
  actionsToEvents: {
    save: 'stores/save',
  },
})('StoreEdit', StoreEdit)
</script>
