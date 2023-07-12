import { useMutation } from '@tanstack/vue-query'

import { withStatus } from '@/utils/queryHelpers'

import api from './api/feedback'

export function useFeedbackSaveMutation (mutationOptions = {}) {
  return withStatus(useMutation(
    feedback => {
      if (feedback.id) {
        return api.save(feedback)
      }
      else {
        return api.create(feedback)
      }
    },
    mutationOptions,
  ))
}
