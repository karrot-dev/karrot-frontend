import i18n from '@/base/i18n'

function getMessageParams (type, context) {
  const commonParams = {
    userName: context.user && context.user.displayName,
  }

  switch (type) {
    case 'new_applicant':
      return {
        userName: context.application && context.application.user.displayName,
      }
    case 'feedback_possible':
      return {
        date: context.pickup && i18n.d(context.pickup.date, 'weekdayHourMinute'),
      }
    case 'pickup_upcoming':
      return {
        time: context.pickup && i18n.d(context.pickup.date, 'hourMinute'),
      }
    case 'pickup_disabled':
    case 'pickup_enabled':
    case 'pickup_moved':
      return {
        dateTime: context.pickup && i18n.d(context.pickup.date, 'dateAndTime'),
      }
    case 'new_store':
      return {
        storeName: context.store && context.store.name,
      }
    case 'conflict_resolution_created':
    case 'conflict_resolution_continued':
    case 'conflict_resolution_decided':
      return {
        userName: context.affectedUser && context.affectedUser.displayName,
      }
  }

  return commonParams
}

function getIcon (type, context) {
  switch (type) {
    case 'pickup_enabled':
    case 'application_accepted':
      return 'fas fa-check'
    case 'pickup_disabled':
    case 'application_declined':
    case 'you_were_removed':
      return 'fas fa-times'
    case 'invitation_accepted':
    case 'new_member':
      return 'fas fa-user-plus'
    case 'feedback_possible':
      return 'fas fa-balance-scale'
    case 'pickup_upcoming':
      return 'fas fa-calendar-alt'
    case 'new_store':
      return 'fas fa-shopping-cart'
    case 'new_applicant':
      return 'fas fa-address-card'
    case 'user_became_editor':
    case 'you_became_editor':
      return 'fas fa-angle-double-up'
    case 'pickup_moved':
    case 'voting_ends_soon':
      return 'far fa-clock'
    case 'conflict_resolution_created':
    case 'conflict_resolution_created_about_you':
    case 'conflict_resolution_continued':
    case 'conflict_resolution_continued_about_you':
    case 'conflict_resolution_decided':
    case 'conflict_resolution_decided_about_you':
      return 'fas fa-bomb'
  }
}

function getRouteTo (type, { group, user, store, pickup, issue } = {}) {
  switch (type) {
    case 'user_became_editor':
    case 'invitation_accepted':
    case 'new_member':
      return user && { name: 'user', params: { userId: user.id } }
    case 'you_became_editor': // TODO show information about editing permissions
    case 'application_accepted':
      return group && { name: 'group', params: { groupId: group.id } }
    case 'new_applicant':
      return group && { name: 'groupApplications', params: { groupId: group.id } }
    case 'feedback_possible':
      return group && pickup && { name: 'giveFeedback', params: { groupId: group.id, pickupId: pickup.id } }
    case 'application_declined':
      return group && { name: 'groupPreview', params: { groupPreviewId: group.id } }
    case 'new_store':
      return group && store && { name: 'store', params: { groupId: group.id, storeId: store.id } }
    case 'pickup_upcoming':
    case 'pickup_disabled':
    case 'pickup_enabled':
    case 'pickup_moved':
      return group && store && pickup && { name: 'pickupDetail', params: { groupId: group.id, storeId: store.id, pickupId: pickup.id } }
    case 'conflict_resolution_created':
    case 'conflict_resolution_created_about_you':
    case 'conflict_resolution_continued':
    case 'conflict_resolution_continued_about_you':
    case 'conflict_resolution_decided':
    case 'conflict_resolution_decided_about_you':
    case 'voting_ends_soon':
      return group && issue && { name: 'conflictResolution', params: { groupId: group.id, issueId: issue.id } }
  }
}

export default function getConfig (type, context) {
  const config = {
    message: i18n.t(`NOTIFICATION_BELLS.${type.toUpperCase()}`, getMessageParams(type, context)),
    icon: getIcon(type, context),
    routeTo: getRouteTo(type, context),
  }

  return config
}
