import { defaultActionStatusesFor } from '>/helpers'

export function enrichGroup (group) {
  return {
    ...group,
    isMember: false,
    isCurrentGroup: false,
    isPlayground: false,
    isInactive: false,
    ...defaultActionStatusesFor('save', 'join', 'leave'),
  }
}
