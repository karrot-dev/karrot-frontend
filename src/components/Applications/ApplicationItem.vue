<template>
  <q-list class="no-shadow grey-border">
    <div class="row no-wrap">
      <ProfilePicture
        :key="application.user"
        :user="application.applicant"
        :size="80"
        style="margin: 0.1rem 0.5rem"
      />
      <div class="content">
        <q-item
          multiline
          class="generic-padding"
        >
          <q-item-tile :label="userName">
            {{ userName + ' applied to join our group!' }}
          </q-item-tile>
          <q-item-tile :label="userName">
            {{ 'It has id #' + application.id }}
          </q-item-tile>
          <q-item-side float-right>
            <q-btn
              round
              color="positive"
              icon="fas fa-check"
              class="float-right generic-margin"
            />
            <q-btn
              round
              color="negative"
              icon="fas fa-times"
              class="float-right generic-margin"
            />
          </q-item-side>
        </q-item>
      </div>
    </div>
  </q-list>
</template>

<script>
import { QList, QItem, QBtn, QItemSide, QItemTile } from 'quasar'
// import DateAsWords from '@/components/General/DateAsWords' --> needs created-at prop in application object
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

export default {
  components: {
    QList, QItem, QBtn, QItemSide, QItemTile, ProfilePicture,
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
