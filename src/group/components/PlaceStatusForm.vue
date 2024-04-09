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
        :label="$t('LABELS.NAME')"
        :error="Boolean(errors.name)"
        :error-message="errors.name"
        :options="translatableNameOptions"
        filled
        autofocus
        @blur="v.name.$touch"
      />

      <QInput
        v-model="edit.description"
        :label="$t('LABELS.DESCRIPTION')"
        :error="Boolean(errors.description)"
        :error-message="errors.description"
        filled
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
        :hint="$t('PLACE_STATUSES.VISIBLE_HINT')"
      >
        <template #control>
          <QToggle
            v-model="edit.isVisible"
            :label="$t('LABELS.VISIBLE')"
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
          @click="emit('cancel')"
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
import { usePlaceStatuses, usePlaceStatusTranslatedName, usePlacesWithStatus } from '@/places/helpers'
import { useCreatePlaceStatusMutation, useSavePlaceStatusMutation } from '@/places/mutations'
import { useConfirmChanges, useForm } from '@/utils/forms'
import { isUnique, required } from '@/utils/validation'

import SetPlacesToStatus from '@/group/components/SetPlacesToStatus.vue'
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
  'ok',
  'cancel',
])

const confirmChanges = useConfirmChanges()

const placeStatus = toRef(props, 'placeStatus')

const translatedName = usePlaceStatusTranslatedName(placeStatus)

const places = usePlacesWithStatus(placeStatus)

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
  confirm: true,
  onSuccess () {
    emit('ok')
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

  const confirmChangesOptions = {}

  if (places.value.length > 0) {
    // If we have some places with this status, prompt the user to set a status to
    // set them to after saving...
    const otherStatuses = placeStatuses.value.filter(status => {
      return !status.isArchived && status.id !== placeStatus.value.id
    })
    Object.assign(confirmChangesOptions, {
      extraComponent: SetPlacesToStatus,
      extraComponentProps: {
        currentPlaceStatus: placeStatus.value,
        placeStatuses: otherStatuses,
      },
    })
  }

  const { ok, ...data } = await confirmChanges(confirmChangesOptions)
  if (!ok) return
  await update({ id: placeStatus.value.id, isArchived: true, ...data })
  emit('ok')
}

async function restore () {
  if (isNew.value) return
  const { ok, updatedMessage } = await confirmChanges()
  if (!ok) return
  await update({ id: placeStatus.value.id, isArchived: false, updatedMessage })
  emit('ok')
}

</script>

<style scoped lang="sass">
@import 'editbox'
</style>
