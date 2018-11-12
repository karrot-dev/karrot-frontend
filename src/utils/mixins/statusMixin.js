import i18n from '@/base/i18n'

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
