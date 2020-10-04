<template>
  <SidenavBox>
    <template #icon>
      <QIcon :name="$icon('place_fw')" />
    </template>
    <template #name>
      {{ $t('GROUP.PLACES') }}
    </template>
    <template #tools>
      <div
        class="tools"
      >
        <QToggle
          :value="showAllPlaces"
          :title="$t(showAllPlaces ? 'STOREEDIT.SHOW_ACTIVE_ONLY' : 'STOREEDIT.SHOW_ALL')"
          @input="$emit('toggle-show-all-places')"
        />
        <QBtn
          v-if="hasPlaces && isEditor"
          flat
          dense
          round
          size="sm"
          :to="{ name: 'placeCreate', params: { groupId } }"
          :title="$t('BUTTON.CREATE')"
        >
          <QIcon name="fas fa-fw fa-plus-circle" />
        </QBtn>
      </div>
    </template>

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
    top 5px
    left 5px
</style>
