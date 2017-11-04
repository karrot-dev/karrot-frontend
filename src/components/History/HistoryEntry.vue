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
  </tr>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  props: ['entry'],
  components: { ProfilePicture, DateAsWords },
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
