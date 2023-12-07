<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form
      class="q-gutter-y-lg"
      style="max-width: 700px"
      @submit.prevent="save"
    >
      <h3 v-if="isNew">
        {{ t('PLACE_TYPES.ADD') }}
      </h3>
      <h3 v-else>
        {{ translatedName }}
      </h3>

      <TranslatableNameInput
        v-model="edit"
        :label="t('ACTIVITY_TYPES.NAME')"
        :error="Boolean(errors.name)"
        :error-message="errors.name"
        :options="translatableNameOptions"
        autofocus
        @blur="v.name.$touch"
      />

      <QInput
        v-model="edit.description"
        label="Description"
        :error="Boolean(errors.description)"
        :error-message="errors.description"
        outlined
      />

      <QField
        borderless
        hide-bottom-space
        :error="Boolean(errors.icon)"
        :error-message="errors.icon"
      >
        <template #before>
          <QIcon
            :name="edit.icon"
            size="lg"
            color="positive"
          />
        </template>
        <template #control>
          <IconPicker
            v-model="edit.icon"
            color="positive"
          />
        </template>
      </QField>

      <div class="row justify-end q-gutter-sm q-mt-sm">
        <QBtn
          type="button"
          @click="emit('cancel')"
        >
          {{ t('BUTTON.CANCEL') }}
        </QBtn>

        <QBtn
          v-if="!isNew && !placeType.isArchived"
          type="button"
          color="red"
          @click="archive"
        >
          {{ t('BUTTON.ARCHIVE') }}
        </QBtn>

        <QBtn
          v-if="!isNew && placeType.isArchived"
          type="button"
          color="red"
          @click="restore"
        >
          {{ t('STOREEDIT.RESTORE') }}
        </QBtn>

        <QBtn
          type="submit"
          color="primary"
          :disable="!canSave"
          :loading="isPending"
        >
          {{ t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>
<script setup>
import { QBtn, QField, QIcon, QInput } from 'quasar'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCurrentGroupId } from '@/group/helpers'
import { usePlaceTypeTranslatedName, usePlaceTypes } from '@/places/helpers'
import {
  useCreatePlaceTypeMutation,
  useSavePlaceTypeMutation,
} from '@/places/mutations'
import { confirmChanges, useForm } from '@/utils/forms'
import { isUnique, required } from '@/utils/validation'

import IconPicker from '@/utils/components/IconPicker.vue'
import TranslatableNameInput from '@/utils/components/TranslatableNameInput.vue'

const { t } = useI18n()

const props = defineProps({
  placeType: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'ok',
  'cancel',
])

const placeType = toRef(props, 'placeType')

const translatedName = usePlaceTypeTranslatedName(placeType)

const groupId = useCurrentGroupId()
const placeTypes = usePlaceTypes(groupId)
const { mutateAsync: create, status: createStatus } = useCreatePlaceTypeMutation({ groupId })
const { mutateAsync: update, status: updateStatus } = useSavePlaceTypeMutation()

const namesInUse = computed(() => {
  return placeTypes.value
    .filter(entry => entry.id && entry.id !== placeType.value.id)
    .map(entry => entry.name)
})

const {
  v,
  isNew,
  hasChanged,
  isPending,
  canSave,
  errors,
  edit,
  save,
} = useForm(placeType, {
  rules: {
    name: {
      required,
      isUnique: isUnique(value => !namesInUse.value.includes(value)),
    },
    icon: {
      required,
    },
  },
  create,
  createStatus,
  update,
  updateStatus,
  confirm: true,
  onSuccess () {
    emit('ok')
  },
})

const translatableNameOptions = computed(() => [
  'Unspecified',
  'Store',
  'Sharing Point',
  'Meeting Place',
  'Restaurant',
  'Market',
].map(name => ({
  name,
  label: t(`PLACE_TYPE_NAMES.${name}`),
  disable: namesInUse.value.includes(name),
})))

async function archive () {
  if (isNew.value) return
  const { ok, updatedMessage } = await confirmChanges()
  if (!ok) return
  await update({ id: placeType.value.id, isArchived: true, updatedMessage })
  emit('ok')
}

async function restore () {
  if (isNew.value) return
  const { ok, updatedMessage } = await confirmChanges()
  if (!ok) return
  await update({ id: placeType.value.id, isArchived: false, updatedMessage })
  emit('ok')
}

</script>

<style scoped lang="sass">
@import 'editbox'
</style>
