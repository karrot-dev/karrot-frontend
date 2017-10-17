<script>
import { connect } from 'vuex-connect'
import StoreEdit from '@/components/Store/StoreEdit'

export default connect({
  gettersToProps: {
    store: 'stores/createDefaults',
  },
  actionsToEvents: {
    save: 'stores/create',
  },
})('StoreCreate', StoreEdit)
</script>
