<template>
  <SidenavBox
    @toggle="$emit('toggleBox')"
    :expanded="$q.platform.is.mobile || expanded"
    :expandable="!$q.platform.is.mobile"
  >
    <template slot="icon">
      <QIcon name="fas fa-fw fa-shopping-cart" />
    </template>
    <template slot="name">
      {{ $t('GROUP.STORES') }}
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <QToggle
        :value="showAllPlaces"
        @input="$emit('toggleShowAllPlaces')"
      >
        <QTooltip v-t="showAllPlaces ? 'STOREEDIT.SHOW_ACTIVE_ONLY' : 'STOREEDIT.SHOW_ALL'"/>
      </QToggle>
      <QBtn
        v-if="hasPlaces && isEditor"
        flat
        dense
        round
        :to="{ name: 'placeCreate', params: { groupId } }"
      >
        <QIcon name="fas fa-fw fa-plus-circle" />
        <QTooltip v-t="'BUTTON.CREATE'" />
      </QBtn>
    </div>

    <PlaceList
      :group-id="groupId"
      :places="places"
      :archived="showAllPlaces ? archived : []"
    />
  </SidenavBox>
</template>

<script>

import { QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QToggle, QTooltip, QItemTile } from 'quasar'
import SidenavBox from './SidenavBox'
import PlaceList from '@/places/components/PlaceList'

export default {
  props: {
    groupId: { default: null, type: Number },
    places: { required: true, type: Array },
    showAllPlaces: { default: false, type: Boolean },
    archived: { default: () => [], type: Array },
    expanded: { default: true, type: Boolean },
    isEditor: { default: false, type: Boolean },
  },
  components: {
    SidenavBox, QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QToggle, QTooltip, PlaceList, QItemTile,
  },
  data () {
    return {
      showArchived: false,
    }
  },
  methods: {
    toggleArchived () {
      this.showArchived = !this.showArchived
    },
  },
  computed: {
    hasPlaces () {
      return this.places && this.places.length > 0
    },
  },
}
</script>

<style scoped lang="stylus">
.tools
  .bottom-right
    left 5px
    top 5px
</style>
