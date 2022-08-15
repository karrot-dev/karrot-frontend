import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import { defineService } from '@/utils/datastore/helpers'
import { useCurrentGroupService } from '@/group/services'
import { useActiveOfferService } from '@/offers/services'
import { useActivePlaceService } from '@/places/services'
import { useActiveUserService } from '@/users/services'
import { useGroupInfoService } from '@/groupInfo/services'

export const useBreadcrumbs = defineService(() => {
  const { t } = useI18n()

  const route = useRoute()

  const { group } = useCurrentGroupService()
  const { offer } = useActiveOfferService()
  const { place } = useActivePlaceService()
  const { user } = useActiveUserService()

  // TODO: detach from store
  const store = useStore()
  const { getGroupById } = useGroupInfoService()
  const activePreviewId = computed(() => store.state.groups.activePreviewId)
  const activeGroup = computed(() => getGroupById(activePreviewId.value))

  // TODO: detach from store
  const activeIssue = computed(() => store.getters['issues/current'])

  const breadcrumbs = computed(() => findBreadcrumbs(route.matched))

  function findBreadcrumbs (matched) {
    // Combine all the breadcrumbs from the root
    return matched.reduce((acc, m) => {
      if (m.meta && m.meta.breadcrumbs) {
        acc.push(...m.meta.breadcrumbs)
      }
      return acc
    }, [])
  }

  return computed(() => breadcrumbs.value.map(breadcrumb => {
    if (breadcrumb.type === 'activeGroupPreview') {
      if (activeGroup.value) {
        return {
          name: activeGroup.value.name,
          route: { name: 'groupPreview', params: { groupPreviewId: activeGroup.value.id } },
        }
      }
    }
    else if (breadcrumb.type === 'activeIssue') {
      if (activeIssue.value) {
        return {
          name: activeIssue.value.affectedUser.displayName,
        }
      }
    }
    else if (breadcrumb.type === 'currentGroup') {
      if (group.value) {
        return {
          name: group.value.name,
          route: { name: 'group', params: { groupId: group.value.id } },
        }
      }
    }
    else if (breadcrumb.type === 'activeOffer') {
      if (offer.value) {
        if (offer.value) {
          return {
            name: offer.value.name,
          }
        }
      }
    }
    else if (breadcrumb.type === 'activePlace') {
      if (place.value) {
        return {
          name: place.value.name,
          route: { name: 'place', params: { placeId: place.value.id, groupId: place.value.group } },
        }
      }
    }
    else if (breadcrumb.type === 'activeUser') {
      if (user.value) {
        return {
          name: user.value.displayName,
          route: { name: 'user', params: { userId: user.value.id } },
        }
      }
    }
    else if (breadcrumb.translation) {
      return { ...breadcrumb, name: t(breadcrumb.translation) }
    }
    return breadcrumb
  }))
})
