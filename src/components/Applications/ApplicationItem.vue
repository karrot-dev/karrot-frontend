<template>
  <q-item
    highlight
    separator
    :class="{ isPending: application.isPending, isNonPending: !application.isPending }"
  >
    <q-item-side>
      <ProfilePicture
        :user="application.user"
        :size="80"
        class="applicants-picture"
      />
    </q-item-side>
    <q-item-main
      :label="'#' + application.id + ' from ' + userName + ' who is going by ID ' + application.user.id"
      :sublabel="'submitted on ' + $d(application.createdAt, 'long')"
    >
      {{ application.status }}
    </q-item-main>
    <q-item-side
      right
    >
      <q-btn
        round
        disable
        color="tertiary"
        icon="fas fa-comments"
        class="generic-margin"
        @click="openChat"
      />
      <q-btn
        v-if="application.status === 'pending'"
        round
        color="positive"
        icon="fas fa-check"
        class="generic-margin"
        @click="pressAccept"
      />
      <q-btn
        v-if="application.status === 'pending'"
        round
        color="negative"
        icon="fas fa-times"
        class="generic-margin"
        @click="decline"
      />
    </q-item-side>
  </q-item>
</template>

<script>
import { Dialog, QItem, QBtn, QItemMain, QItemSide } from 'quasar'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

export default {
  components: {
    QItem, QBtn, QItemMain, QItemSide, ProfilePicture,
  },
  props: {
    application: {
      required: true,
      type: Object,
    },
  },
  methods: {
    openChat () {
      return console.log('This will lead to the ApplicationChat soon!')
    },
    pressAccept () {
      Dialog.create({
        title: this.$t('APPLICATION.ACCEPT_CONFIRMATION_HEADER'),
        message: this.$t('APPLICATION.ACCEPT_CONFIRMATION_TEXT', { userName: this.userName }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('accept', this.application.id))
        .catch(() => {})
    },
    decline () {
      Dialog.create({
        title: this.$t('APPLICATION.DECLINE_CONFIRMATION_HEADER'),
        message: this.$t('APPLICATION.DECLINE_CONFIRMATION_TEXT', { userName: this.userName }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('decline', this.application.id))
        .catch(() => {})
    },
  },
  computed: {
    userName () {
      return this.application.user.displayName
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.applicants-picture
  vertical-align: text-bottom
  margin-left: -0.5 rem
.isNonPending
  opacity 0.5
</style>
