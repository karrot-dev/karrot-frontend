<script>
import { connect } from 'vuex-connect'
import GroupMapUI from './GroupMapUI.vue'

export default connect({
  gettersToProps: {
    stores: 'stores/list',
    users: 'groups/activeUsers',
  },
})('GroupMapUI', GroupMapUI)
</script>
