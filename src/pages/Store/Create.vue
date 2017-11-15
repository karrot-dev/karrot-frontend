<script>
import { connect } from 'vuex-connect'
import StoreEdit from '@/components/Store/StoreEdit'

export default connect({
  gettersToProps: {
    status: 'stores/status',
    allStores: 'stores/byActiveGroup',
    requestError: 'stores/error',
  },
  methodsToProps: {
    value: () => ({
      name: undefined,
      description: undefined,
      weeksInAdvance: 4,
      latitude: undefined,
      longitude: undefined,
      address: undefined,
      status: 'created',
    }),
  },
  actionsToEvents: {
    save: 'stores/create',
  },
})('StoreCreate', StoreEdit)
</script>
