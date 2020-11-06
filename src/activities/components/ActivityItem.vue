<template>
  <QCard
    :class="{ full: activity.isFull }"
    @click.native.stop="detail"
  >
    <QCardSection
      class="no-padding content"
      :class="{ isEmpty: activity.isEmpty, isUserMember: activity.isUserMember, isDisabled: activity.isDisabled }"
    >
      <div class="q-pa-sm full-width">
        <div>
          <span class="featured-text">
            {{ $d(activity.date, 'hourMinute') }}
            <template v-if="activity.hasDuration"> &mdash; {{ $d(activity.dateEnd, 'hourMinute') }}</template>
          </span>
          <template v-if="placeLink">
            <strong v-if="activity.place">
              <RouterLink :to="{ name: 'place', params: { placeId: activity.place.id }}">
                {{ activity.place.name }}
              </RouterLink>
            </strong> {{ $d(activity.date, 'dateWithDayName') }}
          </template>
          <template v-else>
            {{ $d(activity.date, 'dateLongWithDayName') }}
          </template>
          <span>
            <strong>{{ $t('CONVERSATION.OPEN') }} <QIcon name="chat" /></strong>
          </span>
        </div>
        <div
          v-if="activity.isDisabled"
          class="q-my-xs"
        >
          <b class="text-negative">{{ $t('ACTIVITYLIST.ACTIVITY_DISABLED') }}</b>
        </div>
        <div
          v-if="activity.hasStarted"
          class="q-my-xs"
        >
          <b class="text-orange">{{ $t('ACTIVITYLIST.ACTIVITY_STARTED') }}</b>
        </div>
        <!-- eslint-disable vue/multiline-html-element-content-newline -->
        <div
          v-if="activity.description"
          class="q-my-xs multiline"
        >{{ activity.description }}</div>
        <!-- eslint-enable vue/multiline-html-element-content-newline -->
        <div class="q-my-xs full-width">
          <ActivityUsers :activity="activity" />
        </div>
      </div>
    </QCardSection>
  </QCard>
</template>

<script>
import {
  QCard,
  QCardSection,
  QIcon,
} from 'quasar'
import ActivityUsers from './ActivityUsers'

export default {
  components: {
    QCard,
    QCardSection,
    QIcon,
    ActivityUsers,
  },
  props: {
    activity: {
      type: Object,
      required: true,
    },
    placeLink: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    detail (event) {
      if (event.target.closest('a')) return // ignore actual links
      this.$emit('detail', this.activity)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.content
  width 100%
  font-size .8em
  cursor pointer
  transition background-color 2s ease

  .featured-text
    display inline
    margin-right .5em
    font-size 1.5em

  &.isEmpty:not(.isDisabled)
    background repeating-linear-gradient(
      135deg,
      white,
      white 15px,
      $lightRed 15px,
      $lightRed 30px
    )

  &.isUserMember
    &:not(.isDisabled)
      background linear-gradient(to right, $lightGreen, $lighterGreen)

  &.isDisabled
    background $lightRed
</style>
