<template>
  <QBtn
    round
    :dense="inToolbar"
    :flat="inToolbar"
    :color="inToolbar ? 'white' : selected.color"
    :size="size"
  >
    <QIcon
      :name="selected.icon"
    />
    <QPopover>
      <QList
        link
        v-close-overlay
      >
        <template v-if="user && !user.mailVerified">
          <QItem
            :to="{ name: 'settings', hash: '#change-email' }"
          >
            <QItemSide
              color="negative"
              class="text-align: center"
              icon="fas fa-fw fa-exclamation-triangle"
            />
            <QItemMain
              :label="$t('WALL.VERIFY_EMAIL_FOR_NOTIFICATIONS')"
            />
          </QItem>
          <QItemSeparator />
        </template>
        <QListHeader>
          How do you want to receive notifications about new messages in this conversation/thread?
        </QListHeader>

        <QItem
          v-for="o in options"
          :key="o.id"
          @click.native="select(o)"
          :class="o.selected ? 'bg-grey-2' : ''"
        >
          <QItemSide
            class="text-align: center"
            :color="o.color"
            :icon="o.icon"
          />
          <QItemMain
            :label="o.label"
            :sublabel="o.sublabel"
          />
        </QItem>
      </QList>
    </QPopover>
  </QBtn>
</template>

<script>
import {
  QPopover,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QListHeader,
  QItemSeparator,
} from 'quasar'

export default {
  components: {
    QPopover,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QListHeader,
    QItemSeparator,
  },
  props: {
    isWatched: {
      type: Boolean,
      default: false,
    },
    isParticipant: {
      type: Boolean,
      default: false,
    },
    canUnsubscribe: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Object,
      default: null,
    },
    inToolbar: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: null,
    },
  },
  computed: {
    options () {
      return [
        {
          id: 'watched',
          label: 'all',
          sublabel: 'Via app/website, email and push notifications.',
          icon: 'fas fa-fw fa-bell',
          color: 'secondary',
          selected: this.isWatched,
        },
        {
          id: 'muted',
          label: 'some',
          sublabel: 'Via app/website.',
          icon: 'fas fa-fw fa-bell-slash',
          color: 'grey-8',
          selected: this.isParticipant && !this.isWatched,
        },
        {
          id: 'unsubscribed',
          label: 'none',
          sublabel: 'No notifications.',
          icon: 'fas fa-fw fa-eye-slash',
          color: 'grey-5',
          selected: !this.isParticipant,
        },
      ].filter(o => o.id === 'unsubscribed' ? this.canUnsubscribe : true)
    },
    selected () {
      return this.options.find(o => o.selected)
    },
  },
  methods: {
    select (option) {
      this.$emit('set', {
        isParticipant: option.id !== 'unsubscribed',
        muted: option.id === 'muted',
      })
    },
  },
}
</script>
