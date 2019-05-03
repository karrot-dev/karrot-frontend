<template>
  <QList
    highlight
    no-border
    class="no-padding"
  >
    <QItem
      v-for="place in sortedPlaces"
      :key="place.id"
      link
      :to="linkParamsFor(place)"
      :class="{'router-link-active': place.isActivePlace}"
    >
      <QItemSide class="text-center">
        <QIcon
          :name="place.ui.icon"
          :color="place.ui.color"
          :title="$t(place.ui.label)"
        />
      </QItemSide>
      <QItemMain>
        <QItemTile
          label
          class="items-baseline"
        >
          {{ place.name }}
          <QIcon
            v-if="place.isSubscribed"
            name="fas fa-fw fa-star"
            class="vertical-baseline"
            color="secondary"
          />
        </QItemTile>
      </QItemMain>
      <QItemSide
        v-if="place.conversationUnreadCount > 0"
        right
      >
        <QChip
          small
          color="secondary"
        >
          {{ place.conversationUnreadCount > 99 ? '99+' : place.conversationUnreadCount }}
        </QChip>
      </QItemSide>
    </QItem>

    <QItem
      v-if="!hasPlaces && isEditor"
      link
      :to="{ name: 'placeCreate', params: { groupId } }"
      class="bg-secondary"
      multiline
    >
      <QItemMain class="text-center">
        <QItemTile
          icon="add circle"
          class="text-white"
        />
        <QTooltip v-t="'BUTTON.CREATE'" />
      </QItemMain>
    </QItem>

    <QItemSeparator v-if="archived.length > 0" />

    <QCollapsible
      v-if="archived.length > 0 && isEditor"
      icon="fas fa-trash-alt"
      :label="`${$t('STORESTATUS.ARCHIVED')} (${archived.length})`"
    >
      <QItem
        v-for="place in archived"
        :key="place.id"
        link
        :to="linkParamsFor(place)"
      >
        <QItemMain>
          <QItemTile label>
            {{ place.name }}
          </QItemTile>
        </QItemMain>
      </QItem>
    </QCollapsible>
  </QList>
</template>

<script>
import {
  QList,
  QItem,
  QItemMain,
  QItemTile,
  QItemSide,
  QIcon,
  QTooltip,
  QCollapsible,
  QItemSeparator,
  QChip,
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: {
    QList,
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
    QIcon,
    QTooltip,
    QCollapsible,
    QItemSeparator,
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
