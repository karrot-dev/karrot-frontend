<template>
  <div class="chat-list">
    <q-toolbar
      class="toolbar"
      color="chat">
      <q-toolbar-title style="padding: 0px">
        <q-search
          color="chat"
          inverted
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
        style="cursor: pointer"
        v-for="item in [1, 2, 3, 4, 5]"
        @click="openFloater ? $emit('addFloater', item) : ''"
        :to="openFloater ? '' : {name: 'chatDetail', params: {userId: item}}"
        :key="item">
        <q-item-side>
          <ProfilePicture
            :user="{ displayName: 'Max Mustermann', id: 2 }"
            :size="24"
          />
        </q-item-side>
        <q-item-main
          class="one-lined"
          :label="data.messages[0].author.displayName"
          :sublabel="data.messages[0].content" />
        <q-item-side right>
          <small>10min</small>
        </q-item-side>
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
  props: {
    data: {
      type: Object,
      required: true,
    },
    openFloater: {
      type: Boolean,
      default: false,
    },
  },
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
  .q-search
    background rgba(0,0,0,0)
    border 0
  .q-search.q-if-focused
    background rgba(0,0,0,0.35)
</style>

<style lang="stylus">
.chat-list .one-lined .q-item-sublabel
  overflow hidden
  display block !important
  white-space nowrap
  text-overflow ellipsis
</style>
