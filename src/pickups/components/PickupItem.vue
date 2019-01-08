<template>
  <QCard
    :class="{ full: pickup.isFull }"
    @click.native.stop="detailIfMember"
  >
    <QCardMain
      class="row no-padding justify-between content"
      :class="{ isEmpty: pickup.isEmpty, isUserMember: pickup.isUserMember, isDisabled: pickup.isDisabled }"
    >
      <div class="column q-pa-sm full-width">
        <div>
          <span class="featured-text">{{ $d(pickup.date, 'hourMinute') }}</span>
          <template v-if="storeLink">
            <strong v-if="pickup.store">
              <RouterLink :to="{ name: 'store', params: { storeId: pickup.store.id }}">
                {{ pickup.store.name }}
              </RouterLink>
            </strong> {{ $d(pickup.date, 'dateWithDayName') }}
          </template>
          <template v-else>
            {{ $d(pickup.date, 'dateLongWithDayName') }}
          </template>
          <template v-if="pickup.isUserMember">
            <span>
              <strong>{{ $t('CONVERSATION.OPEN') }} <QIcon name="chat" /></strong>
            </span>
          </template>
        </div>
        <div
          v-if="pickup.isDisabled"
          class="q-my-xs"
        >
          <b class="text-negative">{{ $t('PICKUPLIST.PICKUP_DISABLED') }}</b>
        </div>
        <div
          v-if="pickup.hasStarted"
          class="q-my-xs"
        >
          <b class="text-orange">{{ $t('PICKUPLIST.PICKUP_STARTED') }}</b>
        </div>
        <div
          class="q-my-xs multiline"
          v-if="pickup.description"
        >{{ pickup.description }}
        </div>
        <div class="q-my-xs full-width">
          <PickupUsers
            :pickup="pickup"
            @leave="leave"
            @join="join"
          />
        </div>
      </div>
    </QCardMain>
  </QCard>
</template>

<script>
import {
  Dialog,
  QCard,
  QCardMain,
  QIcon,
} from 'quasar'
import PickupUsers from './PickupUsers'

export default {
  props: {
    pickup: {
      type: Object,
      required: true,
    },
    storeLink: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    QCard,
    QCardMain,
    QIcon,
    PickupUsers,
  },
  methods: {
    join () {
      Dialog.create({
        title: this.$t('PICKUPLIST.ITEM.JOIN_CONFIRMATION_HEADER'),
        message: this.$t('PICKUPLIST.ITEM.JOIN_CONFIRMATION_TEXT', { date: this.$d(this.pickup.date, 'long') }),
        ok: this.$t('BUTTON.OF_COURSE'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('join', this.pickup.id))
        .catch(() => {})
    },
    leave () {
      console.log(this.pickup.hasStarted)
      if (!this.pickup.hasStarted) {
        Dialog.create({
          title: this.$t('PICKUPLIST.ITEM.LEAVE_CONFIRMATION_HEADER'),
          message: this.$t('PICKUPLIST.ITEM.LEAVE_CONFIRMATION_TEXT'),
          ok: this.$t('BUTTON.YES'),
          cancel: this.$t('BUTTON.CANCEL'),
        })
          .then(() => this.$emit('leave', this.pickup.id))
          .catch(() => {})
      }
    },
    detailIfMember (event) {
      if (!this.pickup.isUserMember) return
      if (event.target.closest('a')) return // ignore actual links
      this.$emit('detail', this.pickup)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.content
  transition: background-color 2s ease
  width 100%
  font-size: .8em
  .featured-text
    font-size 1.5em
    display inline
    margin-right .5em
  &.isEmpty:not(.isDisabled)
    background repeating-linear-gradient(
      135deg,
      white,
      white 15px,
      $lightRed 15px,
      $lightRed 30px
    )
  &.isUserMember
    cursor pointer
    &:not(.isDisabled)
      background linear-gradient(to right, $lightGreen, $lighterGreen)
  &.isDisabled
    background $lightRed
</style>
