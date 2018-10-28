<script>
import { connect } from 'vuex-connect'
import router from '@/base/router'
import GroupPreviewUI from '@/groupInfo/components/GroupPreviewUI'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
    isLoggedIn: 'auth/isLoggedIn',
    user: 'auth/user',
    application: 'groupApplications/getForActivePreview',
  },
  actionsToEvents: {
    join: 'groups/join',
    withdraw: 'groupApplications/withdraw',
    openChat: 'detail/openForApplication',
  },
  methodsToEvents: {
    goVisit: (store, groupId) => router.push({ name: 'group', params: { groupId } }),
    goSettings: ({ dispatch }) => router.push({ name: 'settings', hash: '#change-email' }),
    goSignup: ({ dispatch }, group) => {
      if (group.isOpen) dispatch('auth/setJoinGroupAfterLogin', group.id)
      router.push({ name: 'signup' })
    },
    goApply: (store, groupId) => router.push({ name: 'applicationForm', params: { groupPreviewId: groupId } }),
  },
})('GroupPreview', GroupPreviewUI)
</script>
