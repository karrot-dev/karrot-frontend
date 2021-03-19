<template>
  <div class="activity-feedback-wrapper">
    <QCard
      v-if="activities.length > 0 || editFeedbackId || fetchFeedbackPossibleStatus.pending"
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
              :src="cart"
            >
          </div>
          <div class="image-and-text-right">
            <h4>{{ $t(editFeedbackId ? 'ACTIVITY_FEEDBACK.EDIT' : 'ACTIVITY_FEEDBACK.HEADER') }}</h4>
            <p>
              <QSelect
                v-if="!editFeedbackId"
                v-model="select"
                :options="feedbackOptions"
                dark
                emit-value
                map-options
                class="grey-font"
              >
                <template #prepend>
                  <QIcon
                    v-if="select && select.activityType"
                    :name="select.activityType.icon"
                    :title="select.activityType.translatedName"
                  />
                </template>
                <template #option="{ index, opt: { value: activity }, itemProps, itemEvents }">
                  <QItem
                    :key="index"
                    v-bind="itemProps"
                    v-on="itemEvents"
                  >
                    <QItemSection avatar>
                      <QIcon v-bind="activity.activityType.iconProps" />
                    </QItemSection>
                    <QItemSection>{{ getDateWithPlace(activity) }}</QItemSection>
                  </QItem>
                </template>
              </QSelect>
              <span v-else-if="editFeedback">
                {{ getDateWithPlace(editFeedback.about) }}
              </span>
            </p>
          </div>
        </div>
      </RandomArt>
      <div>
        <div
          v-if="fellowParticipants.length > 0"
          class="q-mx-sm q-mt-md"
        >
          <div v-t="'ACTIVITY_FEEDBACK.TOGETHER_WITH'" />
          <div class="q-mt-sm">
            <ProfilePicture
              v-for="user in fellowParticipants"
              :key="user.id"
              :user="user"
              :size="35"
              class="q-ml-xs"
            />
          </div>
        </div>
        <FeedbackForm
          v-if="select && select.activityType"
          :value="feedbackDefault"
          :status="saveStatus"
          :has-multiple-participants="fellowParticipants.length > 0"
          :has-weight="select.activityType.hasFeedbackWeight"
          @save="$emit('save', arguments[0])"
          @dismissFeedback="$emit('dismissFeedback', arguments[0])"
        />
      </div>
    </QCard>
    <KNotice v-else>
      <template #icon>
        <QIcon class="fas fa-bed" />
      </template>
      {{ $t('FEEDBACKLIST.NO_DONE_ACTIVITIES') }}
      <template #desc>
        {{ $t('FEEDBACKLIST.NO_DONE_ACTIVITIES_HINT') }}
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
        v-t="{ path: 'ACTIVITY_FEEDBACK.PREVIOUS', args: { store: select.place.name } }"
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
  QIcon,
  QItem,
  QItemSection,
  QCard,
  QSelect,
} from 'quasar'
import FeedbackList from './FeedbackList'
import RandomArt from '@/utils/components/RandomArt'
import FeedbackForm from './FeedbackForm'
import KNotice from '@/utils/components/KNotice'
import ProfilePicture from '@/users/components/ProfilePicture'
import cart from '@/feedback/assets/cart.png'

export default {
  components: {
    RandomArt,
    ProfilePicture,
    QIcon,
    QItem,
    QItemSection,
    QCard,
    QSelect,
    FeedbackForm,
    FeedbackList,
    KNotice,
  },
  props: {
    activities: {
      required: true,
      type: Array,
    },
    editFeedbackId: {
      default: null,
      type: Number,
    },
    editFeedback: {
      default: null,
      type: Object,
    },
    existingFeedback: {
      required: true,
      type: Array,
    },
    saveStatus: {
      required: true,
      type: Object,
    },
    fetchStatus: {
      required: true,
      type: Object,
    },
    fetchFeedbackPossibleStatus: {
      type: Object,
      default: () => ({}),
    },
    seedId: {
      default: 0,
      type: Number,
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
        if (!this.activities) return

        const { params: { activityId } = {} } = this.$route || {}
        if (typeof activityId !== 'undefined') {
          const activity = this.activities.find(e => e.id === parseInt(activityId))
          if (activity) return activity
        }

        // default to first activity
        return this.activities[0]
      },
      set (activity) {
        this.$router.push({ params: { activityId: activity.id } }).catch(() => {})
      },
    },
    feedbackOptions () {
      const list = this.activities
      if (!list) return []
      return list.map((e) => {
        return {
          // TODO: remove printing of id
          // -> label: this.getDateWithPlace(e),
          label: e.id + ': ' + this.getDateWithPlace(e),
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
    fellowParticipants () {
      if (!this.select) return []
      return this.select.participants.filter(u => !u.isCurrentUser)
    },
  },
  created () {
    this.cart = cart
  },
  methods: {
    getDateWithPlace (activity) {
      if (!activity) return ''
      const { name } = activity.place || {}
      return `${this.$d(activity.date, 'long')} (${name || ''})`
    },
  },
}
</script>

<style scoped lang="stylus">
.image-and-text
  padding-top 1.5em
  padding-bottom 1.5em

  .image-and-text-left
    width 30%
    max-width 10em
    padding 1em
    margin auto

  .image-and-text-right
    width 100%
    padding 0 1em
    margin 0 auto

.place-feedback
  margin-top 2.5em !important

  .randomBanner
    display block
    height 26px
    overflow hidden
</style>

<style lang="stylus">
.activity-feedback-wrapper .q-field-dark.grey-font
  padding 4px 7px
  background-color white
  border-radius 4px

  .q-input-target, .q-input-shadow, .q-if-control
    color rgb(40, 40, 40)
</style>
