import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { Dialog, useQuasar } from 'quasar'
import { computed, ref, unref, watch } from 'vue'

import { objectDiff } from '@/utils/utils'
import { useValidation } from '@/utils/validation'

import ConfirmChangesDialog from '@/utils/components/ConfirmChangesDialog.vue'
import KDialog from '@/utils/components/KDialog.vue'

export function useForm (initial, { rules, create, update, createStatus, updateStatus, confirm, confirmExtraComponent, onSuccess }) {
  const edit = ref(cloneDeep(unref(initial)))
  const confirmChanges = useConfirmChanges()

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

  async function save () {
    if (!canSave.value || isPending.value) return
    if (!await validate()) {
      return
    }
    if (isNew.value) {
      await create(edit.value)
    }
    else {
      const updateData = {
        ...objectDiff(initial.value, edit.value),
        id: initial.value.id,
      }
      if (confirm) {
        const { ok, updatedMessage } = await confirmChanges({ extraComponent: confirmExtraComponent })
        if (!ok) return
        if (updatedMessage) {
          Object.assign(updateData, { updatedMessage })
        }
      }
      await update(updateData)
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

export function useConfirmChanges () {
  const $q = useQuasar()
  return ({ extraComponent, extraComponentProps } = {}) => {
    return new Promise(resolve => {
      $q.dialog({
        component: ConfirmChangesDialog,
        componentProps: {
          extraComponent,
          extraComponentProps,
        },
      })
        .onOk(data => {
          resolve({ ok: true, ...data })
        })
        .onCancel(() => {
          resolve({ ok: false })
        })
    })
  }
}

/**
 * Puts the passed in component inside our KDialog wrapper
 * Avoids having to make the inner component implement
 * the QDialog interface
 */
export function useOpenDialog () {
  const $q = useQuasar()
  return (Component, props) => {
    $q.dialog({
      component: KDialog,
      componentProps: {
        component: Component,
        componentProps: props,
      },
    })
  }
}
