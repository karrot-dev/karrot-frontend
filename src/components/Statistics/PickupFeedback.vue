<template>
  <div class="wrapper">
    <div class="row justify-inbetween no-wrap image-and-text">
      <div class="image-and-text-left gt-sm">
        <img
          style="width: 100%;"
          :src="cartImg">
      </div>
      <div class="image-and-text-right">
        <h4>{{ $t('PICKUP_FEEDBACK.HEADER') }}</h4>
        <p v-if="select">{{ select.store.name + ', ' + this.$d(select.date, 'dateShort') }}
          <q-btn
            @click="select = false"
            flat>
            {{ this.$t("PICKUP_FEEDBACK.OTHER") }}
          </q-btn>
        </p>
      </div>
    </div>
    <div v-if="!singlePicked">
      <q-field
        style="margin-top: 2em; padding: 0 .5em"
        icon="fa-shopping-basket"
        :label="$t('PICKUP_FEEDBACK.SELECT_PICKUP')">
        <q-select
          v-model="select"
          :options="feedbackOptions"
          @change="selectChanged"
        />
      </q-field>
    </div>
    <div
      style="padding: 0 1.5em"
      v-if="singlePicked">
      <AmountPicker/>
      <q-field
        style="margin-top: 2em; padding: 0 .5em"
        icon="fa-star"
        :label="$t('PICKUP_FEEDBACK.COMMENT')"
      >
        <q-input
          v-model="comment"
          type="textarea"
          :placeholder="$t('PICKUP_FEEDBACK.COMMENT_PLACEHOLDER')"
          autocomplete="off"
          :min-rows="2"
        />
      </q-field>
      <div style="margin-top: 1.5em; padding-bottom: 1em">
        <q-btn
          type="submit"
          class="actionButton"
          color="primary"
        >
          {{ $t('BUTTON.CREATE') }}
        </q-btn>
        <div style="clear: both"/>
      </div>
    </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn, QSelect } from 'quasar'
import AmountPicker from './AmountPicker'
import cartImg from 'assets/people/cart.png'

export default {
  components: { QField, QInput, QBtn, QSelect, AmountPicker },
  data () {
    return {
      comment: '',
      cartImg,
      select: false,
    }
  },
  methods: {
    selectChanged () {
      console.log(this.select)
    },
  },
  computed: {
    singlePicked () {
      return this.select
    },
    feedbackOptions () {
      return this.donePickups.map((e) => {
        return {
          label: e.store.name + ', ' + this.$d(e.date, 'dateShort'),
          value: e,
        }
      })
    },
    donePickups () {
      return [
        { 'id': 237, 'date': new Date('2017-08-12T08:00:00Z'), 'store': { 'id': 1, 'name': 'Teststore1', 'description': 'all the good stuff', 'group': 1, 'address': 'Kranichstein, Darmstadt, Regierungsbezirk Darmstadt, Hesse, Germany', 'latitude': 49.8965397, 'longitude': 8.6847644, 'weeksInAdvance': 4, 'upcomingNotificationHours': 4 } },
        { 'id': 238, 'date': new Date('2017-08-19T08:00:00Z'), 'store': { 'id': 1, 'name': 'Teststore1', 'description': 'all the good stuff', 'group': 1, 'address': 'Kranichstein, Darmstadt, Regierungsbezirk Darmstadt, Hesse, Germany', 'latitude': 49.8965397, 'longitude': 8.6847644, 'weeksInAdvance': 4, 'upcomingNotificationHours': 4 } },
      ]
    },
  },
}
</script>

<style scoped lang="stylus">
.image-and-text
  margin-bottom 3.5em
  .image-and-text-left
    width 30%
    max-width 10em
    margin auto
    padding 1em
  .image-and-text-right
    width: 70%
    margin 0 auto
.actionButton
  float: right
</style>
