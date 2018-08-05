<template>
  <div v-if="group">
    <q-card class="shadow-6">
      <q-card-title
        :class="group.isPlayground ? 'text-secondary' : ''"
      >
        <span class="row group items-start">
          {{ group.name }}
          <q-icon
            v-if="group.isPlayground"
            name="fas fa-child"
            color="secondary"
          />
        </span>
        <span slot="subtitle">
          {{ group.members.length }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.members.length) }}
        </span>
        <q-btn
          v-if="showClose"
          slot="right"
          round
          small
          @click="$emit('close')"
          color="primary"
          class="preview-close-button"
        >
          <q-icon name="fas fa-times" />
          <q-tooltip>
            {{ $t('BUTTON.CLOSE') }}
          </q-tooltip>
        </q-btn>
      </q-card-title>
      <q-card-main>
        <div
          v-if="group.publicDescription"
          class="quote"
        >
          <Markdown :source="group.publicDescription" />
        </div>
        <span
          v-else
          class="text-italic"
        >
          {{ $t('JOINGROUP.NO_PUBLIC_DESCRIPTION') }}
        </span>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <span
          v-if="!group.isMember && !group.hasMyApplication"
          style="width: 100%">
          <q-alert
            v-if="!group.isMember"
            color="warning"
            icon="info"
          >
            {{ $t('JOINGROUP.PROFILE_NOTE' ) }}
          </q-alert>
          <q-btn
            v-if="!isLoggedIn || !user.mailVerified"
            @click="$emit('preApply', { groupId: group.id })"
            color="secondary"
            class="float-right generic-margin"
            :loading="group.joinStatus.pending"
          >
            {{ $t( isLoggedIn ? 'JOINGROUP.VERIFY_EMAIL_ADDRESS' : 'JOINGROUP.SIGNUP_OR_LOGIN') }}
          </q-btn>
          <q-btn
            v-if="isLoggedIn && user.mailVerified"
            @click="$emit('apply', { groupId: group.id })"
            color="secondary"
            class="float-right generic-margin"
            :loading="group.joinStatus.pending"
          >
            {{ $t( !group.isPlayground ? 'BUTTON.APPLY' : 'BUTTON.JOIN') }}
          </q-btn>
        </span>
        <span
          v-if="group.hasMyApplication"
          style="width: 100%"
        >
          <q-alert
            color="blue"
            icon="info"
            :actions="[
              // { label: 'Group chat', icon: 'fas fa-comments', handler: () => {joinChat()} },
              { label: $t('JOINGROUP.WITHDRAW_APPLICATION'), icon: 'fas fa-trash-alt', handler: () => {withdraw()} }
            ]"
          >
            {{ $t('JOINGROUP.APPLICATION_PENDING' ) }}

          </q-alert>

        </span>
        <q-btn
          v-if="group.isMember"
          @click="$emit('visit', group.id)"
          class="q-btn-flat"
        >
          <q-icon name="fas fa-home" />
          <q-tooltip>
            {{ $t('GROUPINFO.MEMBER_VIEW') }}
          </q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { Dialog, QTooltip, QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QField, QInput, QIcon, QAlert } from 'quasar'
import Markdown from '@/components/Markdown'

export default {
  props: {
    group: {
      default: null,
      type: Object,
    },
    isLoggedIn: {
      default: false,
      type: Boolean,
    },
    showClose: {
      default: false,
      type: Boolean,
    },
    user: {
      default: null,
      type: Object,
    },
  },
  components: { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QField, QInput, QIcon, QTooltip, QAlert, Markdown },
  computed: {
    joinStatus () {
      return this.group && this.group.joinStatus
    },
    hasAnyError () {
      return this.joinStatus && this.joinStatus.hasValidationErrors
    },
    anyFirstError () {
      return this.joinStatus && this.joinStatus.firstValidationError
    },
  },
  methods: {
    withdraw () {
      Dialog.create({
        title: this.$t('JOINGROUP.WITHDRAW_CONFIRMATION_HEADER'),
        message: this.$t('JOINGROUP.WITHDRAW_CONFIRMATION_TEXT', { groupName: this.group.name }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('withdraw', this.group.myApplication.id))
        .catch(() => {})
    },
    joinChat () {
    },
  },
}
</script>

<style scoped lang="stylus">
.q-card *
  overflow: hidden
</style>
