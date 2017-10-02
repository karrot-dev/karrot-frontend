<script>
import { connect } from 'vuex-connect'
import GroupMapUI from './GroupMapUI.vue'

export default connect({
  gettersToProps: {
    stores: 'stores/all',
    users: 'groups/activeUsers',
  },
})('GroupMapUI', GroupMapUI)
</script>
