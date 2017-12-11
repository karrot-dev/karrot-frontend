export default {
  props: {
    status: { required: true, type: Object },
  },
  computed: {
    isPending () {
      return this.status.pending
    },
    hasNonFieldErrors () {
      return !!this.nonFieldErrors
    },
    nonFieldErrors () {
      for (let field of ['nonFieldErrors', 'detail']) {
        if (this.hasError(field)) return this.firstError(field)
      }
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
