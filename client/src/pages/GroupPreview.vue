<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import GroupPreviewUI from '@/components/GroupJoin/GroupPreviewUI'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
    isLoggedIn: 'auth/isLoggedIn',
  },
  methodsToEvents: {
    visit: (store, { groupId }) => router.push({ name: 'group', params: { groupId } }),
    join: ({ dispatch, getters }, { groupId, password }) => {
      if (getters['auth/isLoggedIn']) {
        dispatch('groups/join', { id: groupId, password })
      }
      else {
        dispatch('auth/setJoinGroupAfterLogin', { id: groupId, password })
        router.push({ name: 'signup' })
      }
    },
  },
})('GroupPreview', GroupPreviewUI)
</script>
