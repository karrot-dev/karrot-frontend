<template>
  <QList dense>
    <QItem
      v-for="{ label, icon, to, handler, badge, info } in entries"
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
        v-if="info"
        side
      >
        <QBtn
          size="sm"
          round
          flat
          color="green"
          icon="fas fa-question-circle"
          :title="info.title"
        >
          <QMenu
            square
            dark
            max-width="280px"
            content-class="q-pa-md text-center bg-primary"
          >
            <p class="text-h5">
              {{ info.title }}
            </p>
            <p>{{ info.description }}</p>
            <QBtn
              type="a"
              flat
              :href="info.link.href"
              target="_blank"
            >
              {{ info.link.text }}
            </QBtn>
          </QMenu>
        </QBtn>
      </QItemSection>
      <QItemSection
        v-if="badge && badge.condition"
        side
      >
        <QBadge
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
  QBtn,
  QMenu,
  QBadge,
} from 'quasar'

export default {
  components: {
    QList,
    QItem,
    QItemSection,
    QIcon,
    QBtn,
    QMenu,
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
