<template>
  <QBtn
    round
    :dense="inToolbar"
    :flat="inToolbar"
    :color="inToolbar ? 'white' : selected.color"
    :size="size"
    :title="$t('NOTIFICATION_TOGGLE.HEADER')"
  >
    <QIcon
      :name="selected.icon"
    />
    <QPopover>
      <QList
        v-close-overlay
        link
      >
        <template v-if="user && !user.mailVerified">
          <QItem
            :to="{ name: 'settings', hash: '#change-email' }"
          >
            <QItemSide
              color="negative"
              icon="fas fa-fw fa-exclamation-triangle"
            />
            <QItemMain
              :label="$t('WALL.VERIFY_EMAIL_FOR_NOTIFICATIONS')"
            />
          </QItem>
          <QItemSeparator />
        </template>
        <QListHeader v-t="'NOTIFICATION_TOGGLE.HEADER'" />
        <QItem
          v-for="o in options"
          :key="o.id"
          :class="o.selected ? 'bg-grey-2' : ''"
          @click.native="select(o)"
        >
          <QItemSide
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
    muted: {
      type: Boolean,
      default: true,
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
          id: 'all',
          label: this.$t('NOTIFICATION_TOGGLE.ALL'),
          sublabel: this.$t('NOTIFICATION_TOGGLE.ALL_TEXT'),
          icon: 'fas fa-fw fa-bell',
          color: 'secondary',
          selected: this.isParticipant && !this.muted,
        },
        {
          id: 'muted',
          label: this.$t('NOTIFICATION_TOGGLE.SOME'),
          sublabel: this.$t('NOTIFICATION_TOGGLE.SOME_TEXT'),
          icon: 'fas fa-fw fa-bell-slash',
          color: 'grey-8',
          selected: this.muted,
        },
        {
          id: 'none',
          label: this.$t('NOTIFICATION_TOGGLE.NONE'),
          sublabel: this.$t('NOTIFICATION_TOGGLE.NONE_TEXT'),
          icon: 'fas fa-fw fa-eye-slash',
          color: 'grey-5',
          selected: !this.isParticipant,
        },
      ].filter(o => o.id === 'none' ? this.canUnsubscribe : true)
    },
    selected () {
      return this.options.find(o => o.selected)
    },
  },
  methods: {
    select (option) {
      this.$emit('set', {
        notifications: option.id,
      })
    },
  },
}
</script>
