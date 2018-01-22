<template>
  <div class="chat-list">
    <q-toolbar
      class="toolbar"
      color="primary">
      <q-toolbar-title style="padding: 0px">
        <q-search
          color="primary"
          inverted
          dark
          v-model="searchModel"
          :debounce="600"
          placeholder="Find user"
          icon="search"
        />
      </q-toolbar-title>
    </q-toolbar>
    <q-list
      highlight
      class="no-border">
      <q-item
        v-for="item in [1, 2, 3, 4, 5]"
        :to="{name: 'chatDetail', params: {chatId: item}}"
        :key="item">
        <q-item-side>
          <ProfilePicture
            :user="{ displayName: 'Max Mustermann', id: 2 }"
            :size="24"
          />
        </q-item-side>
        <q-item-main
          label="Max Mustermann"
          sublabel="Hey! This was my last message! It was very nice to hear from you recently" />
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { QList, QSearch, QToolbar, QToolbarTitle, QItem, QItemMain, QItemSide } from 'quasar'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

export default {
  name: 'ChatFloater',
  components: { ProfilePicture, QSearch, QToolbar, QToolbarTitle, QList, QItem, QItemMain, QItemSide },
}
</script>

<style scoped lang="stylus">
.chat-list
  .toolbar
    min-height 40px
    height 40px
  min-width 200px
  .q-list
    padding-top 0
</style>
