<template>
  <div>
    <q-card class="no-shadow no-padding grey-border">
      <div class="generic-padding">
        <div class="actionButtons">
          <router-link
            v-if="$store.getters['auth/isEditorInCurrentGroup']"
            :to="{name: 'storeEdit', params: { storeId: store.id }}"
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
            v-if="$store.getters['auth/isEditorInCurrentGroup']"
            :to="{name: 'storePickupsManage', params: { storeId: store.id }}"
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
    <KNotice v-if="isInactive" >
      <template slot="icon">
        <i class="far fa-handshake"/>
      </template>
      {{ $t('STOREDETAIL.INACTIVE') }}
      <template slot="desc">
        <router-link
          v-if="$store.getters['auth/isEditorInCurrentGroup']"
          :to="{name: 'storeEdit', params: { storeId: store.id }}"
        >
          {{ $t('STOREDETAIL.CHANGE_STATUS') }}
          <q-btn
            small
            round
            flat
            icon="fas fa-pencil-alt"
          />
        </router-link>
      </template>
    </KNotice>
    <KNotice v-else-if="hasNoPickups" >
      <template slot="icon">
        <i class="fas fa-bed"/>
      </template>
      {{ $t('PICKUPLIST.NONE') }}
      <template slot="desc">
        <router-link
          v-if="$store.getters['auth/isEditorInCurrentGroup']"
          :to="{name: 'storePickupsManage', params: { storeId: store.id }}"
        >
          {{ $t('PICKUPLIST.STORE_NONE_HINT') }}
          <q-btn
            small
            round
            flat
            icon="fas fa-calendar-alt"
          />
        </router-link>
      </template>
    </KNotice>
  </div>
</template>

<script>
import PickupList from '@/components/Pickups/PickupList'
import KNotice from '@/components/General/KNotice'
import Markdown from '@/components/Markdown'
import StandardMap from '@/components/Map/StandardMap'

import { storeMarker } from '@/components/Map/markers'
import directions from './directions'

import {
  mapGetters,
  mapActions,
} from 'vuex'

import { QCard, QCardTitle, QCardActions, QItem, QItemMain, QItemSide, QBtn, QTabs, QRouteTab, QIcon, QTooltip } from 'quasar'

export default {
  components: { PickupList, QCard, QCardTitle, QCardActions, QItem, QItemMain, QItemSide, QBtn, QTabs, QRouteTab, QIcon, QTooltip, KNotice, Markdown, StandardMap },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
      detail: 'detail/openForPickup',
    }),
  },
  computed: {
    markers () {
      return [storeMarker(this.store)]
    },
    ...mapGetters({
      store: 'stores/activeStore',
      pickups: 'pickups/filtered',
      currentUser: 'auth/user',
    }),
    hasNoPickups () {
      return this.pickups && this.pickups.length === 0
    },
    isInactive () {
      return this.store && this.store.status !== 'active'
    },
    directionsURL () {
      if (!this.store.latitude) return
      if (this.$q.platform.is.ios) {
        return directions.apple(this.store)
      }
      if (this.$q.platform.is.android) {
        return directions.google(this.store)
      }
      return directions.osm(this.currentUser, this.store)
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
