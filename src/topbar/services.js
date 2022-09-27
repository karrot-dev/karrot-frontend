import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useActivePublicActivityService } from '@/activities/services'
import { useCurrentGroupService } from '@/group/services'
import { useActiveGroupPreviewService } from '@/groupInfo/services'
import { useActiveIssueService } from '@/issues/services'
import { useActiveOfferService } from '@/offers/services'
import { useActivePlaceService } from '@/places/services'
import { useActiveUserService, useUserService } from '@/users/services'
import { defineService } from '@/utils/datastore/helpers'

export const useBreadcrumbs = defineService(() => {
  const { t } = useI18n()

  const route = useRoute()

  const { getUserById } = useUserService()

  const { group } = useCurrentGroupService()
  const { offer } = useActiveOfferService()
  const { place } = useActivePlaceService()
  const { user } = useActiveUserService()
  const { issue } = useActiveIssueService()
  const { group: activeGroupPreview } = useActiveGroupPreviewService()
  const { publicActivity } = useActivePublicActivityService()

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
      if (activeGroupPreview.value) {
        return {
          name: activeGroupPreview.value.name,
          route: { name: 'groupPreview', params: { groupPreviewId: activeGroupPreview.value.id } },
        }
      }
    }
    else if (breadcrumb.type === 'activeIssue') {
      if (issue.value) {
        return {
          name: getUserById(issue.value.affectedUser).displayName,
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
    else if (breadcrumb.type === 'publicActivity') {
      if (publicActivity.value) {
        return {
          name: publicActivity.value.place.group.name,
          route: { name: 'group', params: { groupId: publicActivity.value.place.group.id } },
        }
      }
    }
    else if (breadcrumb.translation) {
      return { ...breadcrumb, name: t(breadcrumb.translation) }
    }
    return breadcrumb
  }))
})
