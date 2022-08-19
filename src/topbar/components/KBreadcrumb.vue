<template>
  <div class="wrapper">
    <div v-if="!hasBreadcrumbs">
      ...
    </div>
    <div
      v-for="breadcrumb in prevElements"
      :key="breadcrumb.name"
      class="prevBread gt-xs"
    >
      <RouterLink
        v-if="breadcrumb.route"
        :to="breadcrumb.route"
      >
        <QBtn
          v-if="breadcrumb.name"
          class="text-white"
          flat
          small
        >
          {{ breadcrumb.name }}
        </QBtn>
      </RouterLink>
      <div
        v-if="!breadcrumb.route"
        class="label"
      >
        <span v-if="breadcrumb.name">{{ breadcrumb.name }}</span>
      </div>
      <div> <i class="fas fa-fw fa-angle-right" /> </div>
    </div>
    <div
      v-if="secondLastElement"
      class="xs"
    >
      <RouterLink
        v-if="secondLastElement.route"
        :to="secondLastElement.route"
      >
        <div style="min-width: 20px; padding: 4px; text-align: right">
          <i class="fas fa-fw fa-angle-left" />
        </div>
      </RouterLink>
    </div>
    <div v-if="lastElement">
      <div
        v-if="lastElement.name"
        class="label lastElement"
      >
        {{ lastElement.name }}
      </div>
    </div>
    <div
      v-if="secondLastElement"
      class="xs"
      style="min-width: 20px"
    />
  </div>
</template>

<script setup>
import { QBtn } from 'quasar'
import { computed } from 'vue'

import { useBreadcrumbs } from '@/topbar/services'

const breadcrumbs = useBreadcrumbs()

const hasBreadcrumbs = computed(() => breadcrumbs.value.length > 0)
const prevElements = computed(() => breadcrumbs.value.slice(0, breadcrumbs.value.length - 1))
const secondLastElement = computed(() => breadcrumbs.value[breadcrumbs.value.length - 2])
const lastElement = computed(() => breadcrumbs.value[breadcrumbs.value.length - 1])
</script>

<style scoped lang="sass">
.wrapper
  .prevBread, .q-btn, div
    display: inline-block

  .label
    justify-content: center
    padding: 0 16px
    font-weight: 500
    text-overflow: ellipsis
    text-transform: uppercase
    vertical-align: middle
    cursor: auto
    outline: 0

body.desktop .lastElement
  font-size: 1.5rem
</style>
