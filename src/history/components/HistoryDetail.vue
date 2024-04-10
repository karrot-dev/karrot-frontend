<template>
  <div
    v-if="entry"
    class="detail q-pl-xs q-ml-sm q-pt-xs q-mb-lg"
  >
    <QCard class="bg-grey-2 q-pb-sm">
      <QCardSection class="q-pb-none">
        <div class="text-h6">
          {{ t('INFO') }}
        </div>
      </QCardSection>
      <QList>
        <QItem>
          <QItemSection side>
            <QIcon name="far fa-fw fa-clock" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              {{ $d(entry.date, 'long') }},
              <DateAsWords
                :date="entry.date"
                style="display: inline"
                :future="false"
              />
              <template v-if="entry.typus === 'ACTIVITY_LEAVE'">
                (<em
                  v-t="{
                    path: 'HISTORY.ACTIVITY_LEAVE_DISTANCE',
                    args: {
                      distance: formatDistanceStrict(entry.date, activityPayload.date),
                    }
                  }"
                />)
              </template>
            </QItemLabel>
          </QItemSection>
        </QItem>

        <QItem>
          <QItemSection side>
            <QIcon name="fas fa-fw fa-user" />
          </QItemSection>
          <QItemSection>
            <div class="col">
              <ProfilePicture
                v-for="user in users"
                :key="user.id"
                :user="user"
                :size="25"
              />
            </div>
          </QItemSection>
        </QItem>

        <QItem v-if="entry.message">
          <QItemSection side>
            <QIcon name="far fa-fw fa-comment" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              {{ entry.message }}
            </QItemLabel>
          </QItemSection>
        </QItem>

        <QItem
          v-if="group"
        >
          <QItemSection side>
            <QIcon name="fas fa-fw fa-home" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              <RouterLink :to="{name: 'group', params: { groupId: group.id }}">
                {{ group.name }}
              </RouterLink>
            </QItemLabel>
          </QItemSection>
        </QItem>

        <QItem
          v-if="place && place.name"
        >
          <QItemSection side>
            <PlaceIcon :place="place" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              <RouterLink :to="{name: 'place', params: { groupId: place.group, placeId: place.id }}">
                {{ place.name }}
              </RouterLink>
            </QItemLabel>
          </QItemSection>
        </QItem>

        <QItem
          v-if="activityType"
        >
          <QItemSection side>
            <QIcon
              v-if="activityType"
              v-bind="getIconProps(activityType)"
            />
            <QIcon
              v-else
              :name="$icon('activity_fw')"
            />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              <template v-if="activityType">
                <strong>{{ getTranslatedName(activityType) }}</strong>&nbsp;
              </template>
              <template v-if="activityPayload">
                {{ $d(activityPayload.date, 'long') }}
                <template v-if="activityPayload.hasDuration">
                  &mdash; {{ $d(activityPayload.dateEnd, 'hourMinute') }}
                </template>
              </template>
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </QCard>

    <QCard
      v-if="entry.changes"
      class="bg-grey-2"
    >
      <QCardSection class="q-pb-none">
        <div class="text-h6">
          {{ t('HISTORY.CONTENT_CHANGES') }}
        </div>
      </QCardSection>

      <QCardSection>
        <HistoryDiff
          :typus="entry.typus"
          :changes="entry.changes"
        />
      </QCardSection>
    </QCard>

    <QCard
      v-if="visiblePayloadEntries.length > 0"
      class="bg-grey-2 q-pb-sm"
    >
      <QCardSection class="q-pb-none">
        <div class="text-h6">
          {{ t('HISTORY.DETAILS') }}
        </div>
      </QCardSection>
      <QList>
        <HistoryPayloadDetail
          v-for="{ key, value } in visiblePayloadEntries"
          :key="key"
          :label="key"
          :value="value"
        />
      </QList>
    </QCard>
  </div>
</template>

<script setup>
import {
  QCard,
  QCardSection,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
} from 'quasar'
import { toRefs, computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { convert as convertActivity } from '@/activities/api/activities'
import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'
import dateFnsHelper from '@/utils/dateFnsHelper'

import HistoryPayloadDetail from '@/history/components/HistoryPayloadDetail.vue'
import PlaceIcon from '@/places/components/PlaceIcon.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'

const HistoryDiff = defineAsyncComponent(() => import('@/history/components/HistoryDiff.vue'))

const { t } = useI18n()

const props = defineProps({
  entry: {
    type: Object,
    default: null,
  },
})

const { entry } = toRefs(props)

const { getActivityTypeById } = useActivityTypeService()
const { getGroupById } = useGroupInfoService()
const { getPlaceById } = usePlaceService()
const { getUserById } = useUserService()

const {
  getIconProps,
  getTranslatedName,
} = useActivityTypeHelpers()

const group = computed(() => getGroupById(entry.value.group))
const place = computed(() => getPlaceById(entry.value.place))
const users = computed(() => entry.value?.users.map(getUserById) ?? [])

const activityType = computed(() => {
  if (props.entry.payload && props.entry.payload.activityType) {
    return getActivityTypeById(props.entry.payload.activityType)
  }
  else if (props.entry.after && [
    'ACTIVITY_TYPE_CREATE',
    'ACTIVITY_TYPE_MODIFY',
  ].includes(props.entry.typus)) {
    return getActivityTypeById(props.entry.after.id)
  }
  return null
})

function formatDistanceStrict (...args) {
  return dateFnsHelper.formatDistanceStrict(...args)
}

const activityPayload = computed(() => {
  if ([
    'ACTIVITY_CREATE',
    'ACTIVITY_JOIN',
    'ACTIVITY_LEAVE',
  ].includes(props.entry.typus)) {
    return convertActivity(props.entry.payload)
  }
  return null
})

// Just payload entries that we can display nicely, don't want to show raw JSON
const visiblePayloadEntries = computed(() => {
  const { payload } = props.entry
  if (!payload) return []
  // If we have change data, don't also show it here...
  const excludeKeys = props.entry.changes ? Object.keys(props.entry.changes) : []
  return Object.keys(payload)
    .filter(key => !excludeKeys.includes(key))
    .map(key => ({ key, value: payload[key] }))
    .filter(({ key, value }) => (
    // Special handling for these in HistoryPayloadDetail
      ['participants', 'date'].includes(key) ||
          // Simple renderable types
          ['string', 'number', 'boolean'].includes(typeof value) ||
          value instanceof Date
    ) && value !== '')
})

</script>

<style scoped lang="sass">
.detail
  border-left: 2px solid $grey-4
</style>
