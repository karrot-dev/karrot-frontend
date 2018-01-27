<template>
  <q-item
    multiline
    :class="{ isUnread: message.isUnread }"
  >
    <q-item-side>
      <ProfilePicture
        :user="message.author"
        :size="40"
      />
    </q-item-side>
    <q-item-main>
      <q-item-tile>
        <div class="no-wrap">
          <router-link :to="{ name: 'user', params: { userId: message.author.id } }">
            <span class="text-bold text-secondary uppercase">{{ message.author.displayName }}</span>
          </router-link>
          <span class="message-date">
            <small class="light-paragraph">
              <DateAsWords :date="message.createdAt" />
            </small>
          </span>
        </div>
      </q-item-tile>
      <span class="content">{{ message.content }}</span>
    </q-item-main>
  </q-item>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QItem, QItemSide, QItemMain, QItemTile } from 'quasar'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  name: 'ConversationMessage',
  components: {
    ProfilePicture, QItem, QItemSide, QItemMain, QItemTile, DateAsWords,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
// same as PickupItem colors
$lightGreen = #E7FFE0
$lighterGreen = #F0FFF0

.left
  margin-right 1em
.content
  white-space pre-line
  word-wrap break-word
.message-date
  display inline-block
  margin-left 2px
.isUnread
  background linear-gradient(to right, $lightGreen, $lighterGreen)
</style>
