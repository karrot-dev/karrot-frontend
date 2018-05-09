<template>
  <q-card
    v-if="entry"
    class="no-margin"
  >
    <q-list
      class="full-width"
      v-if="entry"
    >
      <q-item
        class="bg-tertiary"
      >
        <q-item-side
          color="white"
          icon="fas fa-fw fa-info"
        />
      </q-item>

      <q-item dense>
        <q-item-side icon="far fa-fw fa-clock" />
        <q-item-main>
          <q-item-tile label>
            {{ $d(new Date(entry.date), 'long') }},
            <DateAsWords
              :date="entry.date"
              style="display: inline"
            />
          </q-item-tile>
        </q-item-main>
      </q-item>

      <q-item dense>
        <q-item-side icon="fas fa-fw fa-user" />
        <q-item-main>
          <q-item-tile>
            <ProfilePicture
              v-for="user in entry.users"
              :key="user.id"
              :user="user"
            />
          </q-item-tile>
        </q-item-main>
      </q-item>

      <q-item dense>
        <q-item-side icon="far fa-fw fa-comment" />
        <q-item-main>
          <q-item-tile label>
            {{ entry.message }}
          </q-item-tile>
        </q-item-main>
      </q-item>

      <q-item
        v-if="entry.group && entry.group.name"
        dense
      >
        <q-item-side icon="fas fa-fw fa-home" />
        <q-item-main>
          <q-item-tile label>
            <router-link :to="{name: 'group', params: { groupId: entry.group.id }}">
              {{ entry.group.name }}
            </router-link>
          </q-item-tile>
        </q-item-main>
      </q-item>

      <q-item
        v-if="entry.store && entry.store.name"
        dense
      >
        <q-item-side icon="fas fa-fw fa-shopping-cart" />
        <q-item-main>
          <q-item-tile label>
            <router-link :to="{name: 'store', params: { groupId: entry.store.group, storeId: entry.store.id }}">
              {{ entry.store.name }}
            </router-link>
          </q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
    <q-list
      v-if="entry.payload"
      striped
    >
      <q-item
        class="bg-tertiary"
      >
        <q-item-side
          color="white"
          icon="far fa-fw fa-file-alt"
        />
      </q-item>
      <HistoryPayloadDetail
        v-for="(value, key) in entry.payload"
        :key="key"
        :label="key"
        :value="value"
      />
    </q-list>
    <q-list>
      <q-item class="bg-neutral text-white">
        <q-btn
          @click="toggleRaw()"
          color="secondary">Raw data
        </q-btn>
      </q-item>
      <q-item v-if="raw">
        <pre style="white-space: pre-wrap">
          {{ entry }}
        </pre>
      </q-item>
    </q-list>
  </q-card>
</template>

<script>
import { QIcon, QBtn, QCard, QCardTitle, QList, QItem, QItemMain, QItemTile, QItemSide } from 'quasar'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'
import HistoryPayloadDetail from '@/components/History/HistoryPayloadDetail'

export default {
  props: {
    entry: {
      type: Object,
      default: null,
    },
  },
  components: { QIcon, QBtn, QCard, QCardTitle, QList, QItem, QItemMain, QItemTile, QItemSide, ProfilePicture, DateAsWords, HistoryPayloadDetail },
  methods: {
    toggleRaw () {
      this.raw = !this.raw
    },
  },
  data () {
    return {
      raw: false,
    }
  },
}
</script>

<style scoped lang="stylus">
</style>
