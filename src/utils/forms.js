import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { computed, ref, unref, watch } from 'vue'

import { objectDiff } from '@/utils/utils'
import { useValidation } from '@/utils/validation'

export function useForm (initial, { rules, create, update, createStatus, updateStatus, onSuccess }) {
  const edit = ref(cloneDeep(unref(initial)))

  const isNew = computed(() => {
    return initial.value && !initial.value.id && initial.value.id !== 0
  })

  const status = computed(() => isNew.value ? createStatus.value : updateStatus.value)
  const isPending = computed(() => status.value.pending)

  const { v, validate, errors } = useValidation(rules, edit, status)

  const hasChanged = computed(() => {
    return !isNew.value && !deepEqual(initial.value, edit.value)
  })

  const canSave = computed(() => isNew.value || hasChanged.value)

  watch(initial, (current, previous) => {
    const changes = current && previous ? objectDiff(previous, current) : {}
    edit.value = Object.assign(edit.value, cloneDeep(changes))
  })

  const saveData = computed(() => {
    return isNew.value ? edit.value : { id: initial.value.id, ...objectDiff(initial.value, edit.value) }
  })

  async function save () {
    if (!canSave.value || isPending.value) return
    if (!await validate()) {
      return
    }
    if (isNew.value) {
      await create(saveData.value)
    }
    else {
      await update(saveData.value)
    }
    onSuccess?.()
  }

  function reset () {
    edit.value = cloneDeep(initial.value)
    // TODO: is this needed?
    // this.$emit('reset', this.value.id)
  }

  return {
    edit,
    saveData,
    isNew,
    isPending,
    hasChanged,
    canSave,
    v,
    errors,
    save,
    reset,
  }
}
