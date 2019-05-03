<template>
  <SidenavBox>
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
        <QTooltip v-t="showAllPlaces ? 'STOREEDIT.SHOW_ACTIVE_ONLY' : 'STOREEDIT.SHOW_ALL'" />
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

    <KSpinner v-if="!hasPlaces && fetchStatus.pending" />
    <PlaceList
      v-else
      :group-id="groupId"
      :places="places"
      :archived="showAllPlaces ? archived : []"
    />
  </SidenavBox>
</template>

<script>

import {
  QBtn,
  QIcon,
  QToggle,
  QTooltip,
} from 'quasar'
import SidenavBox from './SidenavBox'
import PlaceList from '@/places/components/PlaceList'
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    SidenavBox,
    QBtn,
    QIcon,
    QToggle,
    QTooltip,
    PlaceList,
    KSpinner,
  },
  props: {
    groupId: { default: null, type: Number },
    places: { required: true, type: Array },
    showAllPlaces: { default: false, type: Boolean },
    archived: { default: () => [], type: Array },
    isEditor: { default: false, type: Boolean },
    fetchStatus: { default: null, type: Object },
  },
  data () {
    return {
      showArchived: false,
    }
  },
  computed: {
    hasPlaces () {
      return this.places && this.places.length > 0
    },
  },
  methods: {
    toggleArchived () {
      this.showArchived = !this.showArchived
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
