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
      v-if="secondlastElement"
      class="xs"
      style="min-width: 20px"
    />
  </div>
</template>

<script>
import { QBtn } from 'quasar'
import { useCurrentOfferQuery } from '@/offers/queries'

export default {
  components: { QBtn },
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
    },
  },
  setup () {
    const { offer } = useCurrentOfferQuery()
    return {
      offer,
    }
  },
  computed: {
    elements () {
      return this.breadcrumbs.map(breadcrumb => {
        if (breadcrumb.type === 'activeOffer') {
          if (this.offer) {
            if (this.offer) {
              return {
                name: this.offer.name,
              }
            }
          }
        }
        return breadcrumb
      })
    },
    hasBreadcrumbs () {
      return this.elements && this.elements.length > 0
    },
    prevElements () {
      return this.elements.slice(0, this.elements.length - 1)
    },
    secondlastElement () {
      return this.elements[this.elements.length - 2]
    },
    lastElement () {
      return this.elements[this.elements.length - 1]
    },
  },
}
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
