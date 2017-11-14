import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { objectDiff } from '@/services/utils'

export default {
  props: {
    value: { required: true },
  },
  data () {
    const source = this.value.id ? this.value.__unenriched : this.value
    return {
      source,
      edit: cloneDeep(source),
    }
  },
  watch: {
    'value.__unenriched' (current, previous) {
      // we want to make sure it's _really_ changed or we risk undoing the users changes
      if (current !== previous || !deepEqual(current, previous)) {
        this.source = current
        this.reset()
      }
    },
  },
  computed: {
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
