<template>
  <q-card v-bind:class="{ full: pickup.isFull }">
    <q-card-main class="row inline no-padding justify-between content"
      v-bind:class="{ isUserMember: pickup.isUserMember }">
      <div class="column padding">
        <div>
          <h5>{{ pickup.date }}</h5>
          <slot>
            Date or Store slot
          </slot>
          <p>{{ pickup.description }}</p>
        </div>
        <div class="people">
          List of people who joined goes here...
        </div>
      </div>
      <div>
        <q-btn v-if="!pickup.isUserMember && !pickup.isFull" @click="join" class="join full-height">
          &nbsp;Join
        </q-btn>
        <q-btn v-if="pickup.isFull && !pickup.isUserMember" class="q-btn-flat full disabled full-height">
          &nbsp;Full
        </q-btn>
        <q-btn v-if="pickup.isUserMember" @click="leave" class="q-btn-flat leave full-height">
          &nbsp;Leave
        </q-btn>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCardTitle, QCard, QCardMain, QCardSeparator, QCardActions, QBtn, QIcon } from 'quasar'

export default {
  props: {
    pickup: {
      required: true
    }
  },
  components: {
    QCardTitle, QCard, QCardMain, QCardSeparator, QCardActions, QBtn, QIcon
  },
  methods: {
    join (event) {
      this.$emit('join')
    },
    leave (event) {
      this.$emit('leave')
    }
  }
}
</script>

<style scoped lang="stylus">
$lightRed = #FFF5F5
$lightGreen = #F8FFF0
$lighterGreen = #F8FFF8

.content
  width 100%
  .padding
    padding 1em
    h5, p
      display inline
    p 
      margin-left .5em
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