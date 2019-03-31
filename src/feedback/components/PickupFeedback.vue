<template>
  <div class="pickup-feedback-wrapper">
    <QCard
      v-if="pickups.length > 0 || editFeedbackId || fetchFeedbackPossibleStatus.pending"
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
              src="@/feedback/assets/cart.png"
            >
          </div>
          <div class="image-and-text-right">
            <h4>{{ $t(editFeedbackId ? 'PICKUP_FEEDBACK.EDIT' : 'PICKUP_FEEDBACK.HEADER') }}</h4>
            <p>
              <QField
                v-if="!editFeedbackId"
                dark
                class="grey-font"
              >
                <QSelect
                  v-model="select"
                  :options="feedbackOptions"
                />
              </QField>
              <span v-else-if="editFeedback">
                {{ getDateWithPlace(editFeedback.about) }}
              </span>
            </p>
          </div>
        </div>
      </RandomArt>
      <div class="generic-padding">
        <template v-if="fellowCollectors.length > 0">
          <p v-t="'PICKUP_FEEDBACK.TOGETHER_WITH'" />
          <p>
            <ProfilePicture
              v-for="user in fellowCollectors"
              :key="user.id"
              :user="user"
              :size="35"
              class="q-ml-xs"
            />
          </p>
        </template>
        <FeedbackForm
          style="padding: 1.5em 0"
          :value="feedbackDefault"
          :status="saveStatus"
          @save="$emit('save', arguments[0])"
        />
      </div>
    </QCard>
    <KNotice v-else>
      <template slot="icon">
        <i class="fas fa-bed" />
      </template>
      {{ $t('FEEDBACKLIST.NO_DONE_PICKUPS') }}
      <template slot="desc">
        {{ $t('FEEDBACKLIST.NO_DONE_PICKUPS_HINT') }}
      </template>
    </KNotice>
    <QCard
      v-if="select && feedbackForPlace.length !== 0"
      class="no-shadow grey-border place-feedback"
    >
      <RandomArt
        class="randomBanner"
        :seed="select.place.id"
        type="banner"
      />
      <h4
        v-t="{ path: 'PICKUP_FEEDBACK.PREVIOUS', args: { store: select.place.name } }"
        class="generic-padding"
      />
      <FeedbackList
        :feedback="feedbackForPlace"
        :status="fetchStatus"
      />
    </QCard>
  </div>
</template>

<script>
import {
  QCard,
  QField,
  QSelect,
} from 'quasar'
import FeedbackList from './FeedbackList'
import RandomArt from '@/utils/components/RandomArt'
import FeedbackForm from './FeedbackForm'
import KNotice from '@/utils/components/KNotice'
import ProfilePicture from '@/users/components/ProfilePicture'

export default {
  components: {
    RandomArt,
    ProfilePicture,
    QCard,
    QField,
    QSelect,
    FeedbackForm,
    FeedbackList,
    KNotice,
  },
  props: {
    pickups: { required: true, type: Array },
    editFeedbackId: { default: null, type: Number },
    editFeedback: { default: null, type: Object },
    existingFeedback: { required: true, type: Array },
    saveStatus: { required: true, type: Object },
    fetchStatus: { required: true, type: Object },
    fetchFeedbackPossibleStatus: { type: Object, default: () => ({}) },
    seedId: { default: 0, type: Number },
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
        if (!this.pickups) return

        const { pickupId } = this.$route.params
        if (typeof pickupId !== 'undefined') {
          const pickup = this.pickups.find(e => e.id === parseInt(pickupId))
          if (pickup) return pickup
        }

        // default to first pickup
        return this.pickups[0]
      },
      set (pickup) {
        this.$router.push({ params: { pickupId: pickup.id } })
      },
    },
    feedbackOptions () {
      let list = this.pickups
      if (!list) return []
      return list.map((e) => {
        return {
          label: this.getDateWithPlace(e),
          value: e,
        }
      })
    },
    feedbackForPlace () {
      if (!this.select) return []
      let filtered = this.existingFeedback.filter(e => e.about && e.about.place.id === this.select.place.id)
      if (this.editFeedbackId) {
        filtered = filtered.filter(e => e.id !== this.editFeedbackId)
      }
      return filtered
    },
    fellowCollectors () {
      if (!this.select) return []
      return this.select.collectors.filter(u => !u.isCurrentUser)
    },
  },
  methods: {
    getDateWithPlace (pickup) {
      if (!pickup) return ''
      const { name } = pickup.place || {}
      return `${this.$d(pickup.date, 'long')} (${name || ''})`
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
.place-feedback
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
