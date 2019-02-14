<template>
  <div v-if="place">
    <QCard class="no-shadow no-padding grey-border">
      <RandomArt
        :seed="placeId"
        type="banner"
      />
      <div class="generic-padding">

        <div class="actionButtons">
          <RouterLink
            v-if="isEditor"
            :to="{name: 'placePickupsManage', params: { placeId }}"
          >
            <QBtn
              small
              round
              color="secondary"
              icon="fas fa-calendar-alt"
              class="hoverScale"
            >
              <QTooltip v-t="'STOREDETAIL.MANAGE'" />
            </QBtn>
          </RouterLink>
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
      </div>
    </QCard>

    <PickupList
      :pickups="pickups"
      @join="join"
      @leave="leave"
      @detail="detail"
    />
    <KNotice v-if="isInactive">
      <template slot="icon">
        <i class="far fa-handshake"/>
      </template>
      {{ $t('STOREDETAIL.INACTIVE') }}
      <RouterLink
        v-if="isEditor"
        slot="desc"
        :to="{name: 'placeEdit', params: { placeId }}"
      >
        {{ $t('STOREDETAIL.CHANGE_STATUS') }}
      </RouterLink>
    </KNotice>
    <KNotice v-else-if="hasNoPickups" >
      <template slot="icon">
        <i class="fas fa-bed"/>
      </template>
      {{ $t('PICKUPLIST.NONE') }}
      <RouterLink
        v-if="isEditor"
        slot="desc"
        :to="{name: 'placePickupsManage', params: { placeId }}"
      >
        {{ $t('PICKUPLIST.STORE_NONE_HINT') }}
      </RouterLink>
    </KNotice>
  </div>
</template>

<script>
import PickupList from '@/pickups/components/PickupList'
import KNotice from '@/utils/components/KNotice'
import Markdown from '@/utils/components/Markdown'
import StandardMap from '@/maps/components/StandardMap'
import RandomArt from '@/utils/components/RandomArt'

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
} from 'quasar'

export default {
  components: {
    PickupList,
    QCard,
    QBtn,
    QTooltip,
    KNotice,
    Markdown,
    StandardMap,
    RandomArt,
  },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
      detail: 'detail/openForPickup',
    }),
  },
  computed: {
    markers () {
      return this.place ? [placeMarker(this.place)] : []
    },
    ...mapGetters({
      place: 'places/activePlace',
      pickups: 'pickups/byActivePlace',
      currentUser: 'auth/user',
      isEditor: 'currentGroup/isEditor',
    }),
    hasNoPickups () {
      return this.pickups && this.pickups.length === 0
    },
    isInactive () {
      return this.place && this.place.status !== 'active'
    },
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
    placeId () {
      return this.place && this.place.id
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
