<template>
  <QDialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <QCard class="q-dialog-plugin">
      <form @submit.prevent.stop="submit">
        <QCardSection class="q-dialog__title">
          {{ $t('HISTORY.CONFIRM_CHANGES') }}
        </QCardSection>
        <QCardSection class="q-dialog__message">
          {{ $t('HISTORY.CONFIRM_CHANGES_HINT') }}
          <span
            v-if="!willRemoveUsers"
          >
            ({{ $t('VALIDATION.OPTIONAL') }})
          </span>
        </QCardSection>
        <QCardSection
          v-if="willRemoveUsers"
          class="q-dialog__message"
        >
          <QBanner class="bg-orange-2">
            <i18n-t
              scope="global"
              keypath="ACTIVITYMANAGE.CHANGE_AFFECTS_USERS"
            >
              <template #users>
                <span
                  v-for="(user, idx) in users"
                  :key="user.id"
                >
                  <strong>{{ user.displayName }}</strong>
                  <span v-if="idx < users.length - 2">, </span>
                  <span v-else-if="idx < users.length - 1">&nbsp;{{ $t('CONVERSATION.REACTIONS.AND') }}&nbsp;</span>
                </span>
              </template>
            </i18n-t>
            <br><br>
            {{ $t('ACTIVITYMANAGE.CHANGE_AFFECTS_USERS_HINT') }}
          </QBanner>
        </QCardSection>
        <QCardSection class="q-dialog__message">
          <QInput
            ref="updatedMessageRef"
            v-model="updatedMessage"
            autogrow
            filled
            autofocus
            :placeholder="$t('WALL.WRITE_MESSAGE')"
            :rules="[val => !willRemoveUsers || Boolean(val) || $t('VALIDATION.REQUIRED')]"
          />
        </QCardSection>
        <QCardSection align="right">
          <QBtn
            flat
            color="primary"
            :label="$t('BUTTON.CANCEL')"
            @click="onDialogCancel"
          />
          <QBtn
            flat
            color="primary"
            type="submit"
            :label="$t('BUTTON.SAVE_CHANGES')"
          />
        </QCardSection>
      </form>
    </QCard>
  </QDialog>
</template>

<script setup>
import {
  useDialogPluginComponent,
  QCard,
  QInput,
  QCardSection,
  QBtn,
  QDialog,
  QBanner,
} from 'quasar'
import { computed, ref } from 'vue'

import { useUserService } from '@/users/services'

const updatedMessageRef = ref(null)
const updatedMessage = ref('')

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
})

defineEmits(useDialogPluginComponent.emits)

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent()

function submit () {
  updatedMessageRef.value.validate()
  if (updatedMessageRef.value.hasError) return
  onDialogOK({ updatedMessage: updatedMessage.value })
}

const { getUserById } = useUserService()

const willRemoveUsers = computed(() => props.users.length > 0)
const users = computed(() => props.users.map(userId => getUserById(userId)))
</script>
