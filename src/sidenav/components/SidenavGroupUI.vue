<template>
  <SidenavBox v-if="groupId">
    <template #icon>
      <QIcon name="fas fa-fw fa-home" />
    </template>
    <template #name>
      {{ $t('GROUP.HOME') }}
    </template>
    <template #tools>
      <div>
        <QBtn
          flat
          dense
          round
          size="sm"
          :to="{ name: 'groupDescription', params: { groupId } }"
          :title="$t('GROUP.DESCRIPTION')"
        >
          <QIcon name="fas fa-info-circle fa-fw" />
        </QBtn>
        <QBtn
          flat
          dense
          round
          size="sm"
        >
          <QIcon name="fas fa-fw fa-ellipsis-v" />
          <QMenu
            fit
            anchor="bottom right"
            self="top right"
          >
            <GroupOptions />
          </QMenu>
        </QBtn>
      </div>
    </template>
    <SidenavMenu :entries="entries" />
    <SidenavMenu
      v-if="showMore"
      :entries="entriesMore"
    />
    <QItem
      v-if="entriesMore.length > 0"
      clickable
      dense
      class="more-button"
      @click="showMore = !showMore"
    >
      <QItemSection
        side
        class="text-center"
      >
        <QIcon
          :name="showMore ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
          size="1.1em"
        />
      </QItemSection>
      <QItemSection>
        {{ showMore ? $t('BUTTON.SHOW_LESS') : $t('BUTTON.SHOW_MORE') }}
      </QItemSection>
      <QItemSection
        v-if="!showMore"
        side
      >
        <QBadge
          v-if="showMoreBadgeCount > 0"
          :label="showMoreBadgeCount"
          color="blue"
        />
      </QItemSection>
    </QItem>
  </SidenavBox>
</template>

<script>
import {
  QBtn,
  QIcon,
  QMenu,
  QItem,
  QItemSection,
  QBadge,
} from 'quasar'
import { computed } from 'vue'

import { useSidenavMenuEntries } from '@/sidenav/use'

import GroupOptions from './GroupOptions.vue'
import SidenavBox from './SidenavBox.vue'
import SidenavMenu from './SidenavMenu.vue'

export default {
  components: {
    SidenavBox,
    SidenavMenu,
    GroupOptions,
    QBtn,
    QIcon,
    QMenu,
    QItem,
    QItemSection,
    QBadge,
  },
  props: {
    groupId: {
      default: null,
      type: Number,
    },
    theme: {
      type: String,
      default: null,
    },
    features: {
      default: () => [],
      type: Array,
    },
    wallUnreadCount: {
      default: 0,
      type: Number,
    },
    feedbackPossibleCount: {
      default: 0,
      type: Number,
    },
    pendingApplicationCount: {
      default: 0,
      type: Number,
    },
    ongoingIssueCount: {
      default: 0,
      type: Number,
    },
  },
  setup () {
    const allEntries = useSidenavMenuEntries()
    const entries = computed(() => allEntries.value.filter(entry => !entry.more))
    const entriesMore = computed(() => allEntries.value.filter(entry => entry.more))
    return { entries, entriesMore }
  },
  data () {
    return {
      showMore: false,
    }
  },
  computed: {
    cappedWallUnreadCount () {
      return this.wallUnreadCount > 99 ? '99+' : this.wallUnreadCount
    },
    // Total count of things inside the "show more" section that have a numeric badge...
    showMoreBadgeCount () {
      return this.entriesMore.reduce((sum, entry) => sum + (entry.badge?.count || 0), 0)
    },
  },
  methods: {
    hasFeature (feature) {
      return this.features.includes(feature)
    },
  },
}
</script>

<style lang="sass" scoped>
.more-button:hover
  opacity: .6

  ::v-deep(.q-focus-helper)
    background: none !important
</style>
