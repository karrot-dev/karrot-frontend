<script>
import { connect } from 'vuex-connect'
import Wall from '@/components/Wall/Wall'

export default connect({
  gettersToProps: {
    joinedPickups: 'pickups/joined',
    emptyPickups: 'pickups/empty',
    messages: 'conversations/activeMessages',
    messageReceiveStatus: 'conversations/receiveStatus',
    messageReceiveMoreStatus: 'conversations/receiveMoreStatus',
    canLoadMore: 'conversations/canLoadMore',
    sendStatus: 'conversations/sendStatus',
    currentUser: 'auth/user',
  },
  actionsToEvents: {
    join: 'pickups/join',
    leave: 'pickups/leave',
    send: 'conversations/sendMessage',
  },
  actionsToProps: {
    fetchMoreMessages: 'conversations/fetchMoreMessages',
  },
})('GroupWall', Wall)
</script>
