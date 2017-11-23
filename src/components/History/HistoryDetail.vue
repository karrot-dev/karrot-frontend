<template>
  <q-card class="no-margin">
    <table class="q-table" v-if="entry">
      <colgroup>
        <col span="1" style="width: 1%;">
        <col span="1">
      </colgroup>
      <tbody>
        <tr class="bg-tertiary text-white">
          <td colspan="2"><q-icon name="fa-info"></q-icon></td>
        </tr>
        <tr>
          <td><q-icon name="fa-fw fa-clock-o"></q-icon></td>
          <td>{{ $d(new Date(entry.date), 'long') }}, <DateAsWords :date="entry.date" /></td>
        </tr>
        <tr>
          <td><q-icon name="fa-fw fa-user"></q-icon></td>
          <td>
            <ProfilePicture
              v-for="user in entry.users"
              :key="user.id"
              :user="user"
            />
          </td>
        </tr>
        <tr>
          <td><q-icon name="fa-fw fa-commenting-o"></q-icon></td>
          <td>{{ entry.message }}</td>
        </tr>
        <tr v-if="entry.group && entry.group.name">
          <td><q-icon name="fa-fw fa-home"></q-icon></td>
          <td>
            <router-link :to="{name: 'group', params: { groupId: entry.group.id }}">
              {{ entry.group.name }}
            </router-link>
          </td>
        </tr>
        <tr v-if="entry.store && entry.store.name">
          <td><q-icon name="fa-fw fa-shopping-cart"></q-icon></td>
          <td>
            <router-link :to="{name: 'store', params: { groupId: entry.store.group, storeId: entry.store.id }}">
              {{ entry.store.name }}
            </router-link>
          </td>
        </tr>
        <template v-if="entry.payload">
          <tr class="bg-tertiary text-white">
            <td colspan="2"><q-icon name="fa-fw fa-file-text-o"></q-icon></td>
          </tr>
          <HistoryPayloadDetail :label="key" :value="value" v-for="(value, key) in entry.payload" :key="key" />
        </template>
        <tr class="bg-neutral text-white">
          <td colspan="2">
            <q-btn @click="toggleRaw()" color="secondary">Raw data</q-btn>
          </td>
        </tr>
        <tr v-if="raw">
          <td colspan="2">
            <pre style="white-space: pre-wrap">{{ entry }}</pre>
          </td>
        </tr>
      </tbody>
    </table>
  </q-card>
</template>

<script>
import { QIcon, QBtn, QCard, QCardTitle } from 'quasar'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'
import HistoryPayloadDetail from '@/components/History/HistoryPayloadDetail'

export default {
  props: {
    entry: {},
  },
  components: { QIcon, QBtn, QCard, QCardTitle, ProfilePicture, DateAsWords, HistoryPayloadDetail },
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
table {
  width: 100%;
}
</style>
