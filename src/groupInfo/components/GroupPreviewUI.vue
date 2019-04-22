<template>
  <div v-if="group">
    <QCard class="shadow-6">
      <QCardMedia
        class="photo"
        :class="{ hasPhoto: group.hasPhoto }"
      >
        <img
          v-if="group.hasPhoto"
          :src="group.photoUrls.fullSize"
        >
        <RandomArt
          v-else
          :seed="group.id"
          type="circles"
          class="full-height"
        />
        <QCardTitle
          slot="overlay"
        >
          <span class="row group items-start">
            {{ group.name }}
            <QIcon
              v-if="group.isPlayground"
              name="fas fa-child"
            />
          </span>
          <span slot="subtitle">
            {{ group.members.length }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.members.length) }}
          </span>
        </QCardTitle>
      </QCardMedia>
      <QCardMain>
        <div
          v-if="group.publicDescription"
        >
          <Markdown :source="group.publicDescription" />
        </div>
        <span
          v-else
          class="text-italic"
        >
          {{ $t('JOINGROUP.NO_PUBLIC_DESCRIPTION') }}
        </span>
      </QCardMain>
      <QCardSeparator />
      <QCardActions>
        <div style="width: 100%">
          <template v-if="isLoggedIn">
            <template v-if="!group.isMember">
              <QAlert
                v-if="!application"
                color="info"
                icon="info"
              >
                {{ $t('JOINGROUP.PROFILE_NOTE' ) }}
              </QAlert>
              <QAlert
                v-if="application"
                color="blue"
                icon="info"
                :actions="[
                  { label: $t('BUTTON.OPEN'), icon: 'fas fa-fw fa-comments', handler: () => $emit('openChat', application) },
                  { label: $t('BUTTON.WITHDRAW'), icon: 'fas fa-fw fa-trash-alt', handler: withdraw }
                ]"
              >
                {{ $t('JOINGROUP.APPLICATION_PENDING' ) }}
              </QAlert>
              <QBtn
                v-if="group.isOpen"
                color="secondary"
                class="float-right generic-margin"
                :loading="isPending"
                @click="$emit('join', group.id)"
              >
                {{ $t('BUTTON.JOIN') }}
              </QBtn>

              <QBtn
                v-if="!group.isOpen && user && !user.mailVerified"
                color="secondary"
                class="float-right generic-margin"
                :loading="isPending"
                @click="$emit('goSettings')"
              >
                {{ $t('JOINGROUP.VERIFY_EMAIL_ADDRESS') }}
              </QBtn>
              <QBtn
                v-if="!group.isOpen && user && user.mailVerified && !application"
                color="secondary"
                class="float-right generic-margin"
                :loading="isPending"
                @click="$emit('goApply', group.id)"
              >
                {{ $t('BUTTON.APPLY') }}
              </QBtn>
            </template>
            <QBtn
              v-else
              class="q-btn-flat"
              @click="$emit('goVisit', group.id)"
            >
              <QIcon name="fas fa-home" />
              <QTooltip>
                {{ $t('GROUPINFO.MEMBER_VIEW') }}
              </QTooltip>
            </QBtn>
          </template>

          <QBtn
            v-else
            color="secondary"
            class="float-right generic-margin"
            :loading="isPending"
            @click="$emit('goSignup', group)"
          >
            {{ $t('JOINGROUP.SIGNUP_OR_LOGIN') }}
          </QBtn>
        </div>
      </QCardActions>
    </QCard>
  </div>
</template>

<script>
import {
  Dialog,
  QTooltip,
  QCard,
  QCardTitle,
  QCardMain,
  QCardSeparator,
  QCardActions,
  QCardMedia,
  QBtn,
  QIcon,
  QAlert,
} from 'quasar'
import Markdown from '@/utils/components/Markdown'
import statusMixin from '@/utils/mixins/statusMixin'
import RandomArt from '@/utils/components/RandomArt'

export default {
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions,
    QCardMedia,
    QBtn,
    QIcon,
    QTooltip,
    QAlert,
    Markdown,
    RandomArt,
  },
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
  computed: {
    status () {
      return this.group && this.group.joinStatus
    },
    ...statusMixin.computed,
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
.photo
  &.hasPhoto
    height 200px
  &:not(.hasPhoto)
    height 140px
  img
    max-height 100%
    max-width 100%
    width auto
    margin 0 auto
</style>
