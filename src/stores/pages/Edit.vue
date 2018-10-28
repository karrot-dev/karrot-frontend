<script>
import { connect } from 'vuex-connect'
import store from '@/base/store'
import StoreEdit from '@/stores/components/StoreEdit'

export default connect({
  stateToProps: {
    status: () => {
      const active = store.getters['stores/activeStore']
      return active && active.saveStatus
    },
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
