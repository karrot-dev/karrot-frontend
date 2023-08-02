<template>
  <div
    ref="wrapperDiv"
    class="row justify-start"
  >
    <QResizeObserver
      style="width: 100%"
      @resize="calculateSlotsPerRow"
    />
    <div
      v-for="{ user } in participants"
      :key="'participant' + user.id"
      class="relative-position pic-wrapper"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <div
        v-if="getIsNewcomer(user) && !getIsCurrentUser(user)"
        class="newcomer-box"
        :title="$t('USERDATA.NEWCOMER_GUIDANCE', { userName: user.displayName })"
      />
      <ProfilePicture
        :user="user"
        :size="size"
      />
    </div>

    <template v-if="!readOnly">
      <EmptySlot
        v-for="n in emptySlots"
        :key="n"
        :size="size"
      />

      <div
        v-if="notShownEmptySlotCount > 0"
        class="emptySlots"
        :style="{ width: size + 'px', height: size + 'px' }"
      >
        <div />
        {{ notShownEmptySlotSymbol }}
      </div>
    </template>
  </div>
</template>

<script>
import {
  QResizeObserver,
} from 'quasar'
import { computed } from 'vue'

import { useActivityHelpers } from '@/activities/helpers'
import { useAuthHelpers } from '@/authuser/helpers'
import { useAuthService } from '@/authuser/services'
import { useCurrentGroupService } from '@/group/services'
import { useUserService } from '@/users/services'

import ProfilePicture from '@/users/components/ProfilePicture.vue'

import EmptySlot from './EmptySlot.vue'

export default {
  components: {
    ProfilePicture,
    EmptySlot,
    QResizeObserver,
  },
  props: {
    activity: {
      type: Object,
      required: true,
    },
    participantType: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      default: 36,
    },
    isJoining: {
      type: Boolean,
      default: false,
    },
    isLeaving: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'leave',
    'join',
  ],
  setup (props) {
    const { user: currentUser } = useAuthService()
    const { getIsNewcomer } = useCurrentGroupService()

    const {
      getUserById,
    } = useUserService()

    const {
      getHasStarted,
      getIsFull,
    } = useActivityHelpers()

    const {
      getIsCurrentUser,
    } = useAuthHelpers()

    const hasStarted = computed(() => getHasStarted(props.activity))
    const isFull = computed(() => getIsFull(props.activity))

    const participants = computed(() => props.activity.participants
      .filter(participant => participant.participantType === props.participantType.id)
      .map(participant => ({
        ...participant,
        user: getUserById(participant.user),
      })))

    return {
      hasStarted,
      isFull,
      participants,

      currentUser,

      getIsNewcomer,
      getIsCurrentUser,
    }
  },
  data () {
    return {
      slotsPerRow: 6,
    }
  },
  computed: {
    hasUnlimitedPlaces () {
      return this.maxParticipants === null
    },
    maxParticipants () {
      return this.participantType.maxParticipants
    },
    emptyPlaces () {
      if (this.hasUnlimitedPlaces) {
        return 9999999999
      }
      if (this.participants) {
        return Math.max(this.maxParticipants - this.participants.length, 0)
      }
      return 0
    },
    emptySlots () {
      if (this.participants) {
        const minToShow = Math.min(1, this.emptyPlaces)
        const maxToShow = Math.max(minToShow, this.slotsPerRow - this.participants.length - 1)
        return Math.min(this.emptyPlaces, maxToShow)
      }
      return 0
    },
    notShownEmptySlotCount () {
      return this.emptyPlaces - this.emptySlots
    },
    notShownEmptySlotSymbol () {
      if (this.notShownEmptySlotCount > 99) {
        return this.hasUnlimitedPlaces ? '+ ∞' : '...'
      }
      return `+ ${this.notShownEmptySlotCount}`
    },
  },
  methods: {
    calculateSlotsPerRow () {
      if (this.$refs.wrapperDiv) {
        this.slotsPerRow = Math.floor(this.$refs.wrapperDiv.clientWidth / (this.size + 3.8))
      }
    },
  },
}
</script>

<style scoped lang="sass">
@use 'sass:color'

.pic-wrapper
  margin-right: 3.8px
  margin-bottom: 3.8px

.newcomer-box
  position: absolute
  bottom: -4px
  left: 0
  width: 100%
  height: 8px
  background: linear-gradient(to bottom, $secondary, color.adjust($secondary, $lightness: 50%))

.emptySlots
  display: inline-block
  margin-bottom: 3.8px
  color: grey
  text-align: center
  background-color: rgba(255, 255, 255, 0.7)
  border: 2px dashed lightgrey
  border-radius: 0

  div
    display: inline-block
    height: 100%
    vertical-align: middle
</style>
