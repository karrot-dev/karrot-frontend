<template>
  <q-card :class="{ full: pickup.isFull }">
    <q-card-main
      class="row no-padding justify-between content"
      :class="{ isEmpty: pickup.isEmpty, isUserMember: pickup.isUserMember }"
    >
      <div class="column padding full-width">
        <div>
          <span class="featured-text">{{ $d(pickup.date, 'timeShort') }}</span>
          <slot>Date or Store Slot</slot>
          <template v-if="pickup.isUserMember">
            <router-link
              v-if="$q.platform.is.mobile"
              :to="{ name: 'pickupDetail', params: { pickupId: pickup.id }}"
            >
              <strong>Open Chat <q-icon name="chat" /></strong>
            </router-link>
            <a
              v-else
              href="#"
              @click="$emit('detail', { pickupId: pickup.id })"
            >
              <strong>Open Chat <q-icon name="chat" /></strong>
            </a>
          </template>
        </div>
        <div
          class="description multiline"
          v-if="pickup.description"
        >{{ pickup.description }}
        </div>
        <div class="people full-width">
          <PickupUsers
            v-if="pickup.isUserMember"
            :pickup="pickup"
            @leave="leave"
          />
          <PickupUsers
            v-else
            :pickup="pickup"
            @join="join"
          />
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import { Dialog, QCard, QCardMain, QBtn, QIcon } from 'quasar'
import PickupUsers from './PickupUsers'

export default {
  props: {
    pickup: {
      type: Object,
      required: true,
    },
  },
  components: {
    QCard, QCardMain, QBtn, QIcon, PickupUsers,
  },
  methods: {
    join () {
      Dialog.create({
        title: this.$t('PICKUPLIST.ITEM.JOIN_CONFIRMATION_HEADER'),
        message: this.$t('PICKUPLIST.ITEM.JOIN_CONFIRMATION_TEXT', {date: this.$d(this.pickup.date, 'long')}),
        ok: this.$t('BUTTON.OF_COURSE'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('join', this.pickup.id))
        .catch(() => {})
    },
    leave () {
      Dialog.create({
        title: this.$t('PICKUPLIST.ITEM.LEAVE_CONFIRMATION_HEADER'),
        message: this.$t('PICKUPLIST.ITEM.LEAVE_CONFIRMATION_TEXT'),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('leave', this.pickup.id))
        .catch(() => {})
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
</style>
