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
  methodsToEvents: {
    visit: (store, { groupId }) => router.push({ name: 'group', params: { groupId } }),
    preApply: ({dispatch, getters}, { groupId }) => {
      if (getters['auth/isLoggedIn']) {
        router.push({ name: 'settings', hash: '#change-email' })
      }
      else {
        dispatch('auth/setJoinGroupAfterLogin', { id: groupId })
        router.push({ name: 'signup' })
      }
    },
    apply: ({ dispatch, getters }, { groupId }) => {
      if (getters['groups/activePreview'].isPlayground) {
        dispatch('groups/join', { id: groupId })
      }
      else {
        router.push({ name: 'applicationForm', params: { groupPreviewId: groupId } })
      }
    },
    withdraw: ({dispatch}, applicationId) => {
      dispatch('groupApplications/withdraw', applicationId)
    },
  },
})('GroupPreview', GroupPreviewUI)
</script>
