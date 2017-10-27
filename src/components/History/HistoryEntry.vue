<template>
  <tr>
    <td v-if="!$q.platform.is.mobile" class="text-faded">
      <small>{{ $d(new Date(entry.date), 'long') }}</small>
    </td>
    <td class="text-right">
        <ProfilePicture
          v-for="user in entry.users"
          :key="user.id"
          :user="user"
        />
    </td>
    <td class="expand text-truncate">
      {{ entry.message }}
    </td>
    <!-- {{ entry }} -->
  </tr>
</template>

<script>
import { QItem, QItemSide, QItemTile, QItemMain, QItemTitle } from 'quasar'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture.vue'

export default {
  props: ['entry'],
  components: { ProfilePicture, QItem, QItemSide, QItemTile, QItemMain, QItemTitle },
}
</script>
<style scoped lang="stylus">
td {
    white-space: nowrap;
}
td.expand {
    width: 100%;
    white-space: normal;
}
</style>
