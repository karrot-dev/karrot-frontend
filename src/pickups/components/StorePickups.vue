<template>
  <div v-if="store">
    <q-card class="no-shadow no-padding grey-border">
      <RandomArt
        :seed="storeId"
        type="banner"/>
      <div class="generic-padding">

        <div class="actionButtons">
          <router-link
            v-if="isEditor"
            :to="{name: 'storeEdit', params: { storeId }}"
          >
            <q-btn
              small
              round
              color="secondary"
              icon="fas fa-pencil-alt"
              class="hoverScale"
            >
              <q-tooltip v-t="'STOREDETAIL.EDIT'" />
            </q-btn>
          </router-link>
          <router-link
            v-if="isEditor"
            :to="{name: 'storePickupsManage', params: { storeId }}"
          >
            <q-btn
              small
              round
              color="secondary"
              icon="fas fa-calendar-alt"
              class="hoverScale"
            >
              <q-tooltip v-t="'STOREDETAIL.MANAGE'" />
            </q-btn>
          </router-link>
          <a
            v-if="directionsURL"
            target="_blank"
            rel="noopener nofollow noreferrer"
            :href="directionsURL"
          >
            <q-btn
              small
              round
              color="secondary"
              icon="directions"
              class="hoverScale"
            >
              <q-tooltip v-t="'STOREDETAIL.DIRECTIONS'" />
            </q-btn>
          </a>
        </div>
        <Markdown
          v-if="store.description"
          :source="store.description"
        />
        <i v-else>
          {{ $t("STOREDETAIL.NO_DESCRIPTION") }}
        </i>
        <standard-map
          v-if="$q.platform.is.mobile"
          :markers="markers"
          class="map"
        />
      </div>
    </q-card>

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
      <router-link
        v-if="isEditor"
        slot="desc"
        :to="{name: 'storeEdit', params: { storeId }}"
      >
        {{ $t('STOREDETAIL.CHANGE_STATUS') }}
      </router-link>
    </KNotice>
    <KNotice v-else-if="hasNoPickups" >
      <template slot="icon">
        <i class="fas fa-bed"/>
      </template>
      {{ $t('PICKUPLIST.NONE') }}
      <router-link
        v-if="isEditor"
        slot="desc"
        :to="{name: 'storePickupsManage', params: { storeId }}"
      >
        {{ $t('PICKUPLIST.STORE_NONE_HINT') }}
      </router-link>
    </KNotice>
  </div>
</template>

<script>
import PickupList from '@/pickups/components/PickupList'
import KNotice from '@/utils/components/KNotice'
import Markdown from '@/utils/components/Markdown'
import StandardMap from '@/maps/components/StandardMap'
import RandomArt from '@/utils/components/RandomArt'

import { storeMarker } from '@/maps/components/markers'
import directions from '@/maps/directions'

import {
  mapGetters,
  mapActions,
} from 'vuex'

import { QCard, QCardTitle, QCardActions, QItem, QItemMain, QItemSide, QBtn, QTabs, QRouteTab, QIcon, QTooltip } from 'quasar'

export default {
  components: { PickupList, QCard, QCardTitle, QCardActions, QItem, QItemMain, QItemSide, QBtn, QTabs, QRouteTab, QIcon, QTooltip, KNotice, Markdown, StandardMap, RandomArt },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
      detail: 'detail/openForPickup',
    }),
  },
  computed: {
    markers () {
      return this.store ? [storeMarker(this.store)] : []
    },
    ...mapGetters({
      store: 'stores/activeStore',
      pickups: 'pickups/byActiveStore',
      currentUser: 'auth/user',
      isEditor: 'currentGroup/isEditor',
    }),
    hasNoPickups () {
      return this.pickups && this.pickups.length === 0
    },
    isInactive () {
      return this.store && this.store.status !== 'active'
    },
    directionsURL () {
      if (!this.store || !this.store.latitude || !this.store.longitude) return
      if (this.$q.platform.is.ios) {
        return directions.apple(this.store)
      }
      if (this.$q.platform.is.android) {
        return directions.google(this.store)
      }
      return directions.osm(this.currentUser, this.store)
    },
    storeId () {
      return this.store && this.store.id
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
