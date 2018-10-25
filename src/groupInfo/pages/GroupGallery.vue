<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import GroupGalleryUI from '@/groupInfo/components/GroupGalleryUI'

export default connect({
  gettersToProps: {
    myGroups: 'groups/mine',
    otherGroups: 'groups/other',
    playgroundGroup: 'groups/playground',
    isLoggedIn: 'auth/isLoggedIn',
  },
  methodsToEvents: {
    preview: (store, groupId) => router.push({ name: 'groupPreview', params: { groupPreviewId: groupId } }),
    visit: (store, groupId) => router.push({ name: 'group', params: { groupId } }),
  },
})('GroupGallery', GroupGalleryUI)
</script>
