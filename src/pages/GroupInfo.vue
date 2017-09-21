<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import GroupInfoCard from '@/components/GroupJoin/GroupInfoCard.vue'

export default connect({
  gettersToProps: {
    group: 'groups/activeGroupInfo',
  },
  actionsToEvents: {
    join: 'groups/join',
  },
  methodsToEvents: {
    visit: (store, { groupId }) => router.push({ name: 'group', params: { groupId } }),
  },
})('GroupInfo', GroupInfoCard)
</script>
