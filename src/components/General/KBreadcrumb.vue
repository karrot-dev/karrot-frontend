<template>
  <div class="wrapper">
    <div class="prevBread gt-xs" v-for="breadcrumb in prevElements" :key="breadcrumb">
      <router-link v-if="breadcrumb.route" :to="breadcrumb.route">
        <q-btn flat small v-if="breadcrumb.name">{{ breadcrumb.name }}</q-btn>
        <q-btn flat small v-if="breadcrumb.translation">{{ $t(breadcrumb.translation) }}</q-btn>
      </router-link>
      <div class="label" v-if="!breadcrumb.route">
        <span v-if="breadcrumb.name">{{ breadcrumb.name }}</span>
        <span v-if="breadcrumb.translation">{{ breadcrumb.translation }}</span>
      </div>
      <div> > </div>
    </div>
    <div class="label" v-if="lastElement.name">{{ lastElement.name }}</div>
    <div class="label" v-if="lastElement.translation">{{ $t(lastElement.translation) }}</div>
  </div>
</template>

<script>
import { QBtn } from 'quasar'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { QBtn },
  props: {
    breadcrumbs: { required: true },
  },
  computed: {
    ...mapGetters({
      activeGroup: 'groups/activeGroup',
      activeStore: 'stores/activeStore',
    }),
    prevElements () {
      if (this.breadcrumbs.length === 0) return []
      let prev = this.breadcrumbs.slice()
      prev.pop()
      return prev.map((breadcrumb) => this.getElement(breadcrumb))
    },
    lastElement () {
      if (this.breadcrumbs.length === 0) return ''
      return this.getElement(this.breadcrumbs[this.breadcrumbs.length - 1])
    },
  },
  methods: {
    getElement (element) {
      if (element.type) {
        if (element.type === 'activeGroup') {
          if (this.activeGroup) return {name: this.activeGroup.name, route: {name: 'group', groupId: this.activeGroup.id}}
          else return {name: 'loading groupname'}
        }
        if (element.type === 'activeUser') {
          if (this.activeUser) return {name: this.activeUser.name, route: {name: 'user', userId: this.activeUser.id}}
          else return {name: 'loading username'}
        }
        if (element.type === 'activeStore') {
          if (this.activeStore) return {name: this.activeStore.name, route: {name: 'store', groupId: this.activeStore.id}}
          else return {name: 'loading storename'}
        }
        return {name: 'FAIL', route: {name: 'home'}}
      }
      return element
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
    border 
    vertical-align middle
    padding 0 16px
    font-weight 500
    text-transform uppercase
</style>