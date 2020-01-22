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
          :text-color="badge.textColor"
          :title="badge.title"
        >
          {{ badge.label }}
        </QBadge>
      </QItemSection>
    </QItem>
  </QList>
</template>

<script>
import {
  QList,
  QItem,
  QItemSection,
  QIcon,
  QBadge,
} from 'quasar'

export default {
  components: {
    QList,
    QItem,
    QItemSection,
    QIcon,
    QBadge,
  },
  props: {
    entries: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
