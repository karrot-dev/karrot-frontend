<template>
  <QCard
    v-if="entry"
    class="no-margin"
  >
    <QList
      v-if="entry"
      class="full-width"
    >
      <QItem
        class="bg-accent"
      >
        <QItemSide
          color="white"
          icon="fas fa-fw fa-info"
        />
      </QItem>

      <QItem dense>
        <QItemSide icon="far fa-fw fa-clock" />
        <QItemMain>
          <QItemLabel>
            {{ $d(new Date(entry.date), 'long') }},
            <DateAsWords
              :date="entry.date"
              style="display: inline"
            />
          </QItemLabel>
        </QItemMain>
      </QItem>

      <QItem dense>
        <QItemSide icon="fas fa-fw fa-user" />
        <QItemMain>
          <QItemTile>
            <ProfilePicture
              v-for="user in entry.users"
              :key="user.id"
              :user="user"
            />
          </QItemTile>
        </QItemMain>
      </QItem>

      <QItem dense>
        <QItemSide icon="far fa-fw fa-comment" />
        <QItemMain>
          <QItemLabel>
            {{ entry.message }}
          </QItemLabel>
        </QItemMain>
      </QItem>

      <QItem
        v-if="entry.group && entry.group.name"
        dense
      >
        <QItemSide icon="fas fa-fw fa-home" />
        <QItemMain>
          <QItemLabel>
            <RouterLink :to="{name: 'group', params: { groupId: entry.group.id }}">
              {{ entry.group.name }}
            </RouterLink>
          </QItemLabel>
        </QItemMain>
      </QItem>

      <QItem
        v-if="entry.place && entry.place.name"
        dense
      >
        <QItemSide :icon="$icon('place_fw')" />
        <QItemMain>
          <QItemLabel>
            <RouterLink :to="{name: 'place', params: { groupId: entry.place.group.id, placeId: entry.place.id }}">
              {{ entry.place.name }}
            </RouterLink>
          </QItemLabel>
        </QItemMain>
      </QItem>
    </QList>
    <QList
      v-if="entry.payload"
      striped
    >
      <QItem
        class="bg-accent"
      >
        <QItemSide
          color="white"
          icon="far fa-fw fa-file-alt"
        />
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
  QItemMain,
  QItemTile,
  QItemSide,
} from 'quasar'
import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'
import HistoryPayloadDetail from '@/history/components/HistoryPayloadDetail'

export default {
  components: {
    QBtn,
    QCard,
    QList,
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
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
  methods: {
    toggleRaw () {
      this.raw = !this.raw
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
