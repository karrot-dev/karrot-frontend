<template>
  <div>
    <q-item
      multiline
      class="clickable"
      @click="detailIsShown = !detailIsShown"
    >
      <q-item-side>
        <ProfilePicture
          v-for="user in entry.users"
          :key="user.id"
          :user="user"
          :size="25"
        />
      </q-item-side>
      <q-item-main>
        <q-item-tile>
          <span class="content">
            {{ entry.message }}
          </span>
        </q-item-tile>
        <q-item-tile
          stamp
          class="mobile-only light-paragraph"
        >
          <DateAsWords :date="entry.date" />
        </q-item-tile>
      </q-item-main>
      <q-item-side
        class="desktop-only"
        stamp
        right
      >
        <DateAsWords :date="entry.date" />
      </q-item-side>
    </q-item>
    <transition name="slide-toggle">
      <HistoryDetail
        v-if="detailIsShown"
        :entry="entry"/>
    </transition>
  </div>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'
import HistoryDetail from '@/components/History/HistoryDetail'
import { QItem, QItemSide, QItemMain, QItemTile } from 'quasar'

export default {
  props: {
    entry: {
      required: true,
      type: Object,
    },
  },
  data () {
    return {
      detailIsShown: false,
    }
  },
  components: { HistoryDetail, ProfilePicture, DateAsWords, QItem, QItemSide, QItemMain, QItemTile },
}
</script>
<style scoped lang="stylus">
.clickable
  &:hover
    cursor pointer
    background-color rgb(235, 235, 235)
</style>
