<template>
  <SidenavBox>
    <template #icon>
      <QIcon
        name="fas fa-fw fa-star"
        color="secondary"
      />
    </template>
    <template #name>
      Your places (TODO)
    </template>

    <KSpinner v-if="pending" />
    <PlaceList
      v-else
      :places="places.filter(place => place.isSubscribed)"
    />
    <QItem
      v-if="placeCount > 0"
      :to="{ name: 'places' }"
      dense
    >
      <QItemSection>
        {{ $t('STOREEDIT.SHOW_ALL', { count: placeCount }) }}
      </QItemSection>
    </QItem>
    <QItem
      v-if="placeCount < 1 && isEditor"
      :to="{ name: 'placeCreate', params: { groupId } }"
      class="bg-secondary justify-center"
      :title="$t('BUTTON.CREATE')"
      dense
    >
      <QItemSection side>
        <QIcon
          name="add_circle"
          color="white"
          size="1.5em"
        />
      </QItemSection>
    </QItem>
  </SidenavBox>
</template>

<script>

import {
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
    QIcon,
    QItemSection,
    QItem,
    PlaceList,
    KSpinner,
  },
  props: {
    groupId: { default: null, type: Number },
    places: { required: true, type: Array },
    isEditor: { default: false, type: Boolean },
    pending: { default: false, type: Boolean },
  },
  computed: {
    placeCount () {
      return this.places.filter(place => place.status === 'active').length
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
