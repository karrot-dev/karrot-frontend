<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import GroupGalleryUI from '@/groupInfo/components/GroupGalleryUI'

export default connect({
  gettersToProps: {
    myGroups: 'groups/mineWithApplications',
    otherGroups: 'groups/other',
    playgroundGroup: 'groups/playground',
    fetchStatus: 'groups/fetchStatus',
    isLoggedIn: 'auth/isLoggedIn',
  },
  methodsToEvents: {
    preview: (_, groupId) => router.push({ name: 'groupPreview', params: { groupPreviewId: groupId } }).catch(() => {}),
    visit: (_, groupId) => router.push({ name: 'group', params: { groupId } }).catch(() => {}),
  },
})('GroupGallery', GroupGalleryUI)
</script>
