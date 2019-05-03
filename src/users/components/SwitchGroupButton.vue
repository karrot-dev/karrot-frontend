<template>
  <QBtn
    v-if="groups.length > 1 || (isLoaded && !currentGroup)"
    color="primary"
    @click="showModal = true"
  >
    {{ currentGroup ? currentGroup.name : $t('TOPBAR.CHANGE_GROUP') }}
    <QModal
      v-model="showModal"
      minimized
    >
      <QList>
        <QListHeader>
          {{ user.isCurrentUser ? $t('JOINGROUP.MY_GROUPS') : $t('SWITCHGROUP.COMMON_GROUPS') }}
        </QListHeader>
        <QItem
          v-for="group in commonGroups"
          :key="group.id"
          v-close-overlay
          link
          @click.native="$emit('selectGroup', { groupId: group.id })"
        >
          <QItemMain>
            {{ group.name }}
          </QItemMain>
          <QItemSide
            v-if="group.isCurrentGroup"
            right
            icon="fas fa-star"
            color="secondary"
          />
        </QItem>
        <QListHeader v-if="otherGroups.length > 0">
          {{ $t('SWITCHGROUP.OTHER_GROUPS') }}
        </QListHeader>
        <QItem
          v-for="group in otherGroups"
          :key="group.id"
          :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }"
        >
          <QItemMain>
            {{ group.name }}
          </QItemMain>
        </QItem>
      </QList>
    </QModal>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QList,
  QListHeader,
  QItem,
  QItemMain,
  QItemSide,
  QModal,
} from 'quasar'

export default {
  components: {
    QBtn,
    QList,
    QListHeader,
    QItem,
    QItemMain,
    QItemSide,
    QModal,
  },
  props: {
    groups: {
      default: () => [],
      type: Array,
    },
    user: {
      default: null,
      type: Object,
    },
  },
  data () {
    return {
      showModal: false,
    }
  },
  computed: {
    isLoaded () {
      return this.groups.length > 0
    },
    currentGroup () {
      return this.groups.find(g => g.isCurrentGroup)
    },
    commonGroups () {
      return this.groups.filter(g => g.isMember)
    },
    otherGroups () {
      return this.groups.filter(g => !g.isMember)
    },
  },
}
</script>
