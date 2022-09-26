import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'

import { objectDiff } from '@/utils/utils'

export default {
  props: {
    value: { required: true, type: Object },
  },
  emits: [
    'save',
    'destroy',
    'reset',
  ],
  data () {
    return {
      edit: cloneDeep(this.value),
    }
  },
  watch: {
    value (current, previous) {
      const changes = current && previous ? objectDiff(previous, current) : {}
      Object.assign(this.edit, cloneDeep(changes))
    },
  },
  computed: {
    isNew () {
      return this.value && !this.value.id && this.value.id !== 0
    },
    hasChanged () {
      return !this.isNew && !deepEqual(this.value, this.edit)
    },
  },
  methods: {
    save (extraData = {}) {
      if (this.isNew) {
        this.$emit('save', { ...this.getCreateData(), ...extraData })
      }
      else {
        this.$emit('save', { ...this.getPatchData(), ...extraData, id: this.value.id })
      }
    },
    getCreateData () {
      return this.edit
    },
    getPatchData () {
      return objectDiff(this.value, this.edit)
    },
    destroy () {
      this.$emit('destroy', this.value.id)
    },
    reset () {
      this.edit = cloneDeep(this.value)
      this.$emit('reset', this.value.id)
    },
  },
}
