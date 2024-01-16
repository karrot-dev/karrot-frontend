<template>
  <QList dense>
    <QItem
      v-for="{ label, icon, to, handler, meet, badge, info } in entries"
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
      <QItemSection side>
        <InfoPopup
          v-if="info"
          :tooltip="info.title"
          :title="info.title"
          :description="info.description"
          :info-link="{ text: info.link.text, href: info.link.href }"
        />
        <MeetButton
          v-if="meet"
          color="green"
          sidenav
          :subject="meet"
        />
        <QBadge
          v-if="badge && badge.count > 0"
          :color="badge.color"
          :text-color="badge.textColor"
          :title="badge.title"
        >
          {{ badge.count }}
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

import MeetButton from '@/meet/components/MeetButton.vue'
import InfoPopup from '@/utils/components/InfoPopup.vue'

export default {
  components: {
    MeetButton,
    InfoPopup,
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
