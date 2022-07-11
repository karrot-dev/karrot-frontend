// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


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
