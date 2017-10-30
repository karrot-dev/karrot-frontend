<script>
import { connect } from 'vuex-connect'
import StoreEdit from '@/components/Store/StoreEdit'

export default connect({
  gettersToProps: {
    status: 'stores/status',
    allStores: 'stores/byActiveGroup',
    requestError: 'stores/error',
    statusList: 'stores/statusList',
  },
  actionsToEvents: {
    save: 'stores/create',
  },
})('StoreCreate', StoreEdit)
</script>
