<template>
  <QList
    highlight
    no-border
    class="no-padding"
  >
    <QItem
      v-for="place in places"
      :key="place.id"
      link
      :to="linkParamsFor(place)"
    >
      <QItemSide class="text-center">
        <QIcon
          :name="place.ui.icon"
          :color="place.ui.color"
          :title="$t(place.ui.label)"
        />
      </QItemSide>
      <QItemMain>
        <QItemTile label>
          {{ place.name }}
        </QItemTile>
      </QItemMain>
      <QItemSide
        v-if="place.isSubscribed"
        class="text-center"
        right
      >
        <QIcon
          name="fas fa-fw fa-star"
          color="secondary"
        />
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
  },
  props: {
    groupId: { default: null, type: Number },
    places: { required: true, type: Array },
    archived: { default: () => [], type: Array },
    linkTo: { default: 'place', type: String },

  },
  computed: {
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
