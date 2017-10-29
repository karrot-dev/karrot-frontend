<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import GroupPreviewGallery from '@/components/GroupJoin/GroupPreviewGallery'

export default connect({
  gettersToProps: {
    myGroups: 'groups/myGroups',
    otherGroups: 'groups/otherGroups',
    isLoggedIn: 'auth/isLoggedIn',
    activeGroupId: 'groups/activeGroupId',
  },
  methodsToEvents: {
    preview: (store, { groupId }) => router.push({ name: 'groupInfo', params: { groupInfoId: groupId } }),
    visit: (store, { groupId }) => router.push({ name: 'group', params: { groupId } }),
  },
})('GroupsGallery', GroupPreviewGallery)
</script>
