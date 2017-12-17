export default {
  props: {
    status: { required: true, type: Object },
  },
  computed: {
    isPending () {
      return this.status.pending
    },
    hasNonFieldError () {
      return !!this.status.firstNonFieldError
    },
    firstNonFieldError () {
      return this.status.firstNonFieldError
    },
    hasAnyError () {
      return this.status.hasValidationErrors
    },
    anyFirstError () {
      return this.status.firstValidationError
    },
  },
  methods: {
    hasError (field) {
      return !!this.status.validationErrors[field]
    },
    firstError (field) {
      const errors = this.status.validationErrors[field]
      return errors && errors[0]
    },
  },
}
