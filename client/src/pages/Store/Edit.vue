<script>
import { connect } from 'vuex-connect'
import store from '@/store'
import StoreEdit from '@/components/Store/StoreEdit'

export default connect({
  stateToProps: {
    status: () => store.getters['stores/activeStore'].saveStatus,
  },
  gettersToProps: {
    value: 'stores/activeStore',
    allStores: 'stores/byCurrentGroup',
  },
  actionsToEvents: {
    save: 'stores/save',
  },
})('StoreEdit', StoreEdit)
</script>
