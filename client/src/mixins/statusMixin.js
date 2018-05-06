export default {
  props: {
    status: { required: true, type: Object },
  },
  computed: {
    isPending () {
      return this.status && this.status.pending
    },
    hasNonFieldError () {
      return this.status && !!this.status.firstNonFieldError
    },
    firstNonFieldError () {
      return this.status && this.status.firstNonFieldError
    },
    hasAnyError () {
      return this.status && this.status.hasValidationErrors
    },
    anyFirstError () {
      return this.status && this.status.firstValidationError
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
