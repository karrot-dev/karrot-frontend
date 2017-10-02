<script>
import { connect } from 'vuex-connect'
import SearchUI from './SearchUI.vue'

export default connect({
  gettersToProps: {
    stores: 'stores/all',
    users: 'users/all',
  },
})('SearchUI', SearchUI)
</script>
