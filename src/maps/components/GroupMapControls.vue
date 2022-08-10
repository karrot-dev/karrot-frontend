<template>
  <QBtnGroup class="k-groupmapcontrols">
    <QBtn
      v-if="options.showFullScreenButton"
      :size="options.buttonSize"
      color="primary"
      :to="{ name: 'map' }"
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
      :to="{ name: 'group' }"
    >
      <i class="fas fa-fw fa-chevron-left" />
      <QTooltip>
        {{ $t('BUTTON.BACK') }}
      </QTooltip>
    </QBtn>

    <QBtn
      color="primary"
      :size="options.buttonSize"
      @click="togglePlaces()"
    >
      <span class="fa-fw fa-stack">
        <i
          class="fa-stack-1x"
          :class="$icon('place')"
        />
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
        {{ $t( showPlaces ? 'GROUPMAP.HIDE_PLACES' : 'GROUPMAP.SHOW_PLACES') }}
      </QTooltip>
    </QBtn>

    <QBtn
      color="primary"
      :size="options.buttonSize"
      @click="toggleUsers()"
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
      v-if="!hideGroupsButton"
      color="primary"
      :size="options.buttonSize"
      @click="toggleGroups()"
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

    <QBtn
      v-if="options.showExportButton"
      color="primary"
      :size="options.buttonSize"
      @click="$emit('export')"
    >
      <i class="fas fa-download" />
      <QTooltip>
        {{ $t('GROUPMAP.EXPORT') }}
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
import { useMapToggles } from '@/maps/services'

export default {
  components: {
    QBtn,
    QBtnGroup,
    QTooltip,
  },
  props: {
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
    hideGroupsButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'export',
  ],
  setup () {
    const {
      showPlaces,
      showUsers,
      showGroups,
      togglePlaces,
      toggleUsers,
      toggleGroups,
    } = useMapToggles()
    return {
      showPlaces,
      showUsers,
      showGroups,
      togglePlaces,
      toggleUsers,
      toggleGroups,
    }
  },
  computed: {
    options () {
      if (this.type === 'mini') {
        return {
          showBack: false,
          buttonSize: 'sm',
          showExportButton: false,
          showFullScreenButton: true,
        }
      }
      else {
        return {
          showBack: true,
          buttonSize: 'md',
          showExportButton: true,
          showFullScreenButton: false,
        }
      }
    },
  },
}
</script>

<style scoped lang="sass">
.k-groupmapcontrols
  position: absolute
  top: 5px
  right: 10px
  z-index: 1000

  .bottom-right
    top: 5px
    left: 5px

  .fa-check
    color: $positive

  .fa-times
    color: $negative
</style>
