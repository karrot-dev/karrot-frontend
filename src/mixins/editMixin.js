import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  props: {
    value: { required: true },
  },
  data () {
    return {
      edit: cloneDeep(this.source),
    }
  },
  watch: {
    source (current, previous) {
      const changes = objectDiff(previous, current)
      this.edit = cloneDeep({ ...this.edit, ...changes })
    },
  },
  computed: {
    source () {
      const isFn = typeof this.value === 'function'
      return isFn ? this.value() : this.value
    },
    isNew () {
      return !this.source.id
    },
    hasChanged () {
      return !this.isNew && !deepEqual(this.source, this.edit)
    },
  },
  methods: {
    save (event) {
      if (this.isNew) {
        this.$emit('save', this.edit, event)
      }
      else {
        this.$emit('save', { ...objectDiff(this.source, this.edit), id: this.source.id }, event)
      }
    },
    destroy (event) {
      this.$emit('destroy', this.source.id, event)
    },
    reset () {
      this.edit = cloneDeep(this.source)
      this.$emit('reset', this.source.id)
    },
  },
}
