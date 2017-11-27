<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import GroupGalleryUI from '@/components/GroupJoin/GroupGalleryUI'

export default connect({
  gettersToProps: {
    myGroups: 'groups/my',
    otherGroups: 'groups/other',
    isLoggedIn: 'auth/isLoggedIn',
    currentGroupId: 'currentGroup/id',
  },
  methodsToEvents: {
    preview: (store, { groupId }) => router.push({ name: 'groupPreview', params: { groupPreviewId: groupId } }),
    visit: (store, { groupId }) => router.push({ name: 'group', params: { groupId } }),
  },
})('GroupGallery', GroupGalleryUI)
</script>
