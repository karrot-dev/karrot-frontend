<template>
  <QCard class="no-shadow grey-border">
    <QCardSection class="q-pa-md">
      <div class="row no-wrap">
        <div class="content full-width">
          <div class="row no-wrap items-baseline q-gutter-sm">
            <template v-if="activityType">
              <QIcon
                :name="activityType.icon"
                :color="activityType.colorName"
                :title="activityType.name"
              />
              <span>{{ activityType.name }}</span>
            </template>
            <strong
              v-measure
              class="q-mr-sm"
              style="white-space: nowrap"
            >
              {{ $d(activityDate, 'longWithDayName') }}
            </strong>
            <RouterLink
              v-if="placeName && placeId"
              :to="{ name: 'placeFeedback', params: { placeId }}"
              class="ellipsis text-secondary"
            >
              {{ placeName }}
            </RouterLink>
            <RouterLink
              v-if="feedback.isEditable"
              class="edit-button"
              :to="{ name: 'editFeedback', params: { feedbackId: feedback.id }}"
            >
              <QIcon
                name="fas fa-pencil-alt"
                :title="$t('BUTTON.EDIT')"
              />
            </RouterLink>
          </div>
          <small class="text-weight-light">
            <RouterLink :to="{ name: 'user', params: { userId } }">
              {{ userName }}
            </RouterLink>
            <span
              class="message-date"
            >
              <DateAsWords :date="createdAt" />
            </span>
          </small>
          <div>
            <AmountBox
              v-if="hasWeight"
              class="on-right float-right amount-box"
              :size="80"
              :amount="weight"
            />
            <div
              v-if="comment"
              class="comment"
            >
              <Markdown :source="comment" />
            </div>
            <div class="q-mt-sm">
              <ProfilePicture
                :user="feedback.givenBy"
                :size="22"
              />
              <span v-if="membersWithoutGiver.length > 0">
                <ProfilePicture
                  v-for="member in membersWithoutGiver"
                  :key="member.id"
                  user="member"
                  :size="15"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </QCardSection>
  </QCard>
</template>

<script>
import {
  QCard,
  QCardSection,
  QIcon,
} from 'quasar'
import AmountBox from './AmountBox'
import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'
import Markdown from '@/utils/components/Markdown'

export default {
  components: {
    QCard,
    QCardSection,
    QIcon,
    AmountBox,
    ProfilePicture,
    DateAsWords,
    Markdown,
  },
  props: {
    feedback: { required: true, type: Object },
  },
  computed: {
    membersWithoutGiver () {
      const { activity: { participants = [] } = {} } = this.feedback
      return participants.filter((el) => {
        return el.id !== this.feedback.givenBy.id
      })
    },
    weight () {
      return this.feedback && this.feedback.weight
    },
    hasWeight () {
      return Number.isFinite(this.weight)
    },
    comment () {
      return this.feedback && this.feedback.comment
    },
    createdAt () {
      return this.feedback && this.feedback.createdAt
    },
    placeName () {
      const { about: { place: { name } = {} } = {} } = this.feedback
      return name
    },
    placeId () {
      const { about: { place: { id } = {} } = {} } = this.feedback
      return id
    },
    userName () {
      return (this.feedback && this.feedback.givenBy && this.feedback.givenBy.displayName) || '?'
    },
    userId () {
      return this.feedback && this.feedback.givenBy && this.feedback.givenBy.id
    },
    activityDate () {
      return this.feedback && this.feedback.about && this.feedback.about.date
    },
    activityType () {
      return this.feedback && this.feedback.about && this.feedback.about.activityType
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.comment
  padding-top 8px
  word-wrap break-word

  >>> p:last-child
    margin-bottom 5px

.message-date
  display inline-block

.edit-button
  opacity .7

.q-card:hover .edit-button
  opacity 1
</style>
