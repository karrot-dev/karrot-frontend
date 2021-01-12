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
          <ProfilePicture
            v-for="user in entry.users"
            :key="user.id"
            :user="user"
          />
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
        v-if="entry.group && entry.group.name"
      >
        <QItemSection side>
          <QIcon name="fas fa-fw fa-home" />
        </QItemSection>
        <QItemSection>
          <QItemLabel>
            <RouterLink :to="{name: 'group', params: { groupId: entry.group.id }}">
              {{ entry.group.name }}
            </RouterLink>
          </QItemLabel>
        </QItemSection>
      </QItem>

      <QItem
        v-if="entry.place && entry.place.name"
      >
        <QItemSection side>
          <QIcon :name="$icon('place_fw')" />
        </QItemSection>
        <QItemSection>
          <QItemLabel>
            <RouterLink :to="{name: 'place', params: { groupId: entry.place.group.id, placeId: entry.place.id }}">
              {{ entry.place.name }}
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
            v-bind="activityType.iconProps"
          />
          <QIcon
            v-else
            :name="$icon('activity_fw')"
          />
        </QItemSection>
        <QItemSection>
          <QItemLabel>
            <template v-if="activityType">
              <strong>{{ activityType.translatedName }}</strong>
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
    <QList
      v-if="entry.payload"
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
        v-for="(value, key) in entry.payload"
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
import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'
import HistoryPayloadDetail from '@/history/components/HistoryPayloadDetail'
import dateFnsHelper from '@/utils/dateFnsHelper'
import { convert as convertActivity } from '@/activities/api/activities'
import { mapGetters } from 'vuex'

export default {
  components: {
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
  data () {
    return {
      raw: false,
    }
  },
  computed: {
    ...mapGetters({
      getActivityType: 'activityTypes/get',
    }),
    activityType () {
      if (this.entry.payload && this.entry.payload.activityType) {
        return this.getActivityType(this.entry.payload.activityType)
      }
      else if (this.entry.after && [
        'ACTIVITY_TYPE_CREATE',
        'ACTIVITY_TYPE_MODIFY',
      ].includes(this.entry.typus)) {
        return this.getActivityType(this.entry.after.id)
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
