<template>
  <QBtnGroup class="k-groupmapcontrols">
    <QBtn
      v-if="options.showFullScreenButton"
      :size="options.buttonSize"
      color="primary"
      :to="{ name: 'map', params: { groupId } }"
    >
      <i class="fas fa-expand-arrows-alt fa-stack-1x" />
      <QTooltip>
        {{ $t('GROUPMAP.FULL_SCREEN') }}
      </QTooltip>
    </QBtn>

    <QBtn
      v-if="options.showBack && !$q.platform.is.mobile"
      :size="options.buttonSize"
      color="primary"
      :to="{ name: 'group', params: { groupId } }"
    >
      <i class="fas fa-fw fa-chevron-left" />
      <QTooltip>
        {{ $t('BUTTON.BACK') }}
      </QTooltip>
    </QBtn>

    <QBtn
      color="primary"
      :size="options.buttonSize"
      @click="$emit('togglePlaces')"
    >
      <span class="fa-fw fa-stack">
        <i class="fas fa-shopping-cart fa-stack-1x" />
        <i
          v-if="showPlaces"
          class="fas fa-check bottom-right fa-stack-1x"
        />
        <i
          v-else
          class="fas fa-times bottom-right fa-stack-1x"
        />
      </span>
      <QTooltip>
        {{ $t( showPlaces ? 'GROUPMAP.HIDE_STORES' : 'GROUPMAP.SHOW_STORES') }}
      </QTooltip>
    </QBtn>

    <QBtn
      color="primary"
      :size="options.buttonSize"
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
      <QTooltip>
        {{ $t( showUsers ? 'GROUPMAP.HIDE_USERS' : 'GROUPMAP.SHOW_USERS') }}
      </QTooltip>
    </QBtn>

    <QBtn
      v-if="options.showGroupsButton"
      color="primary"
      :size="options.buttonSize"
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
      <QTooltip>
        {{ $t( showGroups ? 'GROUPMAP.HIDE_GROUPS' : 'GROUPMAP.SHOW_GROUPS') }}
      </QTooltip>
    </QBtn>
  </QBtnGroup>
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
    showPlaces: {
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
    type: {
      default: 'full',
      type: String,
      validator (value) {
        return [
          'mini',
          'full',
        ].includes(value)
      },
    },
    groupId: {
      default: null,
      type: Number,
    },
  },
  computed: {
    options () {
      if (this.type === 'mini') {
        return {
          showBack: false,
          buttonSize: 'sm',
          showGroupsButton: false,
          showFullScreenButton: true,
        }
      }
      else {
        return {
          showBack: true,
          buttonSize: 'md',
          showGroupsButton: true,
          showFullScreenButton: false,
        }
      }
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
  z-index 1000
  .bottom-right
    left 5px
    top 5px
  .fa-check
    color $positive
  .fa-times
    color $negative
</style>
