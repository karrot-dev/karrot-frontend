<template>
  <q-card v-bind:class="{ full: pickup.isFull }">
    <q-card-main class="row inline no-padding justify-between content"
      v-bind:class="{ isUserMember: pickup.isUserMember }">
      <div class="column padding">
        <div>
          <span class="featured-text">{{ $d(pickup.date, 'timeShort') }}</span>
          <slot>Date or Time Slot</slot>
        </div>
        <div class="people" v-if="pickup.description">
          {{ pickup.description }}
        </div>
        <div class="people">
          <ProfilesInline :users="pickup.collectorIds"/>
        </div>
      </div>
      <div>
        <q-btn v-if="!pickup.isUserMember && !pickup.isFull" @click="join" class="join full-height">
          &nbsp;{{ $t("PICKUPLIST.ITEM.JOIN") }}
        </q-btn>
        <q-btn v-if="pickup.isFull && !pickup.isUserMember" class="q-btn-flat full disabled full-height">
          &nbsp;{{ $t("PICKUPLIST.ITEM.FULL") }}
        </q-btn>
        <q-btn v-if="pickup.isUserMember" @click="leave" class="q-btn-flat leave full-height">
          &nbsp;{{ $t("PICKUPLIST.ITEM.LEAVE") }}
        </q-btn>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardMain, QBtn } from 'quasar'
import ProfilesInline from '../ProfilePictures/ProfilesInline.vue'

export default {
  props: {
    pickup: {
      required: true,
    },
  },
  components: {
    QCard, QCardMain, QBtn, ProfilesInline,
  },
  methods: {
    join (event) {
      this.$emit('join')
    },
    leave (event) {
      this.$emit('leave')
    },
  },
}
</script>

<style scoped lang="stylus">
$lightRed = #FFF5F5
$lightGreen = #F8FFF0
$lighterGreen = #F8FFF8

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
  background-color darkgreen 
  color white
.leave
  color red
</style>
