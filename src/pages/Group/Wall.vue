<script>
import { connect } from 'vuex-connect'
import Wall from '@/components/Wall/Wall'

export default connect({
  gettersToProps: {
    joinedPickups: 'pickups/joined',
    emptyPickups: 'pickups/empty',
    conversation: 'conversations/active',
    user: 'auth/user',
  },
  actionsToEvents: {
    join: 'pickups/join',
    leave: 'pickups/leave',
    send: 'conversations/sendInActiveConversation',
  },
  actionsToProps: {
    fetchMore: 'conversations/fetchMoreForActiveConversation',
  },
})('GroupWall', Wall)
</script>
