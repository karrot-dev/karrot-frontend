<script>
import { connect } from 'vuex-connect'
import router from '@/base/router'
import GroupPreviewUI from '@/groupInfo/components/GroupPreviewUI'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
    isLoggedIn: 'auth/isLoggedIn',
    user: 'auth/user',
    application: 'applications/getForActivePreview',
  },
  actionsToEvents: {
    join: 'groups/join',
    withdraw: 'applications/withdraw',
    openChat: 'detail/openForApplication',
  },
  methodsToEvents: {
    goVisit: (_, groupId) => router.push({ name: 'group', params: { groupId } }),
    goSettings: ({ dispatch }) => router.push({ name: 'settings', hash: '#change-email' }),
    goSignup: ({ dispatch }, group) => {
      if (group.isOpen) dispatch('auth/setJoinGroupAfterLogin', group.id)
      router.push({ name: 'signup' })
    },
    goApply: (_, groupId) => router.push({ name: 'applicationForm', params: { groupPreviewId: groupId } }),
  },
})('GroupPreview', GroupPreviewUI)
</script>
