<script>
import { connect } from 'vuex-connect'
import Wall from '@/components/Wall/Wall.vue'

export default connect({
  gettersToProps: {
    emptyPickups: 'pickups/empty',
    messages: 'conversations/activeMessages',
  },
  actionsToEvents: {
    join: 'pickups/join',
    leave: 'pickups/leave',
    send: 'conversations/sendMessage',
  },
})('GroupWall', Wall)
</script>
