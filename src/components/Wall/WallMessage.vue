<template>
    <q-item multiline>
      <q-item-tile lines="2" class="left"><ProfilePicture :user="message.author" :size="40" /></q-item-tile>
      <q-item-main
        :label="message.author.displayName"
        label-lines="1"
        :sublabel="message.content"
        sublabel-lines="500"
        class="content"
      />
      <q-item-side right :stamp="$d(message.createdAt, 'long')" />
    </q-item>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QItem, QItemSide, QItemMain, QItemTile } from 'quasar'
export default {
  name: 'WallMessage',
  components: {
    ProfilePicture, QItem, QItemSide, QItemMain, QItemTile,
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
  white-space: pre;
}
</style>
