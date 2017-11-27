<script>
import { connect } from 'vuex-connect'
import StoreEdit from '@/components/Store/StoreEdit'

export default connect({
  gettersToProps: {
    allStores: 'stores/byCurrentGroup',
    status: 'stores/createStatus',
  },
  actionsToEvents: {
    save: 'stores/create',
  },
})('StoreCreate', StoreEdit)
</script>
