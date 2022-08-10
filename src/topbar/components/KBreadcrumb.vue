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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { QBtn } from 'quasar'

import { useActivePlaceService } from '@/places/services'
import { useActiveOfferService } from '@/offers/services'
import { useCurrentGroupService } from '@/group/services'
import { useActiveUserService } from '@/users/services'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useGroupInfoService } from '@/groupInfo/services'

const { t } = useI18n()

const route = useRoute()

const { group } = useCurrentGroupService()
const { offer } = useActiveOfferService()
const { place } = useActivePlaceService()
const { user } = useActiveUserService()

// TODO: detach from store
const store = useStore()
const { getGroupById } = useGroupInfoService()
const activePreviewId = computed(() => store.state.groups.activePreviewId)
const activeGroup = computed(() => getGroupById(activePreviewId.value))

// TODO: detach from store
const activeIssue = computed(() => store.getters['issues/current'])

const breadcrumbs = computed(() => findBreadcrumbs(route.matched))

function findBreadcrumbs (matched) {
  // Combine all the breadcrumbs from the root
  return matched.reduce((acc, m) => {
    if (m.meta && m.meta.breadcrumbs) {
      acc.push(...m.meta.breadcrumbs)
    }
    return acc
  }, [])
}

const elements = computed(() => breadcrumbs.value.map(breadcrumb => {
  if (breadcrumb.type === 'activeGroupPreview') {
    if (activeGroup.value) {
      return {
        name: activeGroup.value.name,
        route: { name: 'groupPreview', params: { groupPreviewId: activeGroup.value.id } },
      }
    }
  }
  else if (breadcrumb.type === 'activeIssue') {
    if (activeIssue.value) {
      return {
        name: activeIssue.value.affectedUser.displayName,
      }
    }
  }
  else if (breadcrumb.type === 'currentGroup') {
    if (group.value) {
      return {
        name: group.value.name,
        route: { name: 'group', params: { groupId: group.value.id } },
      }
    }
  }
  else if (breadcrumb.type === 'activeOffer') {
    if (offer.value) {
      if (offer.value) {
        return {
          name: offer.value.name,
        }
      }
    }
  }
  else if (breadcrumb.type === 'activePlace') {
    if (place.value) {
      return {
        name: place.value.name,
        route: { name: 'place', params: { placeId: place.value.id, groupId: place.value.group } },
      }
    }
  }
  else if (breadcrumb.type === 'activeUser') {
    if (user.value) {
      return {
        name: user.value.displayName,
        route: { name: 'user', params: { userId: user.value.id } },
      }
    }
  }
  else if (breadcrumb.translation) {
    return { ...breadcrumb, name: t(breadcrumb.translation) }
  }
  return breadcrumb
}))

const hasBreadcrumbs = computed(() => elements.value.length > 0)
const prevElements = computed(() => elements.value.slice(0, elements.value.length - 1))
const secondLastElement = computed(() => elements.value[elements.value.length - 2])
const lastElement = computed(() => elements.value[elements.value.length - 1])
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
