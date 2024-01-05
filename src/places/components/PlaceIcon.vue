<template>
  <QIcon
    v-if="place"
    v-bind="iconProps"
  />
</template>
<script setup>
import { QIcon } from 'quasar'
import { toRef } from 'vue'

import { usePlaceIconProps } from '@/places/helpers'

const props = defineProps({
  place: {
    type: Object,
    default: null,
  },
})

const place = toRef(props, 'place')

const iconProps = usePlaceIconProps(place)
</script>
