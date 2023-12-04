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
        {{ t('PLACE_STATUSES.ADD') }}
      </h3>
      <h3 v-else>
        {{ translatedName }}
      </h3>

      <TranslatableNameInput
        v-model="edit"
        :label="$t('ACTIVITY_TYPES.NAME')"
        :error="Boolean(errors.name)"
        :error-message="errors.name"
        :options="translatableNameOptions"
        outlined
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
        :disable="isPending"
        :error="Boolean(errors.colour)"
        :error-message="errors.colour"
      >
        <template #before>
          <QIcon
            size="sm"
            :color="colourName ?? 'transparent'"
            name="fa fa-circle"
          />
        </template>
        <template #control>
          <ColourPicker v-model="edit.colour" />
        </template>
      </QField>

      <QField
        borderless
        hint="Whether to show places with this status on the map and in the list"
      >
        <template #control>
          <QToggle
            v-model="edit.isVisible"
            label="Visible"
          />
        </template>
      </QField>

      <div
        v-if="errors.nonFieldErrors"
        class="text-negative"
        style="font-size: 12px;"
      >
        {{ errors.nonFieldErrors }}
      </div>

      <div class="row justify-end q-gutter-sm q-mt-sm">
        <QBtn
          type="button"
          :disable="isPending"
          @click="emit('done')"
        >
          {{ t('BUTTON.CANCEL') }}
        </QBtn>

        <QBtn
          v-if="!isNew && !placeStatus.isArchived"
          type="button"
          color="red"
          :disable="isPending"
          @click="archive"
        >
          {{ $t('BUTTON.ARCHIVE') }}
        </QBtn>

        <QBtn
          v-if="!isNew && placeStatus.isArchived"
          type="button"
          color="red"
          :disable="isPending"
          @click="restore"
        >
          {{ $t('STOREEDIT.RESTORE') }}
        </QBtn>

        <QBtn
          type="submit"
          color="primary"
          :disable="!canSave"
          :loading="isPending"
        >
          {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>
<script setup>
import { QBtn, QField, QIcon, QInput, QToggle } from 'quasar'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useColourNameFor } from '@/activities/stylesheet'
import { useCurrentGroupId } from '@/group/helpers'
import { usePlaceStatuses, usePlaceStatusTranslatedName } from '@/places/helpers'
import { useCreatePlaceStatusMutation, useSavePlaceStatusMutation } from '@/places/mutations'
import { useForm } from '@/utils/forms'
import { isUnique, required } from '@/utils/validation'

import ColourPicker from '@/utils/components/ColourPicker.vue'
import TranslatableNameInput from '@/utils/components/TranslatableNameInput.vue'

const { t } = useI18n()

const props = defineProps({
  placeStatus: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'done',
])

const placeStatus = toRef(props, 'placeStatus')

const translatedName = usePlaceStatusTranslatedName(placeStatus)

const groupId = useCurrentGroupId()
const placeStatuses = usePlaceStatuses(groupId)
const { mutateAsync: create, status: createStatus } = useCreatePlaceStatusMutation({ groupId })
const { mutateAsync: update, status: updateStatus } = useSavePlaceStatusMutation()

const namesInUse = computed(() => {
  return placeStatuses.value
    .filter(entry => entry.id && entry.id !== placeStatus.value.id)
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
} = useForm(placeStatus, {
  rules: {
    name: {
      required,
      isUnique: isUnique(value => !namesInUse.value.includes(value)),
    },
    colour: {
      required,
    },
  },
  create,
  createStatus,
  update,
  updateStatus,
  onSuccess () {
    emit('done')
  },
})

const translatableNameOptions = computed(() => [
  'Created',
  'Negotiating',
  'Active',
  'Declined',
].map(name => ({
  name,
  label: t(`PLACE_STATUS_NAMES.${name}`),
  disable: namesInUse.value.includes(name),
})))

const colourName = useColourNameFor(edit)

async function archive () {
  if (isNew.value) return
  await update({ id: placeStatus.value.id, isArchived: true })
  emit('done')
}

async function restore () {
  if (isNew.value) return
  await update({ id: placeStatus.value.id, isArchived: false })
  emit('done')
}

</script>

<style scoped lang="sass">
@import 'editbox'
</style>
