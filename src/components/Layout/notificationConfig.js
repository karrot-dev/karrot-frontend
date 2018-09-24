import i18n from '@/i18n'

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
        date: context.pickup && i18n.d(context.pickup.date, 'dayAndTime'),
      }
    case 'pickup_upcoming':
      return {
        time: context.pickup && i18n.d(context.pickup.date, 'timeShort'),
      }
    case 'new_store':
      return {
        storeName: context.store.name,
      }
  }

  return commonParams
}

function getIcon (type, context) {
  switch (type) {
    case 'application_accepted':
      return 'fas fa-check'
    case 'application_declined':
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
  }
}

export default function getConfig (type, context) {
  const config = {
    message: i18n.t(`NOTIFICATION_BELLS.${type.toUpperCase()}`, getMessageParams(type, context)),
    icon: getIcon(type, context),
  }

  return config
}
