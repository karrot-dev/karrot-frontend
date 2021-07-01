import { defaultActionStatusesFor } from '>/helpers'

export function enrichGroup (group) {
  return {
    ...group,
    isCurrentGroup: false,
    isPlayground: false,
    isInactive: false,
    ...defaultActionStatusesFor('save', 'join', 'leave'),
  }
}
