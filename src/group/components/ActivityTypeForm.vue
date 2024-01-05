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
        {{ $t('ACTIVITY_TYPES.ADD') }}
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
        @blur="v.name.$touch"
      />

      <QInput
        v-model="edit.description"
        label="Description"
        :error="Boolean(errors.description)"
        :error-message="errors.description"
        outlined
      />

      <QField borderless>
        <template #before>
          <QIcon
            :name="edit.icon"
            size="lg"
            :color="colourName"
          />
        </template>
        <template #control>
          <IconPicker
            v-model="edit.icon"
            :color="colourName"
          />
          <ColourPicker v-model="edit.colour" />
        </template>
      </QField>

      <QField
        borderless
        hide-bottom-space
        :hint="edit.hasFeedback ? t('ACTIVITY_TYPES.FEEDBACK_YES_HINT') : t('ACTIVITY_TYPES.FEEDBACK_NO_HINT')"
      >
        <QToggle
          v-model="edit.hasFeedback"
          :label="t('ACTIVITY_TYPES.FEEDBACK')"
        />
        <QToggle
          v-if="edit.hasFeedback"
          v-model="edit.hasFeedbackWeight"
          :label="t('ACTIVITY_TYPES.FEEDBACK_WEIGHT_LABEL')"
          class="q-ml-lg"
        />
      </QField>

      <template v-if="edit.hasFeedback">
        <QField borderless>
          <template #before>
            <QIcon
              :name="edit.feedbackIcon"
              size="lg"
              :color="colourName"
            />
          </template>
          <template #control>
            <IconPicker
              v-model="edit.feedbackIcon"
              :color="edit.colour"
            />
          </template>
        </QField>
      </template>

      <div class="row justify-end q-gutter-sm q-mt-sm">
        <QBtn
          type="button"
          @click="emit('cancel')"
        >
          {{ t('BUTTON.CANCEL') }}
        </QBtn>

        <QBtn
          v-if="!isNew && !activityType.isArchived"
          type="button"
          color="red"
          @click="archive"
        >
          {{ t('BUTTON.ARCHIVE') }}
        </QBtn>

        <QBtn
          v-if="!isNew && activityType.isArchived"
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
import { QBtn, QField, QIcon, QInput, QToggle } from 'quasar'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActivityTypes, useActivityTypeTranslatedName } from '@/activities/helpers'
import { useCreateActivityTypeMutation, useSaveActivityTypeMutation } from '@/activities/mutations'
import { useColourNameFor } from '@/activities/stylesheet'
import { useCurrentGroupId } from '@/group/helpers'
import { useConfirmChanges, useForm } from '@/utils/forms'
import { isUnique, required } from '@/utils/validation'

import ColourPicker from '@/utils/components/ColourPicker.vue'
import IconPicker from '@/utils/components/IconPicker.vue'
import TranslatableNameInput from '@/utils/components/TranslatableNameInput.vue'

const { t } = useI18n()

const props = defineProps({
  activityType: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'ok',
  'cancel',
])

const activityType = toRef(props, 'activityType')

const translatedName = useActivityTypeTranslatedName(activityType)

const groupId = useCurrentGroupId()
const activityTypes = useActivityTypes(groupId)
const { mutateAsync: create, status: createStatus } = useCreateActivityTypeMutation({ groupId })
const { mutateAsync: update, status: updateStatus } = useSaveActivityTypeMutation()

const confirmChanges = useConfirmChanges()

const namesInUse = computed(() => {
  return activityTypes.value
    .filter(entry => entry.id && entry.id !== activityType.value.id)
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
} = useForm(activityType, {
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

const colourName = useColourNameFor(edit)

const translatableNameOptions = computed(() => [
  // alphabetical
  'Activity',
  'Distribution',
  'Event',
  'Meeting',
  'Pickup',
  'Task',
].map(name => ({
  name,
  label: t(`ACTIVITY_TYPE_NAMES.${name}`),
  disable: namesInUse.value.includes(name),
})))

async function archive () {
  if (isNew.value) return
  const { ok, updatedMessage } = await confirmChanges()
  if (!ok) return
  await update({ id: activityType.value.id, isArchived: true, updatedMessage })
  emit('ok')
}

async function restore () {
  if (isNew.value) return
  const { ok, updatedMessage } = await confirmChanges()
  if (!ok) return
  await update({ id: activityType.value.id, isArchived: false, updatedMessage })
  emit('ok')
}

</script>

<style scoped lang="sass">
@import 'editbox'
</style>
