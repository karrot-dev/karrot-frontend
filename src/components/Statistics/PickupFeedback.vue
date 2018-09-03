<template>
  <div class="pickup-feedback-wrapper">
    <q-card
      v-if="pickups.length > 0 || editFeedback"
      class="no-mobile-margin no-shadow grey-border"
    >
      <RandomArt
        :seed="seedId"
        style="color: white"
        type="circles"
      >
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
              <q-field
                v-if="!editFeedback"
                dark
                class="grey-font">
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
      </RandomArt>
      <div class="generic-padding">
        <p v-t="'PICKUP_FEEDBACK.TOGETHER_WITH'" />
        <p>
          <ProfilePicture
            v-for="user in fellowCollectors"
            :user="user"
            :key="user.id"
            :size="35"
            class="q-ml-xs"
          />
        </p>
        <FeedbackForm
          style="padding: 1.5em 0"
          :value="feedbackDefault"
          :status="saveStatus"
          @save="$emit('save', arguments[0])"
        />
      </div>
    </q-card>
    <KNotice v-else>
      <template slot="icon">
        <i class="fas fa-bed"/>
      </template>
      {{ $t('FEEDBACKLIST.NO_DONE_PICKUPS') }}
      <template slot="desc">
        {{ $t('FEEDBACKLIST.NO_DONE_PICKUPS_HINT') }}
      </template>
    </KNotice>
    <q-card
      class="no-shadow grey-border store-feedback"
      v-if="select && feedbackForStore.length !== 0"
    >
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
import { QCard, QCardMain, QField, QInput, QBtn, QSelect } from 'quasar'
import AmountPicker from './AmountPicker'
import FeedbackList from './FeedbackList'
import cartImg from 'assets/people/cart.png'
import RandomArt from '@/components/General/RandomArt'
import FeedbackForm from './FeedbackForm'
import KNotice from '@/components/General/KNotice'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

export default {
  components: { RandomArt, ProfilePicture, QCard, QCardMain, QField, QInput, QBtn, QSelect, FeedbackForm, AmountPicker, FeedbackList, KNotice },
  props: {
    pickups: { required: true, type: Array },
    editFeedback: { default: null, type: Object },
    existingFeedback: { required: true, type: Array },
    saveStatus: { required: true, type: Object },
    fetchStatus: { required: true, type: Object },
    seedId: { required: true, type: Number },
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
    feedbackDefault () {
      if (this.editFeedback) return this.editFeedback
      return {
        about: this.select ? this.select.id : undefined,
        weight: null,
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
    fellowCollectors () {
      return this.select.collectors.filter(u => !u.isCurrentUser)
    },
  },
}
</script>

<style scoped lang="stylus">
.image-and-text
  padding-bottom 1.5em
  padding-top 1.5em
  .image-and-text-left
    width 30%
    max-width 10em
    margin auto
    padding 1em
  .image-and-text-right
    width: 100%
    padding 0 1em
    margin 0 auto
.store-feedback
  margin-top 2.5em !important
  .randomBanner
    display: block
    height: 26px
    overflow: hidden
</style>

<style lang="stylus">
.pickup-feedback-wrapper .q-field-dark.grey-font
  background-color white
  padding 4px 7px
  border-radius 4px
  .q-input-target, .q-input-shadow, .q-if-control
    color rgb(40, 40, 40)
</style>
