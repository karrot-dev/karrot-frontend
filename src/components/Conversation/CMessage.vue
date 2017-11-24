<template>
    <q-item multiline>
      <q-item-side>
        <ProfilePicture :user="message.author" :size="40" />
      </q-item-side>
      <q-item-main>
        <q-item-tile>
          <router-link :to="{ name: 'user', params: {userId: message.author.id} }">
            <span class="text-bold text-secondary uppercase">{{ message.author.displayName }}</span>
          </router-link>
          <span class="content">{{ message.content }}</span>
        </q-item-tile>
        <q-item-tile class="row light-paragraph" style="padding-top: 5px">
          <small>
            <DateAsWords :date="message.createdAt" />
          </small>
        </q-item-tile>
      </q-item-main>
    </q-item>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QItem, QItemSide, QItemMain, QItemTile } from 'quasar'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  name: 'CMessage',
  components: {
    ProfilePicture, QItem, QItemSide, QItemMain, QItemTile, DateAsWords,
  },
  props: {
    message: { required: true },
  },
}
</script>

<style scoped lang="stylus">
.left
  margin-right 1em
.content
  white-space pre-line
  word-wrap break-word
</style>
