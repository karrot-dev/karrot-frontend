<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import GroupPreviewUI from '@/components/GroupJoin/GroupPreviewUI'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
    isLoggedIn: 'auth/isLoggedIn',
    user: 'auth/user',
  },
  actionsToEvents: {
    join: 'groups/join',
    withdraw: 'groupApplications/withdraw',
  },
  methodsToEvents: {
    goVisit: (store, groupId) => router.push({ name: 'group', params: { groupId } }),
    goSettings: ({ dispatch }) => router.push({ name: 'settings', hash: '#change-email' }),
    goSignup: ({ dispatch }, groupId) => {
      dispatch('auth/setJoinGroupAfterLogin', { id: groupId })
      router.push({ name: 'signup' })
    },
    goApply: (store, groupId) => router.push({ name: 'applicationForm', params: { groupPreviewId: groupId } }),
  },
})('GroupPreview', GroupPreviewUI)
</script>
