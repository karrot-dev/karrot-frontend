<template>
  <q-item highlight>
    <q-item-side>
      <ProfilePicture
        :user="application.applicant"
        :size="80"
        class="applicants-picture"
      />
    </q-item-side>
    <q-item-main
      :label="userName + ' who is going by ID ' + application.user"
      :sublabel="application.answers" />
    <q-item-side
      right
    >
      <q-btn
        round
        color="tertiary"
        icon="fas fa-comments"
        class="generic-margin"
        @click="openChat"
      />
      <q-btn
        round
        color="positive"
        icon="fas fa-check"
        class="generic-margin"
        @click="pressAccept"
      />
      <q-btn
        round
        color="negative"
        icon="fas fa-times"
        class="generic-margin"
        @click="test"
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
    test () {
      return console.log('I am a working button!')
    },
    openChat () {
      return console.log('This will lead to the ApplicationChat soon!')
    },
    pressAccept () {
      console.log('I will run this method! ' + this.application.id)
      Dialog.create({
        title: this.$t('JOINGROUP.ACCEPT_CONFIRMATION_HEADER'),
        message: this.$t('JOINGROUP.ACCEPT_CONFIRMATION_TEXT', { userName: this.application.applicant.displayName }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('accept', this.application.id))
        .catch(() => {})
    },
  },
  computed: {
    userName () {
      return this.application && this.application.applicant && this.application.applicant.displayName
    },
  },
}
</script>

<style scoped lang="stylus">
.applicants-picture
  vertical-align: text-bottom
  margin-left: -0.5 rem
</style>
