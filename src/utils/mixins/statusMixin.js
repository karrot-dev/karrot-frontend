import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import i18n from '@/base/i18n'

export function useStatusHelpers (status) {
  const { t } = useI18n()

  const isPending = computed(() => status.value?.pending)
  const firstNonFieldError = computed(() => status.value?.firstNonFieldError)
  const hasNonFieldError = computed(() => Boolean(firstNonFieldError.value))
  const anyFirstError = computed(() => {
    if (!status.value) return
    const errorLabel = status.value.firstValidationError ||
      (status.value.serverError && t('GLOBAL.SERVER_ERROR')) ||
      (status.value.networkError && t('GLOBAL.NOT_CONNECTED'))
    if (!errorLabel) return
    return errorLabel
  })
  const hasAnyError = computed(() => Boolean(anyFirstError.value))

  function hasError (field) {
    return Boolean(firstError(field))
  }

  function firstError (field) {
    return status.value?.validationErrors?.[field]?.[0]
  }

  return {
    isPending,
    hasNonFieldError,
    firstNonFieldError,
    hasAnyError,
    anyFirstError,

    hasError,
    firstError,
  }
}

export default {
  props: {
    status: { default: null, type: Object },
  },
  computed: {
    isPending () {
      return this.status && this.status.pending
    },
    hasNonFieldError () {
      return Boolean(this.firstNonFieldError)
    },
    firstNonFieldError () {
      return this.status && this.status.firstNonFieldError
    },
    hasAnyError () {
      return Boolean(this.anyFirstError)
    },
    anyFirstError () {
      const { status } = this
      if (!status) return
      const errorLabel = status.firstValidationError ||
        (status.serverError && i18n.t('GLOBAL.SERVER_ERROR')) ||
        (status.networkError && i18n.t('GLOBAL.NOT_CONNECTED'))
      if (errorLabel) return errorLabel
    },
  },
  methods: {
    hasError (field) {
      return !!this.firstError(field)
    },
    firstError (field) {
      const errors = this.status && this.status.validationErrors && this.status.validationErrors[field]
      return errors && errors[0]
    },
  },
}

const NO_ERROR = {
  error: false,
  errorMessage: '',
}

export function mapErrors (config) {
  const computed = {}
  for (const property of Object.keys(config)) {
    const rules = config[property]
    computed[`${property}Error`] = function () {
      const checkServerErrors = () => {
        const firstServerError = this.firstError(property)
        if (!firstServerError) return NO_ERROR
        return {
          error: true,
          errorMessage: firstServerError,
        }
      }
      const vuelidate = this.v$.edit[property]
      if (vuelidate === undefined || !vuelidate.$error) return checkServerErrors()
      const ruleWithError = rules.find(([ruleName]) => vuelidate[ruleName].$invalid)
      if (!ruleWithError) return checkServerErrors()
      const [, i18nKey, i18nParams] = ruleWithError
      return {
        error: true,
        errorMessage: this.$t(i18nKey, i18nParams),
      }
    }
  }
  return computed
}
