<template>
  <q-card>
    <q-card-title>
      {{ $t('HISTORY.DETAILS') }}
    </q-card-title>
    <table class="q-table" v-if="entry">
      <colgroup>
        <col span="1" style="width: 1%;">
        <col span="1">
      </colgroup>
      <tbody>
        <tr class="bg-primary text-white">
          <td colspan="2"><q-icon name="fa-info"></q-icon></td>
        </tr>
        <tr>
          <td><q-icon name="fa-clock-o"></q-icon></td>
          <td>{{ $d(new Date(entry.date), 'long') }}, <DateAsWords :date="entry.date" /></td>
        </tr>
        <tr>
          <td><q-icon name="fa-user"></q-icon></td>
          <td>
            <ProfilePicture
              v-for="user in entry.users"
              :key="user.id"
              :user="user"
            />
          </td>
        </tr>
        <tr>
          <td><q-icon name="fa-commenting-o"></q-icon></td>
          <td>{{ entry.message }}</td>
        </tr>
        <tr v-if="entry.group && entry.group.name">
          <td><q-icon name="fa-home"></q-icon></td>
          <td>{{ entry.group.name }}</td>
        </tr>
        <tr v-if="entry.store && entry.store.name">
          <td><q-icon name="fa-shopping-cart"></q-icon></td>
          <td>{{ entry.store.name }}</td>
        </tr>
        <template v-if="entry.payload">
          <tr class="bg-primary text-white">
            <td colspan="2"><q-icon name="fa-file-text-o"></q-icon></td>
          </tr>
          <tr v-for="(value, key) in entry.payload" :key="key">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </template>
        <tr class="bg-primary text-white">
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

export default {
  props: {
    entry: {},
  },
  components: { QIcon, QBtn, QCard, QCardTitle, ProfilePicture, DateAsWords },
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
