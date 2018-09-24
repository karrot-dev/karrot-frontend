<template>
  <q-card
    :class="{ full: pickup.isFull }"
    @click.native.stop="detailIfMember"
  >
    <q-card-main
      class="row no-padding justify-between content"
      :class="{ isEmpty: pickup.isEmpty, isUserMember: pickup.isUserMember }"
    >
      <div class="column padding full-width">
        <div>
          <span class="featured-text">{{ $d(pickup.date, 'timeShort') }}</span>
          <template v-if="storeLink">
            <strong v-if="pickup.store">
              <router-link :to="{ name: 'store', params: { storeId: pickup.store.id }}">
                {{ pickup.store.name }}
              </router-link>
            </strong> {{ $d(pickup.date, 'dateWithDayName') }}
          </template>
          <template v-else>
            {{ $d(pickup.date, 'dateLongWithDayName') }}
          </template>
          <template v-if="pickup.isUserMember">
            <span>
              <strong>{{ $t('CONVERSATION.OPEN') }} <q-icon name="chat" /></strong>
            </span>
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
    storeLink: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    QCard, QCardMain, QBtn, QIcon, PickupUsers,
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
      Dialog.create({
        title: this.$t('PICKUPLIST.ITEM.LEAVE_CONFIRMATION_HEADER'),
        message: this.$t('PICKUPLIST.ITEM.LEAVE_CONFIRMATION_TEXT'),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('leave', this.pickup.id))
        .catch(() => {})
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
  cursor pointer
</style>
