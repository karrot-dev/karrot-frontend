<template>
  <tr>
    <td v-if="!$q.platform.is.mobile" class="text-faded">
      <small>
        <DateAsWords :date="entry.date" />
      </small>
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
    <q-tooltip v-if="$q.platform.is.mobile">
      {{ $d(new Date(entry.date), 'long') }}
    </q-tooltip>
  </tr>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'
import { QTooltip } from 'quasar'

export default {
  props: ['entry'],
  components: { QTooltip, ProfilePicture, DateAsWords },
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
