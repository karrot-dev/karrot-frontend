<template>
  <div v-if="store">
    <QCard class="no-shadow no-padding grey-border">
      <RandomArt
        :seed="storeId"
        type="banner"/>
      <div class="generic-padding">

        <div class="actionButtons">
          <RouterLink
            v-if="isEditor"
            :to="{name: 'storeEdit', params: { storeId }}"
          >
            <QBtn
              small
              round
              color="secondary"
              icon="fas fa-pencil-alt"
              class="hoverScale"
            >
              <QTooltip v-t="'STOREDETAIL.EDIT'" />
            </QBtn>
          </RouterLink>
          <RouterLink
            v-if="isEditor"
            :to="{name: 'storePickupsManage', params: { storeId }}"
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
          v-if="store.description"
          :source="store.description"
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
        :to="{name: 'storeEdit', params: { storeId }}"
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
        :to="{name: 'storePickupsManage', params: { storeId }}"
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

import { storeMarker } from '@/maps/components/markers'
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
      return this.store ? [storeMarker(this.store)] : []
    },
    ...mapGetters({
      store: 'stores/currentStore',
      pickups: 'pickups/byCurrentStore',
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
