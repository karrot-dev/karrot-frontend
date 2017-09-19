<script>
import { connect } from 'vuex-connect'
import SearchUI from './SearchUI.vue'

export default connect({
  gettersToProps: {
    stores: 'stores/list',
    users: 'users/list',
  },
})('SearchUI', SearchUI)
</script>
