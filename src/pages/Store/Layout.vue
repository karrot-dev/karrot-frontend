<template>
  <div v-if="store.status != 'archived'">
    <div slot="navigation">
      <RandomArt
        :seed="store.id"
        type="banner"
        :above="true"
        v-if="$q.platform.is.mobile">
        <div class="navbar-wrapper row no-wrap">
          <q-tabs
            align="center"
            color="transparent"
            hide="icon"
            class="col"
          >
            <q-route-tab
              :to="{name: 'storePickups'}"
              exact
              slot="title"
              name="pickups"
            >
              {{ $t('GROUP.PICKUPS' ) }}
            </q-route-tab>
            <q-route-tab
              :to="{name: 'storeFeedback'}"
              exact
              slot="title"
              name="feedback"
            >
              {{ $t('PICKUP_FEEDBACK.TITLE' ) }}
            </q-route-tab>
            <q-route-tab
              :to="{name: 'storeHistory'}"
              exact
              slot="title"
              name="history"
            >
              {{ $t('GROUP.HISTORY' ) }}
            </q-route-tab>
          </q-tabs>
          <q-btn
            flat
            class="text-white"
          >
            <q-icon name="fas fa-ellipsis-v" />
            <q-tooltip v-t="'BUTTON.MORE_OPTIONS'" />
            <StoreOptions/>
          </q-btn>
        </div>
      </RandomArt>
    </div>
    <div class="grey-border store-banner">
      <RandomArt
        :seed="store.id"
        type="banner"/>
    </div>
    <router-view/>
  </div>
  <div v-else>
    <q-card>
      <k-alert
        color="warning"
        icon="fa-trash-alt"
        :actions="[{ label: $t('STOREEDIT.RESTORE'), handler: restore }]"
      >
        {{ $t('STOREDETAIL.ARCHIVED') }}
      </k-alert>
    </q-card>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Markdown from '@/components/Markdown'
import StoreOptions from '@/components/Sidenav/StoreOptions'

import { QCard, QTabs, QRouteTab, QScrollArea, QBtn, QIcon, QTooltip } from 'quasar'
import KAlert from '@/components/Layout/KAlert'
import RandomArt from '@/components/General/RandomArt'

export default {
  components: { RandomArt, QCard, QTabs, QRouteTab, QScrollArea, KAlert, QBtn, QIcon, QTooltip, StoreOptions, Markdown },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
    }),
  },
  methods: {
    restore () {
      this.$store.dispatch('stores/save', { id: this.store.id, status: 'created' })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.overflow
  overflow-y auto
  max-height 120px
.store-banner
  margin: 8px 8px -13px 8px
  > span
    display: block
    height 5vw
    min-height 30px
    max-height 48px
    overflow hidden

body.mobile .store-banner
  margin: 0px 0px -13px 0px
  border 0
  max-height: 30px
  overflow: hidden

.navbar-wrapper
  background linear-gradient(to bottom, rgba(0,0,0,0.38) 20%, rgba(0,0,0,0) 100%)
  width: 100%
  overflow auto
</style>
