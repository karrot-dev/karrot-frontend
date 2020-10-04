<script>
import { connect } from 'vuex-connect'
import router from '@/router'
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
    'open-chat': 'detail/openForApplication',
  },
  methodsToEvents: {
    'go-visit': (_, groupId) => router.push({ name: 'group', params: { groupId } }).catch(() => {}),
    'go-settings': ({ dispatch }) => router.push({ name: 'settings', hash: '#change-email' }).catch(() => {}),
    'go-signup': ({ dispatch }, group) => {
      if (group.isOpen) dispatch('auth/setJoinGroupAfterLogin', group.id)
      router.push({ name: 'signup' }).catch(() => {})
    },
    'go-apply': (_, groupId) => router.push({ name: 'applicationForm', params: { groupPreviewId: groupId } }).catch(() => {}),
  },
})('GroupPreview', GroupPreviewUI)
</script>
