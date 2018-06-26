<template>
  <q-btn-group class="k-groupmapcontrols">
    <q-btn
      color="primary"
      @click="$emit('toggleStores')"
    >
      <span class="fa-fw fa-stack">
        <i class="fas fa-shopping-cart fa-stack-1x" />
        <i
          v-if="showStores"
          class="fas fa-check bottom-right fa-stack-1x"
        />
        <i
          v-else
          class="fas fa-times bottom-right fa-stack-1x"
        />
      </span>
      <q-tooltip>
        {{ $t( showStores ? 'GROUPMAP.HIDE_STORES' : 'GROUPMAP.SHOW_STORES') }}
      </q-tooltip>
    </q-btn>

    <q-btn
      color="primary"
      @click="$emit('toggleUsers')"
    >
      <span class="fa-fw fa-stack">
        <i class="fas fa-user fa-stack-1x" />
        <i
          v-if="showUsers"
          class="fas fa-check bottom-right fa-stack-1x"
        />
        <i
          v-else
          class="fas fa-times bottom-right fa-stack-1x"
        />
      </span>
      <q-tooltip>
        {{ $t( showUsers ? 'GROUPMAP.HIDE_USERS' : 'GROUPMAP.SHOW_USERS') }}
      </q-tooltip>
    </q-btn>

    <q-btn
      color="primary"
      @click="$emit('toggleGroups')"
    >
      <span class="fa-fw fa-stack">
        <i class="fas fa-home fa-stack-1x" />
        <i
          v-if="showGroups"
          class="fas fa-check bottom-right fa-stack-1x"
        />
        <i
          v-else
          class="fas fa-times bottom-right fa-stack-1x"
        />
      </span>
      <q-tooltip>
        {{ $t( showGroups ? 'GROUPMAP.HIDE_GROUPS' : 'GROUPMAP.SHOW_GROUPS') }}
      </q-tooltip>
    </q-btn>
  </q-btn-group>
</template>

<script>

import {
  QBtn,
  QBtnGroup,
  QTooltip,
} from 'quasar'

export default {
  components: {
    QBtn,
    QBtnGroup,
    QTooltip,
  },
  props: {
    showStores: {
      default: true,
      type: Boolean,
    },
    showUsers: {
      default: true,
      type: Boolean,
    },
    showGroups: {
      default: true,
      type: Boolean,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.k-groupmapcontrols
  position absolute
  top 5px
  right 10px
  z-index 10000
  .bottom-right
    left 5px
    top 5px
  .fa-check
    color $positive
  .fa-times
    color $negative
</style>
