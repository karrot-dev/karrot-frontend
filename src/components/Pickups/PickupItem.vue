<template>
  <q-card v-bind:class="{ full: pickup.isFull }">
    <q-card-main class="row inline no-padding justify-between content"
      v-bind:class="{ isUserMember: pickup.isUserMember }">
      <div class="column padding full-width">
        <div>
          <span class="featured-text">{{ $d(pickup.date, 'timeShort') }}</span>
          <slot>Date or Store Slot</slot>
        </div>
        <div class="people" v-if="pickup.description">
          {{ pickup.description }}
        </div>
        <div class="people full-width">
          <ProfilesInline @join="button.click()" @leave="button.click()" :slots="pickup.maxCollectors" :users="pickup.collectors"/>
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardMain, QBtn, QSpinner } from 'quasar'
import ProfilesInline from '../ProfilePictures/ProfilesInline.vue'

export default {
  props: {
    pickup: {
      required: true,
    },
  },
  components: {
    QCard, QCardMain, QBtn, QSpinner, ProfilesInline,
  },
  methods: {
    join () {
      this.$emit('join', this.pickup.id)
    },
    leave () {
      this.$emit('leave', this.pickup.id)
    },
  },
  computed: {
    button () {
      if (this.pickup.isUserMember) {
        return {
          className: 'q-btn-flat leave full-height',
          translation: 'PICKUPLIST.ITEM.LEAVE',
          click: this.leave,
        }
      }
      else if (this.pickup.isFull) {
        return {
          className: 'join full-height',
          translation: 'PICKUPLIST.ITEM.JOIN',
        }
      }
      else {
        return {
          className: 'join full-height',
          translation: 'PICKUPLIST.ITEM.JOIN',
          click: this.join,
        }
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

$lightRed = #FFF5F5
$lightGreen = #E7FFE0
$lighterGreen = #F0FFF0

.content
  width 100%
  font-size: .8em
  .padding
    padding 1em
    .featured-text
      font-size 1.5em
      display inline
      margin-right .5em
  .people
    padding: .3em
.content.isEmpty
  background repeating-linear-gradient(
    135deg,
    white,
    white 15px,
    $lightRed 15px,
    $lightRed 30px
  )
.content.isUserMember
  background linear-gradient(to right, $lightGreen, $lighterGreen)
.full-height
  height 100% !important
.join
  background-color $positive
  color white
.leave
  color $negative
</style>
