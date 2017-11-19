import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

const _edit = {}

export default {
  props: {
    value: { required: true },
  },
  watch: {
    source (current, previous) {
      const changes = objectDiff(previous, current)
      this.edit = cloneDeep({ ...this.edit, ...changes })
    },
  },
  mounted () {
    this.edit = this.source
  },
  computed: {
    edit: {
      get () {
        return _edit
      },
      set (val) {
        Object.entries(cloneDeep(val))
          .forEach(([prop, value]) => this.$set(_edit, prop, value))
      },
    },
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
