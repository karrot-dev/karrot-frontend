import { Platform } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import icons from '@/base/icons'
import { karrotPlugins } from '@/boot/plugins'
import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'

export function useSidenavMenuEntries () {
  const { t } = useI18n()
  const {
    groupId,
    theme,
    features,
  } = useCurrentGroupService()
  const { getGroupStatus } = useStatusService()
  const status = computed(() => getGroupStatus(groupId.value))

  function hasFeature (feature) {
    return features.value.includes(feature)
  }

  const cappedWallUnreadCount = computed(() => {
    return status.value.unreadWallMessageCount > 99 ? '99+' : status.value.unreadWallMessageCount
  })

  const entries = computed(() => {
    return [
      {
        name: 'wall',
        label: t('GROUP.WALL'),
        icon: 'fas fa-bullhorn',
        meet: `group:${groupId.value}`,
        to: { name: 'groupWall', params: { groupId: groupId.value } },
        badge: {
          count: cappedWallUnreadCount.value,
          color: 'secondary',
        },
      },
      {
        name: 'activities',
        label: t('GROUP.ACTIVITIES'),
        info: theme.value === 'foodsaving' && {
          title: t('GROUP.PICKUPS_TO_ACTIVITIES'),
          description: t('GROUP.PICKUPS_TO_ACTIVITIES_DESCRIPTION'),
          link: {
            text: t('BUTTON.READ_MORE'),
            href: 'https://community.karrot.world/t/what-are-activity-types-in-karrot/563',
          },
        },
        icon: icons.get('activity'),
        to: { name: 'groupActivities', params: { groupId: groupId.value } },
      },
      {
        condition: hasFeature('offers'),
        name: 'offers',
        label: t('GROUP.OFFERS') + (new Date().getFullYear() < 2020 ? ' 🆕' : ''),
        icon: icons.get('offer'),
        to: { name: 'groupOffers', params: { groupId: groupId.value } },
      },
      {
        name: 'feedback',
        label: t('ACTIVITY_FEEDBACK.TITLE'),
        icon: icons.get('feedback'),
        to: { name: 'groupFeedback', params: { groupId: groupId.value } },
        badge: {
          count: status.value.feedbackPossibleCount,
          color: 'info',
          title: t('ACTIVITYLIST.AVAILABLE_FEEDBACK', status.value.feedbackPossibleCount, { count: status.value.feedbackPossibleCount }),
        },
      },
      {
        name: 'members',
        label: t('GROUP.MEMBERS'),
        icon: 'fas fa-users',
        to: { name: 'groupMembers', params: { groupId: groupId.value } },
      },
      {
        condition: hasFeature('agreements'),
        name: 'agreements',
        label: t('GROUP.AGREEMENTS'),
        icon: 'fas fa-handshake',
        to: { name: 'agreements', params: { groupId: groupId.value } },
      },
      {
        name: 'history',
        label: t('GROUP.HISTORY'),
        icon: 'far fa-clock',
        to: { name: 'groupHistory', params: { groupId: groupId.value } },
      },
      {
        name: 'applications',
        label: t('GROUP.APPLICATIONS'),
        icon: 'fas fa-address-card',
        to: { name: 'applications', params: { groupId: groupId.value } },
        badge: {
          count: status.value.pendingApplicationCount,
          color: 'blue',
          title: t('APPLICATION.WALL_NOTICE', status.value.pendingApplicationCount, { count: status.value.pendingApplicationCount }),
        },
        more: true,
      },
      {
        name: 'issues',
        label: t('ISSUE.TITLE'),
        icon: 'fas fa-vote-yea',
        to: { name: 'issueList', params: { groupId: groupId.value } },
        badge: {
          count: status.value.ongoingIssueCount,
          color: 'blue',
          title: t('ISSUE.NOTICE', status.value.ongoingIssueCount, { count: status.value.ongoingIssueCount }),
        },
        more: true,
      },
      {
        name: 'statistics',
        label: t('GROUP.STATISTICS'),
        icon: 'fas fa-chart-bar',
        to: { name: 'activityHistoryStatistics', params: { groupId: groupId.value } },
        more: true,
      },
      {
        name: 'preview',
        label: t('GROUPINFO.META'),
        icon: 'fas fa-info-circle',
        to: { name: 'groupPreview', params: { groupPreviewId: groupId.value } },
        more: true,
      },
      {
        condition: Platform.is.mobile === true,
        name: 'map',
        label: t('GROUPMAP.TITLE'),
        icon: 'fas fa-map',
        to: { name: 'map', params: { groupId: groupId.value } },
        more: true,
      },

    ].filter(e => typeof e.condition === 'undefined' || e.condition === true)
  })

  return computed(() => {
    let entriesResult = entries.value
    for (const plugin of karrotPlugins) {
      if (plugin.sidenavMenu) {
        try {
          const result = plugin.sidenavMenu(entriesResult)
          if (Array.isArray(result)) {
            entriesResult = result
          }
        }
        catch (error) {
          console.error('sidenavMenu error from plugin', error)
        }
      }
    }
    return entriesResult
  })
}
