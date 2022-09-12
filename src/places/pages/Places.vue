<template>
  <div>
    <div class="bg-white q-px-sm q-py-lg row justify-between">
      <span class="text-h4">
        Discover Places...
      </span>
      <QBtn
        v-if="isEditor"
        round
        color="secondary"
        :to="{ name: 'placeCreate', params: { groupId } }"
        :title="$t('BUTTON.CREATE')"
      >
        <QIcon name="fas fa-fw fa-plus" />
      </QBtn>
    </div>
    <div
      class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs"
    >
      <QSelect
        v-model="status"
        :options="['Only Cooperating']"
        emit-value
        outlined
        hide-bottom-space
        dense
      />
    </div>
    <div class="row">
      <div
        v-for="place in places"
        :key="place.id"
        class="col-md-4 col-6"
      >
        <RouterLink :to="{ name: 'place', params: { placeId: place.id } }">
          <QCard
            style="height: 200px"
            class="relative-position"
          >
            <RandomArt
              :seed="place.id"
              type="banner"
              style="height: 42px"
            />
            <div
              class="q-pl-md q-pa-sm text-h5 ellipsis absolute-top text-white"
              style="background-color: rgba(0, 0, 0, 0.35); height: 42px"
              :title="place.name"
            >
              {{ place.name }}
            </div>
            <div class="q-ml-md limit-height">
              <Markdown
                v-if="place.description"
                :source="place.description"
              />
            </div>
          </QCard>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QCard, QSelect, QBtn, QIcon } from 'quasar'

import { useCurrentGroupService } from '@/group/services'

import Markdown from '@/utils/components/Markdown.vue'
import RandomArt from '@/utils/components/RandomArt'

const status = 'Only Cooperating'

const isEditor = true // TODO

const {
  groupId,
  places,
  archivedPlaces,
} = useCurrentGroupService()
</script>

<style lang="sass">
.limit-height
  position: relative
  max-height: 67px
  overflow-y: hidden
</style>
