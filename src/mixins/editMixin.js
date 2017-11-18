import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  props: {
    value: { required: true },
  },
  data () {
    return {
      edit: cloneDeep(this.value),
    }
  },
  watch: {
    value (current, previous) {
      const changes = objectDiff(previous, current)
      this.edit = cloneDeep({ ...this.edit, ...changes })
    },
  },
  computed: {
    isNew () {
      return !this.value.id
    },
    hasChanged () {
      return !this.isNew && !deepEqual(this.value, this.edit)
    },
  },
  methods: {
    save (event) {
      if (this.isNew) {
        this.$emit('save', this.edit, event)
      }
      else {
        this.$emit('save', { ...objectDiff(this.value, this.edit), id: this.value.id }, event)
      }
    },
    destroy (event) {
      this.$emit('destroy', this.value.id, event)
    },
    reset () {
      this.edit = cloneDeep(this.value)
      this.$emit('reset', this.value.id)
    },
  },
}
