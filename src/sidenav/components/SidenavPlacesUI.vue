<template>
  <SidenavBox>
    <template #icon>
      <QIcon :name="$icon('place_fw')" />
    </template>
    <template #name>
      Your places
    </template>
    <template #tools>
      <div
        class="tools"
      >
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

    <KSpinner v-if="!hasPlaces && pending" />
    <PlaceList
      v-else
      :group-id="groupId"
      :places="places.filter(place => place.isSubscribed)"
      :archived="showAllPlaces ? archived : []"
    />
    <QItem
      :to="{ name: 'places' }"
      dense
    >
      <QItemSection>
        Show all places...
      </QItemSection>
    </QItem>
  </SidenavBox>
</template>

<script>

import {
  QBtn,
  QIcon,
  QItemSection,
  QItem,
} from 'quasar'

import PlaceList from '@/places/components/PlaceList'
import KSpinner from '@/utils/components/KSpinner'

import SidenavBox from './SidenavBox'

export default {
  components: {
    SidenavBox,
    QBtn,
    QIcon,
    QItemSection,
    QItem,
    PlaceList,
    KSpinner,
  },
  props: {
    groupId: { default: null, type: Number },
    places: { required: true, type: Array },
    showAllPlaces: { default: false, type: Boolean },
    archived: { default: () => [], type: Array },
    isEditor: { default: false, type: Boolean },
    pending: { default: false, type: Boolean },
  },
  emits: [
    'toggle-show-all-places',
  ],
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

<style scoped lang="sass">
.tools
  .bottom-right
    top: 5px
    left: 5px
</style>
