import i18n from '@/base/i18n'

export const defaultActivityTypes = {
  pickup: {
    name: i18n.t('ACTIVITY_TYPES.PICKUP.NAME'),
    colour: '#222222',
    icon: 'fa-shopping-basket',
    feedbackIcon: 'fa-balance-scale',
    hasFeedback: true,
    hasFeedbackWeight: true,
  },
  task: {
    name: i18n.t('ACTIVITY_TYPES.TASK.NAME'),
    colour: '#aaaaaa',
    icon: 'fa-flag',
    feedbackIcon: 'fa-reply',
    hasFeedback: true,
    hasFeedbackWeight: false,
  },
  meeting: {
    name: i18n.t('ACTIVITY_TYPES.MEETING.NAME'),
    colour: '#ffffff',
    icon: 'fa-flag',
    feedbackIcon: 'fa-reply',
    hasFeedback: true,
    hasFeedbackWeight: false,
  },
}
