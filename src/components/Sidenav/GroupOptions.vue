<script>
import { connect } from 'vuex-connect'
import GroupOptionsUI from './GroupOptionsUI.vue'

export default connect({
  gettersToProps: {
    currentGroup: 'groups/activeGroup',
  },
})('GroupOptionsUI', GroupOptionsUI)
</script>
