export default {
  props: {
    status: { required: true },
  },
  computed: {
    isPending () {
      return this.status.pending
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
