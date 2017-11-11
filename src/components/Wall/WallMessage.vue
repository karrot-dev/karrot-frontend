<template>
    <q-item multiline>
      <q-item-main>
        <q-item-tile label class="content">
          {{ message.content }}
        </q-item-tile>
      </q-item-main>
      <q-item-side right>
        <q-item-tile stamp>
          <DateAsWords :date="message.createdAt" />
        </q-item-tile>
        <ProfilePicture :user="message.author" :size="40" />
      </q-item-side>
    </q-item>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QItem, QItemSide, QItemMain, QItemTile } from 'quasar'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  name: 'WallMessage',
  components: {
    ProfilePicture, QItem, QItemSide, QItemMain, QItemTile, DateAsWords,
  },
  props: {
    message: { required: true },
  },
}
</script>

<style scoped lang="stylus">
.left {
  margin-right: 1em;
}
.content {
  white-space: pre-line;
}
</style>
