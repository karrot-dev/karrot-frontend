<template>
  <tr @click="$router.push({ name: 'historyDetail', params: { historyId: entry.id } })" class="clickable">
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
    <td v-if="$q.platform.is.mobile" class="expand">
      <span class="text-truncate">{{ entry.message }}</span>
      <small class="text-faded">
        <DateAsWords :date="entry.date" />
      </small>
    </td>
    <td v-else class="expand text-truncate">
      <router-link :to="{ name: 'historyDetail', params: { historyId: entry.id } }">
        {{ entry.message }}
      </router-link>
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
.clickable
  cursor pointer
</style>
