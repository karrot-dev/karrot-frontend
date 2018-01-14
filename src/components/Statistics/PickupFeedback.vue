<template>
  <div>
    <q-card class="no-shadow generic-padding grey-border">
      <div class="row no-wrap image-and-text">
        <div class="image-and-text-left gt-sm">
          <img
            style="width: 100%;"
            :src="cartImg"
          >
        </div>
        <div class="image-and-text-right">
          <h4>{{ $t(editFeedback ? 'PICKUP_FEEDBACK.EDIT' : 'PICKUP_FEEDBACK.HEADER') }}</h4>
          <p>
            <q-field v-if="!editFeedback">
              <q-select
                v-model="select"
                :options="feedbackOptions"
              />
            </q-field>
            <span v-else>
              {{ getDateWithStore(editFeedback.about) }}
            </span>
          </p>
        </div>
      </div>
      <FeedbackForm
        :value="feedback"
        :status="saveStatus"
        @save="$emit('save', arguments[0])"
      />
    </q-card>
    <q-card
      class="no-shadow grey-border store-feedback"
      v-if="select && feedbackForStore.length !== 0">
      <RandomArt
        class="randomBanner"
        :seed="select.store.id"
        type="banner"/>
      <h4
        class="generic-padding"
        v-t="{ path: 'PICKUP_FEEDBACK.PREVIOUS', args: { store: select.store.name } }"
      />
      <FeedbackList
        :feedback="feedbackForStore"
        :status="fetchStatus"
      />
    </q-card>
  </div>
</template>

<script>
import { QCard, QField, QInput, QBtn, QSelect } from 'quasar'
import AmountPicker from './AmountPicker'
import FeedbackList from './FeedbackList'
import cartImg from 'assets/people/cart.png'
import RandomArt from '@/components/General/RandomArt'
import FeedbackForm from './FeedbackForm'

export default {
  components: { RandomArt, QCard, QField, QInput, QBtn, QSelect, FeedbackForm, AmountPicker, FeedbackList },
  props: {
    pickups: { required: true, type: Array },
    editFeedback: { default: null, type: Object },
    existingFeedback: { required: true, type: Array },
    saveStatus: { required: true, type: Object },
    fetchStatus: { required: true, type: Object },
  },
  data () {
    return {
      cartImg,
      selectedPickup: null,
    }
  },
  methods: {
    getDateWithStore (pickup) {
      if (!pickup) return ''
      return `${this.$d(pickup.date, 'long')} (${pickup.store.name})`
    },
  },
  computed: {
    feedback () {
      if (this.editFeedback) return this.editFeedback
      return {
        about: this.select.id,
        weight: 1,
        comment: '',
      }
    },
    select: {
      get () {
        if (this.editFeedback) return this.editFeedback.about
        if (this.selectedPickup) return this.selectedPickup
        return this.pickups && this.pickups[0]
      },
      set (v) {
        this.selectedPickup = v
      },
    },
    feedbackOptions () {
      let list = this.pickups
      if (!list) return []
      return list.map((e) => {
        return {
          label: this.getDateWithStore(e),
          value: e,
        }
      })
    },
    feedbackForStore () {
      if (!this.select) return []
      let filtered = this.existingFeedback.filter(e => e.about && e.about.store.id === this.select.store.id)
      if (this.editFeedback) {
        filtered = filtered.filter(e => e.id !== this.editFeedback.id)
      }
      return filtered
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
.store-feedback
  margin-top 2.5em
  .randomBanner
    display: block
    height: 26px
    overflow: hidden
</style>
