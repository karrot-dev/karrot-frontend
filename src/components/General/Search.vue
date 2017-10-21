<script>
import { connect } from 'vuex-connect'
import SearchUI from './SearchUI.vue'

export default connect({
  gettersToProps: {
    groups: 'groups/all',
    stores: 'stores/all',
    users: 'users/all',
  },
})('Search', SearchUI)
</script>
