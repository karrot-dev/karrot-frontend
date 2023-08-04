import deepmerge from 'deepmerge'

export function defaultActionStatus () {
  return {
    pending: false,
    validationErrors: {},
    hasValidationErrors: false,
    serverError: false,
    networkError: false,
    startedAt: null,
  }
}

export function defaultActionStatusesFor (...actions) {
  const result = {}
  for (const action of actions) {
    result[action + 'Status'] = defaultActionStatus()
  }
  return result
}

/**
 * Helper for the interface of `withMeta` status and components (`statusMixin`)
 */
function statusMock (override) {
  const defaults = {
    ...defaultActionStatus(),
    firstNonFieldError: undefined,
    firstValidationError: undefined,
  }
  return deepmerge(defaults, override || {})
}

export const statusMocks = {
  default: statusMock,
  pending () {
    return statusMock({ pending: true })
  },
  validationError (field, message) {
    return statusMock({
      hasValidationErrors: true,
      firstValidationError: message,
      validationErrors: { [field]: [message] },
    })
  },
  nonFieldError (message) {
    return statusMock({
      firstNonFieldError: message,
      hasValidationErrors: true,
      firstValidationError: message,
      validationErrors: { nonFieldErrors: [message] },
    })
  },
}
