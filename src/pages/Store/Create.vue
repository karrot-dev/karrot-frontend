<script>
import { connect } from 'vuex-connect'
import CreateUI from '@/pages/Store/CreateUI'

export default connect({
  gettersToProps: {
    status: 'stores/status',
    allStores: 'stores/all',
  },
  actionsToEvents: {
    save: 'stores/create',
  },
})('StoreCreate', CreateUI)
</script>
