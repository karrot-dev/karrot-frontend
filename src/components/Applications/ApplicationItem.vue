<template>
  <q-card class="no-shadow grey-border">
    <div class="row no-wrap">
      <ProfilePicture
        :key="application.user"
        :user="application.user"
        :size="80"
      />
      <div class="content">
        <q-card-main class="generic-padding">
          <div class="row no-wrap">
            {{ 'This is application #' + application.id + ' from user ' + userName }}
          </div>
        </q-card-main>
      </div>
    </div>
  </q-card>
</template>

<script>
import { QCard, QCardMain } from 'quasar'
// import DateAsWords from '@/components/General/DateAsWords' --> needs created-at prop in application object
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

export default {
  components: {
    QCard, QCardMain, ProfilePicture,
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
