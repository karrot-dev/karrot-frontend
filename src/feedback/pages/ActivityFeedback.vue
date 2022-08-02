<template>
  <div class="activity-feedback-wrapper">
    <QCard
      v-if="activities.length > 0 || editFeedbackId || isLoadingActivities"
      class="no-mobile-margin no-shadow grey-border"
    >
      <RandomArt
        :seed="groupId"
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
            <h4>{{ $t(isEditing ? 'ACTIVITY_FEEDBACK.EDIT' : 'ACTIVITY_FEEDBACK.HEADER') }}</h4>
            <p>
              <QSelect
                v-if="!isEditing"
                v-model="activity"
                :options="feedbackOptions"
                dark
                emit-value
                map-options
                class="grey-font"
              >
                <template #prepend>
                  <QIcon
                    v-if="activity && activity.activityType"
                    v-bind="activity.activityType.iconProps"
                  />
                </template>
                <template #option="{ index, opt: { value: activity }, itemProps }">
                  <QItem
                    :key="index"
                    v-bind="itemProps"
                  >
                    <QItemSection avatar>
                      <QIcon
                        v-if="activity && activity.activityType"
                        v-bind="activity.activityType.iconProps"
                      />
                    </QItemSection>
                    <QItemSection>{{ getDateWithPlace(activity) }}</QItemSection>
                  </QItem>
                </template>
              </QSelect>
              <span v-else-if="editFeedback">
                {{ getDateWithPlace(activity) }}
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
          v-if="activity && activity.activityType"
          :value="feedbackDefault"
          :status="saveStatus"
          :has-multiple-participants="fellowParticipants.length > 0"
          :has-weight="activity.activityType.hasFeedbackWeight"
          @save="feedback => save(feedback)"
          @dimiss="activityId => dismiss(activityId)"
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
      v-if="activity && feedback.length !== 0"
      class="no-shadow grey-border place-feedback"
    >
      <RandomArt
        class="randomBanner"
        :seed="activity.place.id"
        type="banner"
      />
      <h4
        v-t="{ path: 'ACTIVITY_FEEDBACK.PREVIOUS', args: { store: activity.place.name } }"
        class="generic-padding"
      />
      <FeedbackList
        :feedback="feedback"
        :pending="isLoadingActivities || isLoadingFeedback"
      />
    </QCard>
  </div>
</template>

<script setup>
import { computed, watchEffect, unref } from 'vue'
import { useRouter } from 'vue-router'

import {
  QIcon,
  QItem,
  QItemSection,
  QCard,
  QSelect,
} from 'quasar'

import FeedbackList from '../components/FeedbackList'
import RandomArt from '@/utils/components/RandomArt'
import FeedbackForm from '../components/FeedbackForm'
import KNotice from '@/utils/components/KNotice'
import ProfilePicture from '@/users/components/ProfilePicture'
import cart from '@/feedback/assets/cart.png'

import { useActivityListQuery, useActivityItemQuery } from '@/activities/queries'
import { useCurrentGroupService } from '@/group/services'
import { useActivityEnricher } from '@/activities/enrichers'
import { useIntegerRouteParam } from '@/utils/composables'
import { useFeedbackListQuery, useFeedbackItemQuery } from '@/feedback/queries'
import { useI18n } from 'vue-i18n'
import { useUserEnricher } from '@/users/enrichers'
import { useFeedbackSaveMutation } from '@/feedback/mutations'
import { useDismissFeedbackMutation } from '@/activities/mutations'
import { useFeedbackEnricher } from '@/feedback/enrichers'

const router = useRouter()
const { d } = useI18n()

const enrichActivity = useActivityEnricher()
const enrichUser = useUserEnricher()
const enrichFeedback = useFeedbackEnricher()

const { groupId } = useCurrentGroupService()

const activityIdRouteParam = useIntegerRouteParam('activityId')
const editFeedbackId = useIntegerRouteParam('feedbackId')
const isEditing = computed(() => !!editFeedbackId.value)

const {
  feedbackItem: editFeedback,
} = useFeedbackItemQuery({ feedbackId: editFeedbackId })

const feedbackDefault = computed(() => {
  if (editFeedback.value) return editFeedback.value
  return {
    about: activityId.value,
    weight: null,
    comment: '',
  }
})

// Our activity id either comes from the feedback we are editing, or the route parameter
const activityId = computed(() => {
  if (isEditing.value) {
    return editFeedback.value?.about
  }
  return activityIdRouteParam.value
})

const {
  activities: activitiesRaw,
  isLoading: isLoadingActivities,
} = useActivityListQuery({
  groupId,
  feedbackPossible: true,
})

const activities = computed(() => activitiesRaw.value.map(enrichActivity))

const {
  activity: activityRaw,
} = useActivityItemQuery({ activityId })

const activity = computed({
  get () {
    return enrichActivity(activityRaw.value)
  },
  set (val) {
    router.push({ params: { activityId: val.id } })
  },
})

const fellowParticipants = computed(() => activity.value.participants.map(enrichUser).filter(u => !u.isCurrentUser))

const placeId = computed(() => activityRaw.value?.place)

const {
  feedbackList: feedbackListRaw,
  isLoading: isLoadingFeedback,
} = useFeedbackListQuery({ placeId })

const feedback = computed(() => feedbackListRaw.value.map(enrichFeedback))

// If we're not editing, don't have an activity id param, and we have some activities...
// ... then redirect to the first activity
watchEffect(() => {
  if (!isEditing.value && !activityIdRouteParam.value && activities.value.length > 0) {
    router.push({ params: { activityId: activities.value[0].id } }).catch(() => {})
  }
})

function getDateWithPlace (activity) {
  activity = unref(activity)
  if (!activity) return ''
  const { name } = activity.place || {}
  return `${d(activity.date, 'long')} (${name || ''})`
}

const feedbackOptions = computed(() => {
  return activities.value.map(activity => {
    return {
      label: getDateWithPlace(activity),
      value: activity,
    }
  })
})

const {
  mutate: save,
  status: saveStatus,
} = useFeedbackSaveMutation({
  onSuccess (feedback) {
    router.push({ name: 'placeFeedback', params: { placeId: placeId.value }, query: { highlight: feedback.id } })
  },
})

const {
  mutate: dismiss,
} = useDismissFeedbackMutation({
  onSuccess () {
    // router.push({ name: 'placeFeedback', params: { placeId: placeId.value } })
  },
})

</script>

<style scoped lang="sass">
.image-and-text
  padding-top: 1.5em
  padding-bottom: 1.5em

  .image-and-text-left
    width: 30%
    max-width: 10em
    padding: 1em
    margin: auto

  .image-and-text-right
    width: 100%
    padding: 0 1em
    margin: 0 auto

.place-feedback
  margin-top: 2.5em !important

  .randomBanner
    display: block
    height: 26px
    overflow: hidden
</style>

<style lang="sass">
.activity-feedback-wrapper .q-field-dark.grey-font
  padding: 4px 7px
  background-color: white
  border-radius: 4px

  .q-input-target, .q-input-shadow, .q-if-control
    color: rgb(40, 40, 40)
</style>
