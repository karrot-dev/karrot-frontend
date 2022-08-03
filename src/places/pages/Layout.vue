<template>
  <div v-if="place && place.status === 'archived'">
    <QCard>
      <QBanner
        inline-actions
        class="bg-info"
      >
        {{ $t('STOREDETAIL.ARCHIVED') }}
        <template #avatar>
          <QIcon
            name="fas fa-trash-alt"
            size="1.4em"
          />
        </template>
        <template #action>
          <QBtn
            v-if="isEditor"
            flat
            dense
            :label="$t('STOREEDIT.RESTORE')"
            @click="restore"
          />
        </template>
      </QBanner>
    </QCard>
  </div>
  <div v-else>
    <PlaceHeader />
    <PlaceTabs v-if="place" />
    <RouterView />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  QCard,
  QBanner,
  QIcon,
  QBtn,
} from 'quasar'

import PlaceTabs from '@/places/components/PlaceTabs'
import PlaceHeader from '@/places/components/PlaceHeader'

import { useActivePlaceService } from '@/places/services'
import { useCurrentGroupService } from '@/group/services'
import { useSavePlaceMutation } from '@/places/mutations'
import { placeRoute } from '@/places/utils'

const route = useRoute()
const router = useRouter()

const { isEditor } = useCurrentGroupService()
const { place } = useActivePlaceService()
const { mutate: save } = useSavePlaceMutation()

function restore () {
  save({ id: place.value.id, status: 'created' })
}

// if we are at the base place route redirect to the default view for this place
watch(() => [place.value, route.name], ([place, routeName]) => {
  if (place && routeName === 'place') {
    router.push({ name: placeRoute(place), params: route.params })
  }
}, { immediate: true })
</script>

<style lang="sass" scoped>
::v-deep(.q-banner__avatar)
  align-self: center
</style>
