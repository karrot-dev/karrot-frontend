<template>
  <div>
    <KSpinner v-show="!place" />
    <div v-if="place">
      <RandomArt
        :seed="placeId"
        type="banner"
      />
    </div>
    <div
      v-if="place"
      class="toolbar row justify-between bg-white q-pb-xs"
    >
      <QChip
        :icon="$icon('star')"
        color="secondary"
        text-color="white"
        square
        :title="$t('PLACEWALL.SUBSCRIBED_USERS', { count: subscribers.length })"
        class="self-center q-ml-sm cursor-pointer"
        style="z-index: 0"
      >
        <strong>{{ subscribers.length }}</strong>
        <QMenu>
          <div
            v-if="subscribers"
            v-close-popup
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
            <div class="text-caption q-mt-sm">
              {{ $t('PLACEWALL.SUBSCRIBED_USERS', { count: subscribers.length }) }}
            </div>
          </div>
        </QMenu>
      </QChip>
      <div>
        <QBtn
          round
          color="white"
          :icon="selected.icon"
          :text-color="selected.color"
          :title="$t('PLACEWALL.SUBSCRIPTION.HEADER')"
        >
          <QMenu>
            <QList>
              <QItemLabel
                v-t="'PLACEWALL.SUBSCRIPTION.HEADER'"
                header
              />

              <QItem
                v-for="o in options"
                :key="o.id"
                v-close-popup
                :class="o.selected ? 'bg-grey-2' : ''"
                clickable
                @click="select(o)"
              >
                <QItemSection side>
                  <QIcon
                    :name="o.icon"
                    :color="o.color"
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel>
                    {{ o.label }}
                  </QItemLabel>
                  <QItemLabel caption>
                    {{ o.sublabel }}
                  </QItemLabel>
                </QItemSection>
              </QItem>
            </QList>
          </QMenu>
        </QBtn>
        <component
          :is="directionsURL ? 'a' : 'span'"
          target="_blank"
          rel="noopener nofollow noreferrer"
          :href="directionsURL"
        >
          <QBtn
            round
            :color="directionsURL ? 'secondary' : 'grey'"
            icon="directions"
            :disable="!directionsURL"
            :title="$t('STOREDETAIL.DIRECTIONS')"
          />
        </component>
      </div>
    </div>
    <div
      v-if="place"
      class="bg-white q-py-sm q-px-md limit-height cursor-pointer"
      @click="toggleDetail"
    >
      <QBtn
        v-if="$q.platform.is.mobile"
        round
        flat
        size="md"
        icon="fas fa-map-marker"
        class="float-right"
      />
      <Markdown
        v-if="place.description"
        :source="place.description"
      />
      <div v-else>
        <span class="text-italic">
          {{ $t("STOREDETAIL.NO_DESCRIPTION") }}
        </span>
      </div>
    </div>
    <QDialog
      v-model="showDetail"
    >
      <QCard>
        <QToolbar class="bg-primary text-white">
          <QToolbarTitle v-if="place">
            <QIcon
              name="fas fa-info-circle"
              class="on-left"
            />
            <span>{{ place.name }}</span>
          </QToolbarTitle>
          <QBtn
            v-t="'BUTTON.CLOSE'"
            outline
            @click="toggleDetail"
          />
        </QToolbar>
        <QCardSection
          v-if="place"
        >
          <Markdown
            v-if="place.description"
            :source="place.description"
          />
          <div v-else>
            <span class="text-italic">
              {{ $t("STOREDETAIL.NO_DESCRIPTION") }}
            </span>
          </div>
          <template v-if="$q.platform.is.mobile">
            <QSeparator class="q-my-sm" />
            <StandardMap
              :markers="markers"
              class="map"
            />
          </template>
        </QCardSection>
      </QCard>
    </QDialog>
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
  QSeparator,
  QBtn,
  QTooltip,
  QMenu,
  QList,
  QItemLabel,
  QItem,
  QItemSection,
  QChip,
  QDialog,
  QCard,
  QCardSection,
  QToolbar,
  QToolbarTitle,
  QIcon,
} from 'quasar'

export default {
  components: {
    Markdown,
    StandardMap,
    RandomArt,
    KSpinner,
    ProfilePicture,
    QSeparator,
    QBtn,
    QTooltip,
    QMenu,
    QList,
    QItemLabel,
    QItem,
    QItemSection,
    QChip,
    QDialog,
    QCard,
    QCardSection,
    QToolbar,
    QToolbarTitle,
    QIcon,
  },
  data () {
    return {
      showDetail: false,
    }
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
          icon: this.$icon('star_fw'),
          color: 'secondary',
          selected: this.isSubscribed,
        },
        {
          id: 'unsubscribe',
          label: this.$t('PLACEWALL.SUBSCRIPTION.NO'),
          sublabel: this.$t('PLACEWALL.SUBSCRIPTION.NO_TEXT'),
          icon: `${this.$icon('star')} fa-fw`,
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
    toggleDetail () {
      this.showDetail = !this.showDetail
    },
  },
}
</script>

<style scoped lang="stylus">
.q-btn-round
  margin-bottom .5em
.toolbar
  margin-top -24px
.toolbar .q-btn
  margin 3px
.map
  height 30vh
.limit-height
  max-height 10rem
  overflow-y hidden
  position relative
  &:before
    content ''
    width 100%
    height 100%
    position absolute
    left 0
    top 0
    background linear-gradient(transparent 90%, white)
</style>
