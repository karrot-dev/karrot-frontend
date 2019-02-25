<template>
  <QCard class="no-shadow no-padding grey-border">
    <RandomArt
      :seed="placeId"
      type="banner"
    />
    <div class="generic-padding">
      <div
        v-if="place"
        class="actionButtons"
      >
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
        <QBtn
          v-if="isEditor"
          :to="{name: 'placeEdit', params: { groupId, placeId }}"
          round
          color="secondary"
          icon="fas fa-pencil-alt"
          class="hoverScale"
        >
          <QTooltip v-t="'STOREDETAIL.EDIT'" />
        </QBtn>
        <QBtn
          v-if="isEditor"
          :to="{name: 'placePickupsManage', params: { placeId }}"
          small
          round
          color="secondary"
          icon="fas fa-calendar-alt"
          class="hoverScale"
        >
          <QTooltip v-t="'STOREDETAIL.MANAGE'" />
        </QBtn>
        <a
          v-if="directionsURL"
          target="_blank"
          rel="noopener nofollow noreferrer"
          :href="directionsURL"
        >
          <QBtn
            small
            round
            color="secondary"
            icon="directions"
            class="hoverScale"
          >
            <QTooltip v-t="'STOREDETAIL.DIRECTIONS'" />
          </QBtn>
        </a>
      </div>
      <KSpinner v-show="!place" />
      <template v-if="place">
        <Markdown
          v-if="place.description"
          :source="place.description"
        />
        <i v-else>
          {{ $t("STOREDETAIL.NO_DESCRIPTION") }}
        </i>
        <StandardMap
          v-if="$q.platform.is.mobile"
          :markers="markers"
          class="map"
        />
      </template>
    </div>
  </QCard>
</template>

<script>
import Markdown from '@/utils/components/Markdown'
import StandardMap from '@/maps/components/StandardMap'
import RandomArt from '@/utils/components/RandomArt'
import KSpinner from '@/utils/components/KSpinner'

import { placeMarker } from '@/maps/components/markers'
import directions from '@/maps/directions'

import {
  mapGetters,
  mapActions,
} from 'vuex'

import {
  QCard,
  QBtn,
  QTooltip,
  QPopover,
  QList,
  QListHeader,
  QItem,
  QItemMain,
  QItemSide,
} from 'quasar'

export default {
  components: {
    Markdown,
    StandardMap,
    RandomArt,
    KSpinner,
    QCard,
    QBtn,
    QTooltip,
    QPopover,
    QList,
    QListHeader,
    QItem,
    QItemMain,
    QItemSide,
  },
  computed: {
    markers () {
      return this.place ? [placeMarker(this.place)] : []
    },
    ...mapGetters({
      placeId: 'places/activePlaceId',
      place: 'places/activePlace',
      currentUser: 'auth/user',
      isEditor: 'currentGroup/isEditor',
    }),
    directionsURL () {
      if (!this.place || !this.place.latitude || !this.place.longitude) return
      if (this.$q.platform.is.ios) {
        return directions.apple(this.place)
      }
      if (this.$q.platform.is.android) {
        return directions.google(this.place)
      }
      return directions.osm(this.currentUser, this.place)
    },
    isSubscribed () {
      return this.place && this.place.isSubscribed
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
    groupId () {
      return this.place && this.place.group && this.place.group.id
    },
  },
  methods: {
    ...mapActions({
      subscribe: 'places/subscribe',
      unsubscribe: 'places/unsubscribe',
    }),
    select (option) {
      if (option.id === 'subscribe') {
        this.subscribe(this.placeId)
      }
      else {
        this.unsubscribe(this.placeId)
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.q-btn-round
  margin-bottom .5em
.actionButtons
  margin-top -36px
  float right
  .q-btn
    margin 3px
.textcontent
  margin-top 0
.map
  height: 30vh
</style>
