<template>
  <div class="row">
    <div class="col">
      <template
        v-for="{ feedback, user } in feedbackAndUsers"
        :key="feedback.id"
      >
        <QItem>
          <QItemSection avatar>
            <ProfilePicture
              :user="user"
              :size="32"
            />
          </QItemSection>
          <QItemSection>
            <QItemLabel class="text-bold">
              <RouterLink :to="{name: 'user', params: { userId: user.id }}">
                {{ user.displayName }}
              </RouterLink>
            </QItemLabel>
            <QItemLabel
              caption
            >
              <div
                class="row q-gutter-sm"
              >
                <small v-if="feedback.weight > 0">
                  {{ formatFeedbackWeight(feedback.weight).join('') }}
                </small>
                <small class="text-weight-light">
                  <DateAsWords
                    :date="feedback.createdAt"
                    :future="false"
                  />
                </small>
                <small>
                  <RouterLink
                    v-if="place && feedback.isEditable"
                    class="edit-button block"
                    :to="{ name: 'editFeedback', params: { groupId: place.group, feedbackId: feedback.id }}"
                  >
                    <QIcon
                      name="fas fa-pencil-alt"
                      :title="$t('BUTTON.EDIT')"
                    />
                  </RouterLink>
                </small>
              </div>
            </QItemLabel>
          </QItemSection>
        </QItem>
        <QCardSection v-if="feedback.comment">
          <div class="comment">
            <Markdown :source="feedback.comment" />
          </div>
        </QCardSection>
      </template>
    </div>
    <div class="col-auto">
      <AmountBox
        v-if="hasFeedbackWeight"
        :size="80"
        class="q-ma-md"
        :amount="feedbackWeight"
      />
    </div>
  </div>
</template>
<script setup>
import { QCardSection, QIcon, QItem, QItemLabel, QItemSection } from 'quasar'
import { computed, toRefs } from 'vue'

import { useActivityTypeService } from '@/activities/services'
import { useFeedbackHelpers } from '@/feedback/helpers'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'

import AmountBox from '@/feedback/components/AmountBox.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'
import Markdown from '@/utils/components/Markdown.vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true,
  },
})

const { activity } = toRefs(props)

const {
  getActivityTypeById,
} = useActivityTypeService()

const { formatFeedbackWeight } = useFeedbackHelpers()

const { getPlaceById } = usePlaceService()

const place = computed(() => getPlaceById(activity.value.place))

const feedbackAndUsers = computed(() => activity.value?.feedback?.map(feedback => ({
  feedback,
  user: getUserById(feedback.givenBy),
})))

const activityType = computed(() => getActivityTypeById(activity.value.activityType))
const hasFeedbackWeight = computed(() => activityType.value?.hasFeedbackWeight)
const feedbackWeight = computed(() => {
  if (!hasFeedbackWeight.value) return 0
  return activity.value?.feedback.reduce((total, feedback) => total + feedback.weight, 0)
})

const { getUserById } = useUserService()

// const hasWeight = computed(() => Number.isFinite(Math.sum([0]).value?.weight))

</script>

<style scoped lang="sass">
.comment
  word-wrap: break-word

  ::v-deep(p:last-child)
    margin-bottom: 5px

.edit-button
  opacity: .7

.q-card:hover .edit-button
  opacity: 1
</style>
