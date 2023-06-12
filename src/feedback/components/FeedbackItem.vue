<template>
  <QCard
    v-if="feedback"
    class="no-shadow grey-border"
  >
    <QCardSection class="q-pa-md">
      <div class="row no-wrap">
        <div class="content full-width">
          <div class="row no-wrap items-baseline q-gutter-sm">
            <template v-if="activityType">
              <QIcon
                v-bind="getIconProps(activityType)"
              />
              <span>{{ getTranslatedName(activityType) }}</span>
            </template>
            <strong
              v-measure
              class="q-mr-sm"
              style="white-space: nowrap"
            >
              {{ $d(activity.date, 'longWithDayName') }}
            </strong>
            <RouterLink
              v-if="place"
              :to="{ name: 'placeFeedback', params: { groupId: place.group, placeId: place.id }}"
              class="ellipsis text-secondary"
            >
              {{ place.name }}
            </RouterLink>
            <RouterLink
              v-if="place && feedback.isEditable"
              class="edit-button"
              :to="{ name: 'editFeedback', params: { groupId: place.group, feedbackId: feedback.id }}"
            >
              <QIcon
                name="fas fa-pencil-alt"
                :title="$t('BUTTON.EDIT')"
              />
            </RouterLink>
          </div>
          <small class="text-weight-light">
            <RouterLink :to="{ name: 'user', params: { userId: feedback.givenBy } }">
              {{ givenBy?.userName }}
            </RouterLink>
            <span
              class="message-date q-ml-xs"
            >
              <DateAsWords :date="feedback.createdAt" />
            </span>
          </small>
          <div>
            <AmountBox
              v-if="hasWeight"
              class="on-right float-right amount-box"
              :size="80"
              :amount="feedback.weight"
            />
            <div
              v-if="feedback.comment"
              class="comment"
            >
              <Markdown :source="feedback.comment" />
            </div>
            <div class="q-mt-sm">
              <ProfilePicture
                :user="givenBy"
                :size="22"
              />
              <span v-if="membersWithoutGiver.length > 0">
                <ProfilePicture
                  v-for="member in membersWithoutGiver"
                  :key="member.id"
                  :user="member"
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

<script setup>
import {
  QCard,
  QCardSection,
  QIcon,
} from 'quasar'
import { toRefs, computed } from 'vue'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'

import ProfilePicture from '@/users/components/ProfilePicture.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'
import Markdown from '@/utils/components/Markdown.vue'

import AmountBox from './AmountBox.vue'

const props = defineProps({
  feedback: {
    type: Object,
    required: true,
  },
})

const { feedback } = toRefs(props)

const { getUserById } = useUserService()
const { getPlaceById } = usePlaceService()
const { getActivityTypeById } = useActivityTypeService()
const {
  getTranslatedName,
  getIconProps,
} = useActivityTypeHelpers()

const activity = computed(() => feedback.value.about)
const activityType = computed(() => getActivityTypeById(activity.value.activityType))
const place = computed(() => getPlaceById(activity.value.place))

const givenBy = computed(() => getUserById(feedback.value.givenBy))

const membersWithoutGiver = computed(() => activity.value.participants
  .filter(participant => participant.user !== feedback.value.givenBy)
  .map(participant => getUserById(participant.user)))

const hasWeight = computed(() => Number.isFinite(feedback.value?.weight))
</script>

<style scoped lang="sass">
.comment
  padding-top: 8px
  word-wrap: break-word

  ::v-deep(p:last-child)
    margin-bottom: 5px

.message-date
  display: inline-block

.edit-button
  opacity: .7

.q-card:hover .edit-button
  opacity: 1
</style>
