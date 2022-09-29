<template>
  <QCard
    v-if="entry"
    class="no-margin"
  >
    <QList
      v-if="entry"
      class="full-width"
    >
      <QItem class="bg-accent">
        <QItemSection side>
          <QIcon
            color="white"
            name="fas fa-fw fa-info"
          />
        </QItemSection>
      </QItem>

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
          <QIcon :name="$icon('place_fw')" />
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
    <HistoryDiff
      v-if="entry.changes"
      :typus="entry.typus"
      :changes="entry.changes"
    />
    <QList
      v-if="visiblePayloadEntries.length > 0"
    >
      <QItem class="bg-accent">
        <QItemSection side>
          <QIcon
            color="white"
            name="far fa-fw fa-file-alt"
          />
        </QItemSection>
      </QItem>
      <HistoryPayloadDetail
        v-for="{ key, value } in visiblePayloadEntries"
        :key="key"
        :label="key"
        :value="value"
      />
    </QList>
    <QList>
      <QItem class="text-white">
        <QBtn
          color="secondary"
          @click="toggleRaw()"
        >
          Raw data
        </QBtn>
      </QItem>
      <QItem v-if="raw">
        <pre style="white-space: pre-wrap">
          {{ entry }}
        </pre>
      </QItem>
    </QList>
  </QCard>
</template>

<script>
import {
  QBtn,
  QCard,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
} from 'quasar'
import { toRefs, computed, defineAsyncComponent } from 'vue'

import { convert as convertActivity } from '@/activities/api/activities'
import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'
import dateFnsHelper from '@/utils/dateFnsHelper'

import HistoryPayloadDetail from '@/history/components/HistoryPayloadDetail'
import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'

const HistoryDiff = defineAsyncComponent(() => import('@/history/components/HistoryDiff'))

export default {
  components: {
    HistoryDiff,
    QBtn,
    QCard,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    ProfilePicture,
    DateAsWords,
    HistoryPayloadDetail,
  },
  props: {
    entry: {
      type: Object,
      default: null,
    },
  },
  setup (props) {
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

    return {
      group,
      place,
      users,

      getActivityTypeById,
      getIconProps,
      getTranslatedName,
    }
  },
  data () {
    return {
      raw: false,
    }
  },
  computed: {
    activityType () {
      if (this.entry.payload && this.entry.payload.activityType) {
        return this.getActivityTypeById(this.entry.payload.activityType)
      }
      else if (this.entry.after && [
        'ACTIVITY_TYPE_CREATE',
        'ACTIVITY_TYPE_MODIFY',
      ].includes(this.entry.typus)) {
        return this.getActivityTypeById(this.entry.after.id)
      }
      return null
    },
    activityPayload () {
      if ([
        'ACTIVITY_CREATE',
        'ACTIVITY_JOIN',
        'ACTIVITY_LEAVE',
      ].includes(this.entry.typus)) {
        return convertActivity(this.entry.payload)
      }
      return null
    },
    // Just payload entries that we can display nicely, don't want to show raw JSON
    visiblePayloadEntries () {
      const { payload } = this.entry
      if (!payload) return []
      // If we have change data, don't also show it here...
      const excludeKeys = this.entry.changes ? Object.keys(this.entry.changes) : []
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
    },
  },
  methods: {
    toggleRaw () {
      this.raw = !this.raw
    },
    formatDistanceStrict (...args) {
      return dateFnsHelper.formatDistanceStrict(...args)
    },
  },
}
</script>
