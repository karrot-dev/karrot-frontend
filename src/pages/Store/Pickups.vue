<template>
  <div>
    <q-card class="no-shadow no-padding grey-border">
      <div class="generic-padding">
        <div class="actionButtons">
          <router-link :to="{name: 'storeEdit', params: { storeId: store.id }}">
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
          <router-link :to="{name: 'storePickupsManage', params: { storeId: store.id }}">
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
            v-if="store.latitude"
            target="_blank"
            :href="routeUrl">
            <q-btn
              small
              round
              color="secondary"
              icon="fas fa-bicycle"
              class="hoverScale"
            >
              <q-tooltip v-t="'STOREDETAIL.ROUTE'" />
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
      </div>
    </q-card>

    <PickupList
      :pickups="pickups"
      @join="join"
      @leave="leave"
    />
    <KNotice v-if="isInactive" >
      <template slot="icon">
        <i class="far fa-handshake"/>
      </template>
      {{ $t('STOREDETAIL.INACTIVE') }}
      <template slot="desc">
        <router-link :to="{name: 'storeEdit', params: { storeId: store.id }}">
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
        <router-link :to="{name: 'storePickupsManage', params: { storeId: store.id }}">
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

import {
  mapGetters,
  mapActions,
} from 'vuex'

import { QCard, QCardTitle, QCardActions, QItem, QItemMain, QItemSide, QBtn, QTabs, QRouteTab, QIcon, QTooltip } from 'quasar'

export default {
  components: { PickupList, QCard, QCardTitle, QCardActions, QItem, QItemMain, QItemSide, QBtn, QTabs, QRouteTab, QIcon, QTooltip, KNotice, Markdown },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
    }),
  },
  data: function () {
    return {
      routeUrl: 'https://www.openstreetmap.org/directions?engine=graphhopper_bicycle',
    }
  },
  mounted: function () {
    if (this.store.latitude) {
      var storeLocation = encodeURI(`${this.store.latitude},${this.store.longitude}`)

      var noGeolocationAvailable = positionError => {
        if (this.currentUser.address) {
          var userAddress = encodeURI(this.currentUser.address)
          this.routeUrl = `https://www.openstreetmap.org/directions?engine=graphhopper_bicycle&from=${userAddress}&to=${storeLocation}`
        }
        else {
          this.routeUrl = `https://www.openstreetmap.org/directions?engine=graphhopper_bicycle&to=${storeLocation}`
        }
      }

      var geolocationAvailable = position => {
        var geolocation = encodeURI(`${position.coords.latitude},${position.coords.longitude}`)
        this.routeUrl = `https://www.openstreetmap.org/directions?engine=graphhopper_bicycle&from=${geolocation}&to=${storeLocation}`
      }

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(geolocationAvailable, noGeolocationAvailable)
      }
      else {
        noGeolocationAvailable()
      }
    }
  },
  computed: {
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
</style>
