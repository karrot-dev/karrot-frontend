import { useI18n } from 'vue-i18n'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import icons from '@/base/icons'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'

export function useNotificationHelpers () {
  const { t, d } = useI18n()
  const { getUserById } = useUserService()
  const { getPlaceById } = usePlaceService()
  const { getActivityTypeById } = useActivityTypeService()
  const { getTranslatedName } = useActivityTypeHelpers()

  function getMessageParams (type, context) {
    function getActivityTypeName () {
      return getTranslatedName(getActivityTypeById(context.activity.activityType))
    }

    switch (type) {
      case 'new_applicant':
        return {
          userName: context.application && context.application.user.displayName,
        }
      case 'feedback_possible':
        return {
          date: context.activity && d(context.activity.date, 'weekdayHourMinute'),
          activityType: getActivityTypeName(),
        }
      case 'activity_upcoming':
        return {
          time: context.activity && d(context.activity.date, 'hourMinute'),
          activityType: getActivityTypeName(),
        }
      case 'activity_disabled':
      case 'activity_enabled':
      case 'activity_moved':
        return {
          dateTime: context.activity && d(context.activity.date, 'dateAndTime'),
          activityType: getActivityTypeName(),
        }
      case 'new_place':
        return {
          placeName: getPlaceById(context.place)?.name,
        }
    }

    return {
      userName: getUserById(context.user).displayName,
    }
  }

  function getIcon (type, context) {
    switch (type) {
      case 'activity_enabled':
      case 'application_accepted':
        return 'fas fa-check'
      case 'activity_disabled':
      case 'application_declined':
      case 'membership_review_you_were_removed':
        return 'fas fa-times'
      case 'invitation_accepted':
      case 'new_member':
        return 'fas fa-user-plus'
      case 'feedback_possible':
        if (context.activity && context.activity.activityType) {
          return context.activity.activityType.feedbackIcon
        }
        return icons.get('feedback')
      case 'activity_upcoming':
        if (context.activity && context.activity.activityType) {
          return context.activity.activityType.icon
        }
        return 'fas fa-calendar-alt'
      case 'new_place':
        return icons.get('place')
      case 'new_applicant':
        return 'fas fa-address-card'
      case 'user_became_editor':
      case 'you_became_editor':
        return 'fas fa-angle-double-up'
      case 'activity_moved':
      case 'voting_ends_soon':
        return 'far fa-clock'
      case 'membership_review_created':
      case 'membership_review_created_about_you':
      case 'membership_review_continued':
      case 'membership_review_continued_about_you':
      case 'membership_review_decided':
      case 'membership_review_decided_about_you':
        return 'far fa-frown-open'
      case 'mention':
        return 'alternate_email'
    }
  }

  function getRouteTo (type, { group: groupId, user: userId, place: placeId, activity, issue, url } = {}) {
    switch (type) {
      case 'user_became_editor':
      case 'invitation_accepted':
      case 'new_member':
        return { name: 'userInGroup', params: { userId, groupId } }
      case 'you_became_editor': // TODO show information about editing permissions
      case 'application_accepted':
        return { name: 'group', params: { groupId } }
      case 'new_applicant':
        return { name: 'applications', params: { groupId } }
      case 'feedback_possible':
        return activity && { name: 'giveFeedback', params: { groupId, activityId: activity.id } }
      case 'application_declined':
      case 'membership_review_you_were_removed':
        return { name: 'groupPreview', params: { groupPreviewId: groupId } }
      case 'new_place':
        return { name: 'place', params: { groupId, placeId } }
      case 'activity_upcoming':
      case 'activity_disabled':
      case 'activity_enabled':
      case 'activity_moved':
        return activity && { name: 'activityDetail', params: { groupId, placeId, activityId: activity.id } }
      case 'conflict_resolution_created':
      case 'conflict_resolution_created_about_you':
      case 'conflict_resolution_continued':
      case 'conflict_resolution_continued_about_you':
      case 'conflict_resolution_decided':
      case 'conflict_resolution_decided_about_you':
      case 'voting_ends_soon':
        return issue && { name: 'issueDetail', params: { groupId, issueId: issue.id } }
      case 'mention':
        // Remove the host and the /#/ bit...
        if (url) return url.replace(/https?:\/\/[^/]+\/#/, '')
    }
  }

  function getNotificationConfig (type, context) {
    return {
      message: t(`NOTIFICATION_BELLS.${type.toUpperCase()}`, getMessageParams(type, context)),
      icon: getIcon(type, context),
      routeTo: getRouteTo(type, context),
    }
  }

  return {
    getNotificationConfig,
  }
}
