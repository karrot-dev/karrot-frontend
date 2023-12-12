<template>
  <QBanner class="bg-orange-2">
    <div class="text-h6 flex items-center no-wrap">
      <span class="text-no-wrap">You are archiving</span>
      <QChip
        square
        :label="getTranslatedName(currentPlaceStatus)"
        :color="getColorName(currentPlaceStatus)"
        size="md"
        class="q-ml-sm ellipsis"
      />
    </div>
    <p>
      Update places with this status to:
    </p>
    <QSelect
      v-model="selected"
      :options="options"
      :autocomplete="false"
      map-options
      emit-value
      :label="t('LABELS.STATUS')"
      outlined
      bg-color="white"
      class="q-mb-md"
    >
      <template #option="scope">
        <QItem
          :key="scope.index"
          v-bind="scope.itemProps"
        >
          <QItemSection side>
            <QIcon
              :name="scope.opt.icon"
              size="1.1em"
              :color="scope.opt.color"
            />
          </QItemSection>
          <QItemSection>
            <QItemLabel>{{ scope.opt.label }}</QItemLabel>
            <QItemLabel
              v-if="scope.opt.caption"
              caption
              class="ellipsis"
              style="max-width: 200px;"
            >
              {{ scope.opt.caption }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </template>
    </QSelect>
  </QBanner>
</template>

<script setup>
import { QChip, QBanner, QSelect, QItem, QItemSection, QIcon, QItemLabel } from 'quasar'
import { computed, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

import { usePlaceStatusHelpers } from '@/places/helpers'

const { t } = useI18n()

const selected = ref(null)

const props = defineProps({
  currentPlaceStatus: {
    type: Object,
    required: true,
  },
  placeStatuses: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['extraData'])

watchEffect(() => {
  emit('extraData', { setPlacesToStatus: selected.value })
})

const { getColorName, getTranslatedName } = usePlaceStatusHelpers()

const options = computed(() => {
  return props.placeStatuses.map(placeStatus => ({
    value: placeStatus.id,
    label: getTranslatedName(placeStatus),
    caption: placeStatus.description,
    color: getColorName(placeStatus),
    icon: 'fas fa-circle',
  }))
})

</script>
