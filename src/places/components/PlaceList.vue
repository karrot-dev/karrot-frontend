<template>
  <QList
    class="no-padding"
  >
    <QItem
      v-for="place in sortedPlaces"
      :key="place.id"
      :to="linkParamsFor(place)"
      :class="{'router-link-active': place.isActivePlace}"
      dense
    >
      <QItemSection side>
        <QIcon
          :name="place.ui.icon"
          :color="place.ui.color"
          :title="$t(place.ui.label)"
          size="1.1em"
        />
      </QItemSection>
      <QItemSection>
        <QItemLabel
          class="items-baseline"
        >
          {{ place.name }}
          <QIcon
            v-if="place.isSubscribed"
            name="fas fa-fw fa-star"
            class="vertical-baseline"
            color="secondary"
          />
        </QItemLabel>
      </QItemSection>
      <QItemSection
        v-if="place.conversationUnreadCount > 0"
        side
      >
        <QChip
          small
          color="secondary"
        >
          {{ place.conversationUnreadCount > 99 ? '99+' : place.conversationUnreadCount }}
        </QChip>
      </QItemSection>
    </QItem>

    <QItem
      v-if="!hasPlaces && isEditor"
      :to="{ name: 'placeCreate', params: { groupId } }"
      class="bg-secondary"
      multiline
    >
      <QItemSection class="text-center">
        <QItemTile
          icon="add circle"
          class="text-white"
        />
        <QTooltip v-t="'BUTTON.CREATE'" />
      </QItemSection>
    </QItem>

    <QSeparator v-if="archived.length > 0" />

    <QExpansionItem
      v-if="archived.length > 0 && isEditor"
      icon="fas fa-trash-alt"
      :label="`${$t('STORESTATUS.ARCHIVED')} (${archived.length})`"
    >
      <QItem
        v-for="place in archived"
        :key="place.id"
        :to="linkParamsFor(place)"
      >
        <QItemSection>
          <QItemLabel>
            {{ place.name }}
          </QItemLabel>
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
  QItemLabel,
  QIcon,
  QTooltip,
  QExpansionItem,
  QSeparator,
  QChip,
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: {
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    QTooltip,
    QExpansionItem,
    QSeparator,
    QChip,
  },
  props: {
    groupId: { default: null, type: Number },
    places: { required: true, type: Array },
    archived: { default: () => [], type: Array },
    linkTo: { default: 'place', type: String },
  },
  computed: {
    sortedPlaces () {
      const subscribed = this.places.filter(e => e.isSubscribed)
      const notSubscribed = this.places.filter(e => !e.isSubscribed)
      return subscribed.concat(notSubscribed)
    },
    hasPlaces () {
      return this.places && this.places.length > 0
    },
    ...mapGetters({
      isEditor: 'currentGroup/isEditor',
    }),
  },
  methods: {
    linkParamsFor (place) {
      return {
        name: this.linkTo,
        params: {
          groupId: place.group.id,
          placeId: place.id,
        },
      }
    },
  },
}
</script>
