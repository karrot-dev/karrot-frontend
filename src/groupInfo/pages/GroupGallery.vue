<script>
import { connect } from 'vuex-connect'
import router from '@/base/router'
import GroupGalleryUI from '@/groupInfo/components/GroupGalleryUI'

export default connect({
  gettersToProps: {
    myGroups: 'groups/mine',
    otherGroups: 'groups/other',
    places: 'placesInfo/all',
    playgroundGroup: 'groups/playground',
    fetchStatus: 'groups/fetchStatus',
    isLoggedIn: 'auth/isLoggedIn',
  },
  methodsToEvents: {
    preview: (_, groupId) => router.push({ name: 'groupPreview', params: { groupPreviewId: groupId } }),
    visit: (_, groupId) => router.push({ name: 'group', params: { groupId } }),
  },
})('GroupGallery', GroupGalleryUI)
</script>
