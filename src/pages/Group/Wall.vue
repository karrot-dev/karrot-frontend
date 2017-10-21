<script>
import { connect } from 'vuex-connect'
import Wall from '@/components/Wall/Wall.vue'

export default connect({
  gettersToProps: {
    joinedPickups: 'pickups/joined',
    emptyPickups: 'pickups/empty',
    messages: 'conversations/activeMessages',
    messageReceiveStatus: 'conversations/receiveStatus',
  },
  actionsToEvents: {
    join: 'pickups/join',
    leave: 'pickups/leave',
    send: 'conversations/sendMessage',
    fetchMoreMessages: 'conversations/fetchMoreMessages',
  },
})('GroupWall', Wall)
</script>
