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
        <div style="width: 100%">
          <template v-if="isLoggedIn">
            <template v-if="!group.isMember">
              <q-alert
                v-if="!application"
                color="info"
                icon="info"
              >
                {{ $t('JOINGROUP.PROFILE_NOTE' ) }}
              </q-alert>
              <q-alert
                v-if="application"
                color="blue"
                icon="info"
                :actions="[
                  { label: $t('BUTTON.OPEN'), icon: 'fas fa-fw fa-comments', handler: () => $emit('openChat', application) },
                  { label: $t('BUTTON.WITHDRAW'), icon: 'fas fa-fw fa-trash-alt', handler: withdraw }
                ]"
              >
                {{ $t('JOINGROUP.APPLICATION_PENDING' ) }}
              </q-alert>
              <q-btn
                v-if="group.isOpen"
                @click="$emit('join', group.id)"
                color="secondary"
                class="float-right generic-margin"
                :loading="group.joinStatus.pending"
              >
                {{ $t('BUTTON.JOIN') }}
              </q-btn>

              <q-btn
                v-if="!group.isOpen && user && !user.mailVerified"
                @click="$emit('goSettings')"
                color="secondary"
                class="float-right generic-margin"
                :loading="group.joinStatus.pending"
              >
                {{ $t('JOINGROUP.VERIFY_EMAIL_ADDRESS') }}
              </q-btn>
              <q-btn
                v-if="!group.isOpen && user && user.mailVerified && !application"
                @click="$emit('goApply', group.id)"
                color="secondary"
                class="float-right generic-margin"
                :loading="group.joinStatus.pending"
              >
                {{ $t('BUTTON.APPLY') }}
              </q-btn>

            </template>
            <q-btn
              v-else
              @click="$emit('goVisit', group.id)"
              class="q-btn-flat"
            >
              <q-icon name="fas fa-home" />
              <q-tooltip>
                {{ $t('GROUPINFO.MEMBER_VIEW') }}
              </q-tooltip>
            </q-btn>
          </template>

          <q-btn
            v-else
            @click="$emit('goSignup', group)"
            color="secondary"
            class="float-right generic-margin"
            :loading="group.joinStatus.pending"
          >
            {{ $t('JOINGROUP.SIGNUP_OR_LOGIN') }}
          </q-btn>
        </div>
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
    user: {
      default: null,
      type: Object,
    },
    application: {
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
        .then(() => this.$emit('withdraw', this.application.id))
        .catch(() => {})
    },
  },
}
</script>

<style scoped lang="stylus">
.q-card *
  overflow: hidden
</style>
