<template>
  <q-item class="grey-border">
    <q-item-side>
      <ProfilePicture
        :user="application.applicant"
        :size="80"
      />
    </q-item-side>
    <q-item-main :label="userName + ' applied to join our group!'" />
    <q-item-side
      right
    >
      <q-btn
        round
        color="positive"
        icon="fas fa-check"
        class="generic-margin"
        @click="$emit('forwardAccept')"
      />
      <q-btn
        round
        color="negative"
        icon="fas fa-times"
        class="generic-margin"
        @click="$emit('test')"
      />
    </q-item-side>
  </q-item>
</template>

<script>
import { QItem, QBtn, QItemMain, QItemSide } from 'quasar'
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
  computed: {
    userName () {
      return this.application && this.application.user && this.application.applicant.displayName
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
