<template>
  <QDialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <QCard class="q-dialog-plugin">
      <form @submit.prevent="onDialogOK({ updatedMessage })">
        <QCardSection class="q-dialog__title">
          {{ $t('HISTORY.CONFIRM_CHANGES') }}
        </QCardSection>
        <QCardSection class="q-dialog__message">
          {{ $t('HISTORY.CONFIRM_CHANGES_HINT') }}
        </QCardSection>
        <QCardSection
          v-if="participants.length > 0"
          class="q-dialog__message"
        >
          <QBanner class="bg-orange-2">
            <i18n-t keypath="ACTIVITYMANAGE.CHANGE_AFFECTS_USERS">
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
            v-model="updatedMessage"
            autogrow
            outlined
            autofocus
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
            @click="onDialogOK({ updatedMessage })"
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

const updatedMessage = ref('')

const props = defineProps({
  participants: {
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

const { getUserById } = useUserService()

const users = computed(() => props.participants.map(participant => getUserById(participant.user)))
</script>
