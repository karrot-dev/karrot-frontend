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
      :label="userName + ' who is going by ID ' + application.user.id"
      :sublabel="application.status" />
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
// import DateAsWords from '@/components/General/DateAsWords' --> needs created-at prop in application object
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
        .then(() => this.$emit('accept', this.application.id, { userName: this.userName }))
        .catch(() => {})
    },
    decline () {
      Dialog.create({
        title: this.$t('APPLICATION.DECLINE_CONFIRMATION_HEADER'),
        message: this.$t('APPLICATION.DECLINE_CONFIRMATION_TEXT', { userName: this.userName }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('decline', this.application.id, { userName: this.userName }))
        .catch(() => {})
    },
  },
  computed: {
    userName () {
      return this.application && this.application.user && this.application.user.displayName
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
  background repeating-linear-gradient(
    135deg,
    white,
    white 15px,
    $lightBlue 15px,
    $lightBlue 30px
  )
.isPending
  background: $lightBlue
</style>
