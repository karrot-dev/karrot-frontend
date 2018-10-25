<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import StoreEdit from '@/stores/components/StoreEdit'

export default connect({
  gettersToProps: {
    allStores: 'stores/byCurrentGroup',
    status: 'stores/createStatus',
  },
  actionsToEvents: {
    save: 'stores/create',
  },
  methodsToEvents: {
    cancel: () => router.go(-1),
  },
})('StoreCreate', StoreEdit)
</script>
