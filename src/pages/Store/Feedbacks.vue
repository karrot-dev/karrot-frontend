<template>
  <div>
    <q-card class="no-shadow no-padding grey-border">
      <div class="generic-padding">
        <div class="actionButtons">
          <router-link :to="{name: 'pickupFeedback'}">
            <q-btn
              small
              round
              color="secondary"
              icon="fa-plus"
              class="hoverScale"
            >
              <q-tooltip v-t="'FEEDBACKLIST.GIVE_FEEDBACK'" />
            </q-btn>
          </router-link>
        </div>
        <span v-if="feedback && feedback.length != 0">{{ $tc('FEEDBACKLIST.SAVED_FOOD', totalAmount, { amount: totalAmount }) }}</span>
      </div>
    </q-card>
    <FeedbackList
      :feedback="feedback"
      :status="fetchStatus"
    />
  </div>
</template>

<script>
import FeedbackList from '@/components/Statistics/FeedbackList'
import { QCard, QTooltip, QBtn } from 'quasar'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { FeedbackList, QCard, QTooltip, QBtn },
  computed: {
    ...mapGetters({
      feedback: 'feedback/filtered',
      fetchStatus: 'feedback/fetchStatus',
    }),
    totalAmount () {
      let amount = 0
      for (let fb in this.feedback) {
        console.log(this.feedback[fb])
        amount += this.feedback[fb].weight
      }
      return amount
    },
  },
}
</script>

<style scoped lang="stylus">
.q-btn-round
  margin-bottom .5em
.actionButtons
  margin-top -36px
  float right
  .q-btn
    margin 3px
.textcontent
  margin-top 0
</style>
