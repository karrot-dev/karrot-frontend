<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import GroupInfoCard from '@/components/GroupJoin/GroupInfoCard.vue'

export default connect({
  gettersToProps: {
    group: 'groups/activeGroupInfo',
  },
  methodsToEvents: {
    visit: (store, { groupId }) => router.push({ name: 'group', params: { groupId } }),
    join: ({ dispatch }, { groupId, password }) => {
      dispatch('auth/setJoinGroupAfterLogin', { groupId, password })
      router.push({name: 'signup'})
    },
  },
})('GroupInfo', GroupInfoCard)
</script>
