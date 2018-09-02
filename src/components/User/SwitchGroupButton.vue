<template>
  <q-btn
    color="primary"
    @click="showModal = true"
    v-if="groups.length > 1"
  >
    {{ currentGroup ? currentGroup.name : $t('TOPBAR.CHANGE_GROUP') }}
    <q-modal
      v-model="showModal"
      minimized
    >
      <q-list>
        <q-list-header>
          {{ user.isCurrentUser ? $t('JOINGROUP.MY_GROUPS') : $t('SWITCHGROUP.COMMON_GROUPS') }}
        </q-list-header>
        <q-item
          v-for="group in commonGroups"
          :key="group.id"
          link
          @click.native="$emit('selectGroup', { groupId: group.id })"
          v-close-overlay
        >
          <q-item-main>
            {{ group.name }}
          </q-item-main>
          <q-item-side
            v-if="group.isCurrentGroup"
            right
            icon="fas fa-star"
            color="secondary"
          />
        </q-item>
        <q-list-header v-if="otherGroups.length > 0">
          {{ $t('SWITCHGROUP.OTHER_GROUPS') }}
        </q-list-header>
        <q-item
          v-for="group in otherGroups"
          :key="group.id"
          :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }"
        >
          <q-item-main>
            {{ group.name }}
          </q-item-main>
        </q-item>
      </q-list>
    </q-modal>
  </q-btn>
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
