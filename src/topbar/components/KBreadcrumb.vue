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
      v-if="secondlastElement"
      class="xs"
    >
      <RouterLink
        v-if="secondlastElement.route"
        :to="secondlastElement.route"
      >
        <div style="min-width: 20px; text-align: right; padding: 4px">
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
      v-if="secondlastElement"
      class="xs"
      style="min-width: 20px"
    />
  </div>
</template>

<script>
import { QBtn } from 'quasar'

export default {
  components: { QBtn },
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
    },
  },
  computed: {
    hasBreadcrumbs () {
      return this.breadcrumbs && this.breadcrumbs.length > 0
    },
    prevElements () {
      return this.breadcrumbs.slice(0, this.breadcrumbs.length - 1)
    },
    secondlastElement () {
      return this.breadcrumbs[this.breadcrumbs.length - 2]
    },
    lastElement () {
      return this.breadcrumbs[this.breadcrumbs.length - 1]
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.wrapper
  .prevBread, .q-btn, div
    display inline-block
  .label
    cursor auto
    text-overflow ellipsis
    justify-content center
    outline 0
    vertical-align middle
    padding 0 16px
    font-weight 500
    text-transform uppercase
body.desktop .lastElement
    font-size 1.5rem
</style>
