<template>
<div>
    <q-item multiline :to="{ name: 'historyDetail', params: { historyId: entry.id } }">
      <q-item-side>
        <ProfilePicture
          v-for="user in entry.users"
          :key="user.id"
          :user="user"
          size="25"
        />
      </q-item-side>
      <q-item-main>
        <q-item-tile>
          <span class="content">{{ entry.message }}</span>
        </q-item-tile>
      </q-item-main>
      <q-item-side right>
        <DateAsWords :date="entry.date" />
      </q-item-side>
    </q-item>
  </div>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'
import { QItem, QItemSide, QItemMain, QItemTile } from 'quasar'

export default {
  props: ['entry'],
  components: { ProfilePicture, DateAsWords, QItem, QItemSide, QItemMain, QItemTile },
}
</script>
<style scoped lang="stylus">
td
    white-space nowrap
td.expand
    width 100%
    white-space normal
</style>
