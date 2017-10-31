<template>
  <div>
    <q-card>
      <q-card-title v-if="$q.platform.is.desktop">
        {{ $t('GROUP.DESCRIPTION') }}
        <router-link slot="right" :to="{name: 'storeEdit', params: { storeId: store.id }}"><q-icon name="fa-pencil" /></router-link>
      </q-card-title>
      <div class="generic-padding overflow" v-if="store.description">
        <Markdown v-if="store.description" :source="store.description" />
      </div>
    </q-card>
    <PickupList
      :store="store"
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
        {{ $t('PICKUPLIST.NONE_HINT') }}
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

import { QCard, QCardTitle, QCardActions, QBtn, QTabs, QRouteTab, QIcon } from 'quasar'

export default {
  components: { PickupList, QCard, QCardTitle, QCardActions, QBtn, QTabs, QRouteTab, QIcon, KNotice, Markdown },
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
</style>
