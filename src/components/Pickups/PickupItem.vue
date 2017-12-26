<template>
  <q-card :class="{ full: pickup.isFull }">
    <q-card-main
      class="row inline no-padding justify-between content"
      :class="{ isEmpty: pickup.isEmpty, isUserMember: pickup.isUserMember }"
    >
      <div class="column padding full-width">
        <div>
          <span class="featured-text">{{ $d(pickup.date, 'timeShort') }}</span>
          <slot>Date or Store Slot</slot>
        </div>
        <div
          class="description multiline"
          v-if="pickup.description"
        >
          {{ pickup.description }}
        </div>
        <div class="people full-width">
          <PickupUsers
            :pickup="pickup"
            @join="button.click()"
            @leave="button.click()"
          />
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import { Dialog, QCard, QCardMain, QBtn } from 'quasar'
import PickupUsers from './PickupUsers'

export default {
  props: {
    pickup: {
      type: Object,
      required: true,
    },
  },
  components: {
    QCard, QCardMain, QBtn, PickupUsers,
  },
  methods: {
    join () {
      Dialog.create({
        title: this.$t('PICKUPLIST.ITEM.JOIN_CONFIRMATION_HEADER'),
        message: this.$t('PICKUPLIST.ITEM.JOIN_CONFIRMATION_TEXT', {date: this.$d(this.pickup.date, 'long')}),
        buttons: [
          this.$t('BUTTON.CANCEL'),
          {
            label: this.$t('BUTTON.OF_COURSE'),
            handler: () => {
              this.$emit('join', this.pickup.id)
            },
          },
        ],
      })
    },
    leave () {
      Dialog.create({
        title: this.$t('PICKUPLIST.ITEM.LEAVE_CONFIRMATION_HEADER'),
        message: this.$t('PICKUPLIST.ITEM.LEAVE_CONFIRMATION_TEXT'),
        buttons: [
          this.$t('BUTTON.CANCEL'),
          {
            label: this.$t('BUTTON.YES'),
            handler: () => {
              this.$emit('leave', this.pickup.id)
            },
          },
        ],
      })
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
          click: () => console.log('what??'),
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
  transition: background-color 2s ease
  width 100%
  font-size: .8em
  .padding
    padding 7px
    .featured-text
      font-size 1.5em
      display inline
      margin-right .5em
  .people
    padding: .3em
.description
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
