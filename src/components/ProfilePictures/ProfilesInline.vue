<script>
import { connect } from 'vuex-connect'
import ProfilesInlineUI from './ProfilesInlineUI.vue'

export default connect({
  gettersToProps: {
    currentUser: 'auth/user',
  },
  methodsToEvents: {
    join ({ commit }) {
      this.$emit('join')
    },
    leave ({ commit }) {
      this.$emit('leave')
    },
  },
})('ProfilesInline', ProfilesInlineUI)
</script>
