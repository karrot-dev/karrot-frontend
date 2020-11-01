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
          <QMenu>
            <div class="q-pa-md text-center">
              <p>{{ info.title }}</p>
              <QBtn
                type="a"
                flat
                :href="info.link.href"
              >
                {{ info.link.text }}
              </QBtn>
            </div>
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
