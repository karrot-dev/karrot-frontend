<template>
  <div class="q-my-sm grey-border relative-position desktop-margin">
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
          <QTooltip>
            {{ $t('PLACEWALL.SUBSCRIPTION.HEADER') }}
          </QTooltip>
          <QPopover>
            <QList
              v-close-overlay
              link
            >
              <QListHeader
                v-t="'PLACEWALL.SUBSCRIPTION.HEADER'"
              />

              <QItem
                v-for="o in options"
                :key="o.id"
                :class="o.selected ? 'bg-grey-2' : ''"
                @click.native="select(o)"
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
          :to="{name: 'placePickupsManage', params: { groupId, placeId }}"
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
        <QChip
          icon="fas fa-star"
          color="secondary"
          square
          :title="$t('PLACEWALL.SUBSCRIBED_USERS', { count: subscribers.length })"
          class="q-mb-sm"
        >
          <strong>{{ subscribers.length }}</strong>
          <QPopover>
            <div
              v-if="subscribers"
              v-close-overlay
              class="q-pa-md"
            >
              <div>
                <ProfilePicture
                  v-for="user in subscribers"
                  :key="user.id"
                  :user="user"
                  :size="20"
                  class="q-mr-xs"
                />
              </div>
              <div class="q-caption q-mt-sm">
                {{ $t('PLACEWALL.SUBSCRIBED_USERS', { count: subscribers.length }) }}
              </div>
            </div>
          </QPopover>
        </QChip>
        <div
          v-if="place.description"
          class="q-pt-xs"
        >
          <Markdown
            :source="place.description"
          />
        </div>
        <div
          v-else
          class="q-pt-sm"
        >
          <span class="text-italic">
            {{ $t("STOREDETAIL.NO_DESCRIPTION") }}
          </span>
        </div>
        <template v-if="$q.platform.is.mobile">
          <QCardSeparator class="q-mb-sm" />
          <StandardMap
            :markers="markers"
            class="map"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import Markdown from '@/utils/components/Markdown'
import StandardMap from '@/maps/components/StandardMap'
import RandomArt from '@/utils/components/RandomArt'
import KSpinner from '@/utils/components/KSpinner'
import ProfilePicture from '@/users/components/ProfilePicture'

import { placeMarker } from '@/maps/components/markers'
import directions from '@/maps/directions'

import {
  mapGetters,
  mapActions,
} from 'vuex'

import {
  QCardSeparator,
  QBtn,
  QTooltip,
  QPopover,
  QList,
  QListHeader,
  QItem,
  QItemMain,
  QItemSide,
  QChip,
} from 'quasar'

export default {
  components: {
    Markdown,
    StandardMap,
    RandomArt,
    KSpinner,
    ProfilePicture,
    QCardSeparator,
    QBtn,
    QTooltip,
    QPopover,
    QList,
    QListHeader,
    QItem,
    QItemMain,
    QItemSide,
    QChip,
  },
  computed: {
    markers () {
      return this.place ? [placeMarker(this.place)] : []
    },
    ...mapGetters({
      placeId: 'places/activePlaceId',
      place: 'places/activePlace',
      subscribers: 'places/activePlaceSubscribers',
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
body.desktop .actionButtons
  top 6px
.actionButtons
  top 2px
  right 3px
  position absolute
  .q-btn
    margin 3px
.map
  height 30vh
</style>
