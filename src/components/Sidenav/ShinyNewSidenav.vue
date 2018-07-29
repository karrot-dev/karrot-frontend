<template>
  <div>
    <RandomArt
      :seed="currentGroup.id"
      type="circles"
    >
      <h3 style="font-size: 20px; line-height: 36px; color: white; margin: 6px 12px;">{{ currentGroup.name }}</h3>
    </RandomArt>

    <template v-if="currentStore">
      <q-list
        highlight
        no-border
        class="no-padding"
      >
        <q-item :to="groupRoute('group')">
          <q-item-side class="text-center">
            &larr;
          </q-item-side>
          <q-item-main>
            Back to group
          </q-item-main>
        </q-item>
      </q-list>
    </template>

    <template v-else>

      <GroupMap
        v-if="currentGroup && !$q.platform.is.mobile"
        controls="mini"
        :stores="stores"
        :users="users"
        :show-users="showUsers"
        :show-stores="showStores"
        :selected-store="selectedStore"
        :current-group="currentGroup"
        :height="260"
        @toggleUsers="toggleUsers"
        @toggleStores="toggleStores"
      />

      <q-list
        highlight
        no-border
        class="no-padding"
      >

        <q-item
          v-if="feedbackPossible.length > 0"
          :to="groupRoute('pickupFeedback')"
          class="highlight"
        >
          <q-item-side class="text-center">
            <q-icon name="fas fa-balance-scale" />
          </q-item-side>
          <q-item-main>
            Give pickup feedback
          </q-item-main>
          <q-item-side right>
            <q-chip
              small
              color="orange"
            >
              {{ feedbackPossible.length }}
            </q-chip>
          </q-item-side>
        </q-item>

        <q-item :to="groupRoute('group')">
          <q-item-side class="text-center">
            <q-icon name="fas fa-bullhorn" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.WALL") }}
          </q-item-main>
          <q-item-side
            v-if="unreadConversationMessageCount > 0"
            right
          >
            <q-chip
              small
              color="primary"
            >
              {{ unreadConversationMessageCount }}
            </q-chip>
          </q-item-side>
        </q-item>

        <q-item :to="groupRoute('groupPickups')">
          <q-item-side class="text-center">
            <q-icon name="fas fa-shopping-basket" />
          </q-item-side>
          <q-item-main>
            {{ $t('GROUP.PICKUPS') }}
          </q-item-main>
          <q-item-side
            v-if="myPickups.length > 0"
            right
          >
            <q-chip
              small
              color="green"
            >
              {{ myPickups.length }}
            </q-chip>
          </q-item-side>
        </q-item>

        <q-item
          v-if="isCurrentRouteName('groupPickups', 'groupFeedback')"
          :to="groupRoute('groupFeedback')"
          class="indent"
        >
          <q-item-side class="text-center">
            <q-icon name="fas fa-balance-scale" />
          </q-item-side>
          <q-item-main>
            {{ $t("PICKUP_FEEDBACK.TITLE") }}
          </q-item-main>
        </q-item>

        <q-item :to="groupRoute('map')">
          <q-item-side class="text-center">
            <q-icon name="fas fa-map" />
          </q-item-side>
          <q-item-main>
            {{ $t('GROUPMAP.TITLE') }}
          </q-item-main>
        </q-item>

        <q-item :to="{name: 'groupSettings'}">
          <q-item-side class="text-center">
            <q-icon
              size="1em"
              name="fas fa-cog fa-fw on-left"
            />
          </q-item-side>
          <q-item-main>
            <!--
            {{ $t('GROUP.SETTINGS') }}
            -->
            Notification Settings
          </q-item-main>
        </q-item>

      </q-list>

      <q-list
        highlight
        no-border
        class="no-padding"
      >
        <q-list-header>Organise group</q-list-header>

        <q-item :to="groupRoute('groupMembers')">
          <q-item-side class="text-center">
            <q-icon name="fas fa-users" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.MEMBERS") }}
          </q-item-main>
        </q-item>

        <q-item :to="groupRoute('stores')">
          <q-item-side class="text-center">
            <q-icon name="fas fa-shopping-cart" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.STORES") }}
          </q-item-main>
        </q-item>

        <q-item :to="groupRoute('groupEdit')">
          <q-item-side class="text-center">
            <q-icon
              size="1em"
              name="fas fa-pencil-alt fa-fw on-left"
            />
          </q-item-side>
          <q-item-main>
            {{ $t('GROUP.EDIT') }}
          </q-item-main>
        </q-item>
      </q-list>
    </template>

    <template v-if="currentStore">
      <RandomArt
        :seed="currentStore.id"
        type="banner"
      >
        <h3 style="font-size: 20px; line-height: 36px; color: white; margin: 6px 12px;">{{ currentStore.name }}</h3>
      </RandomArt>

      <StandardMap
        v-if="!$q.platform.is.mobile"
        :markers="storeMarkers"
        class="map"
      />

      <q-list
        highlight
        no-border
        class="no-padding"
      >
        <q-item
          :to="{name: 'storePickups', params: { storeId: currentStore.id }}"
          exact
        >
          <q-item-side class="text-center">
            <q-icon name="fas fa-shopping-basket" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.PICKUPS") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'storeFeedback', params: { storeId: currentStore.id }}">
          <q-item-side class="text-center">
            <q-icon name="fas fa-balance-scale" />
          </q-item-side>
          <q-item-main>
            {{ $t("PICKUP_FEEDBACK.TITLE") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'storeHistory', params: { storeId: currentStore.id }}">
          <q-item-side class="text-center">
            <i class="far fa-clock"/>
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.HISTORY") }}
          </q-item-main>
        </q-item>

        <q-list-header>Organise store</q-list-header>

        <q-item :to="{name: 'storeEdit', params: { storeId: currentStore.id }}">
          <q-item-side class="text-center">
            <q-icon name="fas fa-fw fa-pencil-alt" />
          </q-item-side>
          <q-item-main>
            {{ $t('STOREDETAIL.EDIT') }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'storePickupsManage', params: { storeId: currentStore.id }}">
          <q-item-side class="text-center">
            <q-icon name="fas fa-fw fa-calendar-alt on-left" />
          </q-item-side>
          <q-item-main>
            {{ $t('STOREDETAIL.MANAGE') }}
          </q-item-main>
        </q-item>

      </q-list>

    </template>
  </div>
</template>

<script>
import GroupMap from '@/components/Map/GroupMap'
import DateAsWords from '@/components/General/DateAsWords'
import FeedbackNotice from '@/components/Wall/FeedbackNotice'
import PickupItem from '@/components/Pickups/PickupItem'
import RandomArt from '@/components/General/RandomArt'
import StandardMap from '@/components/Map/StandardMap'
import { storeMarker } from '@/components/Map/markers'
import { mapGetters, mapActions, mapState } from 'vuex'
import {
  QChip,
  QList,
  QListHeader,
  QItem,
  QItemTile,
  QItemSide,
  QItemMain,
  QIcon,
  QBtn,
  QPopover,
  QCollapsible,
  QSlideTransition,
} from 'quasar'

export default {
  components: {
    QChip,
    QList,
    QListHeader,
    QItem,
    QItemTile,
    QItemMain,
    QItemSide,
    QIcon,
    QBtn,
    QPopover,
    QCollapsible,
    QSlideTransition,
    GroupMap,
    DateAsWords,
    FeedbackNotice,
    PickupItem,
    RandomArt,
    StandardMap,
  },
  computed: {
    ...mapState({
      routeName: state => state.route.name,
    }),
    ...mapGetters({
      stores: 'stores/byCurrentGroup',
      users: 'users/byCurrentGroup',
      selectedStore: 'stores/activeStore',
      currentUser: 'auth/user',
      currentGroup: 'currentGroup/value',
      currentStore: 'stores/activeStore',
      unreadConversationMessageCount: 'currentGroup/unreadConversationMessageCount',
      showStores: 'sidenavBoxes/toggle/storesOnMap',
      showUsers: 'sidenavBoxes/toggle/usersOnMap',
      myPickups: 'pickups/mine',
      feedbackPossible: 'pickups/feedbackPossible',
    }),
    storeMarkers () {
      if (this.currentStore) return [storeMarker(this.currentStore)]
      return []
    },
  },
  methods: {
    isCurrentRouteName (...names) {
      return names.includes(this.routeName)
    },
    groupRoute (name) {
      return {
        name, params: { groupId: this.currentGroup.id },
      }
    },
    ...mapActions({
      toggleStores: 'sidenavBoxes/toggle/storesOnMap',
      toggleUsers: 'sidenavBoxes/toggle/usersOnMap',
      pickupDetail: 'detail/openForPickup',
      joinPickup: 'pickups/join',
      leavePickup: 'pickups/leave',
    }),
  },
}
</script>

<style scoped lang="stylus">
.indent
  //padding-left 60px
  margin 0px 0px 8px 16px
.map
  height 260px
</style>
