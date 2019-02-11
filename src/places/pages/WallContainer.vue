<template>
  <Wall>
    <QBtn
      v-if="isEditor"
      :to="{name: 'placeEdit', params: { groupId: place.group.id, placeId }}"
      round
      color="secondary"
      icon="fas fa-pencil-alt"
      class="hoverScale"
    >
      <QTooltip v-t="'STOREDETAIL.EDIT'" />
    </QBtn>
    <QBtn
      round
      color="white"
      class="hoverScale"
      :icon="selected.icon"
      :text-color="selected.color"
    >
      <QPopover>
        <QList
          link
          v-close-overlay
        >
          <QListHeader
            v-t="'PLACEWALL.SUBSCRIPTION.HEADER'"
          />

          <QItem
            v-for="o in options"
            :key="o.id"
            @click.native="select(o)"
            :class="o.selected ? 'bg-grey-2' : ''"
          >
            <QItemSide
              :color="o.color"
              :icon="o.icon"
            />
            <QItemMain
              :label="o.label"
              :sublabel="o.sublabel"
            />
          </QItem>
        </QList>
      </QPopover>
    </QBtn>
  </Wall>
</template>

<script>
import { mapGetters } from 'vuex'
import Wall from './Wall'

// TODO move into vuex
import placesAPI from '@/places/api/places'

import {
  QBtn,
  QPopover,
  QTooltip,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QListHeader,
} from 'quasar'

export default {
  components: {
    Wall,
    QBtn,
    QPopover,
    QTooltip,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QListHeader,
  },
  computed: {
    ...mapGetters({
      placeId: 'places/activePlaceId',
      place: 'places/activePlace',
      isEditor: 'currentGroup/isEditor',
    }),
    isSubscribed () {
      return this.place.isSubscribed
    },
    options () {
      return [
        {
          id: 'subscribe',
          label: this.$t('PLACEWALL.SUBSCRIPTION.YES'),
          sublabel: this.$t('PLACEWALL.SUBSCRIPTION.YES_TEXT'),
          icon: 'fas fa-fw fa-star',
          color: 'secondary',
          selected: this.isSubscribed,
        },
        {
          id: 'unsubscribe',
          label: this.$t('PLACEWALL.SUBSCRIPTION.NO'),
          sublabel: this.$t('PLACEWALL.SUBSCRIPTION.NO_TEXT'),
          icon: 'fas fa-fw fa-star',
          color: 'grey',
          selected: !this.isSubscribed,
        },
      ]
    },
    selected () {
      return this.options.find(o => o.selected)
    },
  },
  methods: {
    select (option) {
      if (option.id === 'subscribe') {
        placesAPI.subscribe(this.placeId)
      }
      else {
        placesAPI.unsubscribe(this.placeId)
      }
    },
  },
}
</script>
