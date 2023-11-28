import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { computed, ref, unref, watch } from 'vue'

import { objectDiff } from '@/utils/utils'

export function useEdit (initial) {
  const edit = ref(cloneDeep(unref(initial)))

  const isNew = computed(() => {
    return initial.value && !initial.value.id && initial.value.id !== 0
  })

  const hasChanged = computed(() => {
    return !isNew.value && !deepEqual(initial.value, edit.value)
  })

  watch(initial, (current, previous) => {
    const changes = current && previous ? objectDiff(previous, current) : {}
    edit.value = Object.assign(edit.value, cloneDeep(changes))
  })

  const saveData = computed(() => {
    return isNew.value ? edit.value : { id: initial.value.id, ...objectDiff(initial.value, edit.value) }
  })

  function reset () {
    edit.value = cloneDeep(initial.value)
    // TODO: is this needed?
    // this.$emit('reset', this.value.id)
  }

  return {
    edit,
    saveData,
    isNew,
    hasChanged,
    reset,
  }
}

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
