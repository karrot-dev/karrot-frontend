<template>
  <QList dense>
    <QItem
      v-for="{ label, icon, to, handler, badge } in entries"
      :key="label"
      :to="to"
      clickable
      @click="handler && handler()"
    >
      <QItemSection
        side
        class="text-center"
      >
        <QIcon
          :name="icon"
          size="1.1em"
        />
      </QItemSection>
      <QItemSection>
        {{ label }}
      </QItemSection>
      <QItemSection
        v-if="badge && badge.condition"
        side
      >
        <QBadge
          small
          :color="badge.color"
          :title="badge.title"
        >
          {{ badge.label }}
        </QBadge>
      </QItemSection>
    </QItem>
    <QExpansionItem
      switch-toggle-side
      :label="$t('BUTTON.SHOW_MORE')"
      dense
      dense-toggle
      expand-separator
    >
      <QItem
        v-for="{ label, icon, to, handler, badge } in entriesmore"
        :key="label"
        :to="to"
        dense
        clickable
        @click="handler && handler()"
      >
        <QItemSection
          side
          class="text-center"
        >
          <QIcon
            :name="icon"
            size="1.1em"
          />
        </QItemSection>
        <QItemSection>
          {{ label }}
        </QItemSection>
        <QItemSection
          v-if="badge && badge.condition"
          side
        >
          <QBadge
            small
            :color="badge.color"
            :title="badge.title"
          >
            {{ badge.label }}
          </QBadge>
        </QItemSection>
      </QItem>
    </QExpansionItem>
  </QList>
</template>

<script>
import {
  QList,
  QItem,
  QItemSection,
  QExpansionItem,
  QIcon,
  QBadge,
} from 'quasar'

export default {
  components: {
    QList,
    QItem,
    QItemSection,
    QExpansionItem,
    QIcon,
    QBadge,
  },
  props: {
    entries: {
      type: Array,
      default: () => [],
    },
    entriesmore: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
