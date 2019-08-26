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
    <QMenu>
      <QList>
        <template v-if="user && !user.mailVerified">
          <QItem
            v-close-popup
            :to="{ name: 'settings', hash: '#change-email' }"
          >
            <QItemSection side>
              <QIcon
                color="negative"
                name="fas fa-fw fa-exclamation-triangle"
              />
            </QItemSection>
            <QItemSection>
              {{ $t('WALL.VERIFY_EMAIL_FOR_NOTIFICATIONS') }}
            </QItemSection>
          </QItem>
          <QSeparator />
        </template>
        <QItemLabel
          v-t="'NOTIFICATION_TOGGLE.HEADER'"
          header
        />
        <QItem
          v-for="o in options"
          :key="o.id"
          v-close-popup
          :class="o.selected ? 'bg-grey-2' : ''"
          clickable
          @click="select(o)"
        >
          <QItemSection side>
            <QIcon
              :color="o.color"
              :name="o.icon"
            />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              {{ o.label }}
            </QItemLabel>
            <QItemLabel caption>
              {{ o.sublabel }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </QMenu>
  </QBtn>
</template>

<script>
import {
  QMenu,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QSeparator,
} from 'quasar'

export default {
  components: {
    QMenu,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QSeparator,
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
