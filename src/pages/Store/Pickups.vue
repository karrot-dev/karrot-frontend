<template>
  <div>
    <q-card class="no-shadow generic-padding grey-border">
      <q-item multiline>
        <q-item-main>
          <Markdown
            v-if="store.description"
            :source="store.description"
          />
        </q-item-main>
        <q-item-side
          class="group"
        >
          <router-link :to="{name: 'storeEdit', params: { storeId: store.id }}">
            <q-btn
              small
              round
              color="secondary"
              icon="fa-pencil"
            >
              <q-tooltip v-t="'STOREDETAIL.EDIT'" />
            </q-btn>
          </router-link>
          <router-link :to="{name: 'storePickupsManage', params: { storeId: store.id }}">
            <q-btn
              small
              round
              color="secondary"
            >
              <span class="fa-stack fa-lg">
                <i
                  class="fa fa-shopping-basket
                  fa-stack-2x bottom-icon"/>
                <i
                  style="font-size: 1.6em"
                  class="fa fa-clock-o fa-stack-1x top-icon"/>
              </span>
              <q-tooltip v-t="'STOREDETAIL.MANAGE'" />
            </q-btn>
          </router-link>
        </q-item-side>
      </q-item>
    </q-card>

    <PickupList
      :pickups="pickups"
      @join="join"
      @leave="leave"
    />
    <KNotice v-if="pickups && pickups.length == 0" >
      <template slot="icon">
        <i class="fa fa-bed"/>
      </template>
      {{ $t('PICKUPLIST.NONE') }}
      <template slot="desc">
        <router-link :to="{name: 'storePickupsManage', params: { storeId: store.id }}">
          {{ $t('PICKUPLIST.STORE_NONE_HINT') }}
          <q-btn
            small
            round
            flat
          >
            <span class="fa-stack fa-lg">
              <i
                class="fa fa-shopping-basket
                fa-stack-2x bottom-icon"/>
              <i
                style="font-size: 1.6em"
                class="fa fa-clock-o fa-stack-1x top-icon"/>
            </span>
          </q-btn>
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
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
      pickups: 'pickups/filtered',
      currentUser: 'auth/user',
    }),
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.card
  margin 0
.padding
  padding 1em
.notice
  .icon
    margin .1em 0 0 0
    .fa
      font-size 10vw
  padding 2em 3em
  transform: translateZ(1px) rotate(-3deg);
  h5
    padding 0
.q-btn-round
  margin-bottom .5em

.fa-stack
  font-size 0.85em
  padding-right 20px
  padding-bottom 20px
  .bottom-icon
    color white
  .top-icon
    padding-left 11px
    padding-top 9px
    color $primary
    -webkit-text-stroke: 0.04em $primary;
</style>
