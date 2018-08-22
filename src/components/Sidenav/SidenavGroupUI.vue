<template>
  <SidenavBox
    @toggle="$emit('toggleBox')"
    :expanded="expanded"
  >
    <template slot="icon">
      <q-icon name="fas fa-fw fa-home" />
    </template>
    <template slot="name">
      {{ $t('GROUP.HOME') }}
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <q-btn
        flat
        dense
        round
        :to="{ name: 'groupSettings', params: { groupId } }"
      >
        <q-icon name="fas fa-cog fa-fw" />
        <q-tooltip v-t="'GROUP.SETTINGS'" />
      </q-btn>
      <q-btn
        flat
        dense
        round
      >
        <q-icon name="fas fa-fw fa-ellipsis-v" />
        <GroupOptions/>
      </q-btn>
    </div>

    <div>
      <q-list
        highlight
        no-border
        class="no-padding"
      >
        <q-item :to="{ name: 'group', params: { groupId } }">
          <q-item-side class="text-center">
            <q-icon name="fas fa-bullhorn" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.WALL") }}
          </q-item-main>
        </q-item>
        <q-item :to="{ name: 'groupPickups', params: { groupId } }">
          <q-item-side class="text-center">
            <q-icon name="fas fa-shopping-basket" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.PICKUPS") }}
          </q-item-main>
        </q-item>
        <q-item :to="{ name: 'groupMessages', params: { groupId } }">
          <q-item-side class="text-center">
            <q-icon name="fas fa-comments" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.MESSAGES") }}
          </q-item-main>
          <q-item-side
            v-if="unreadCount > 0"
            right
          >
            <q-chip
              small
              color="secondary"
            >
              {{ unreadCount }}
            </q-chip>
          </q-item-side>
        </q-item>
        <q-item :to="{ name: 'groupFeedback', params: { groupId } }">
          <q-item-side class="text-center">
            <q-icon name="fas fa-balance-scale" />
          </q-item-side>
          <q-item-main>
            {{ $t("PICKUP_FEEDBACK.TITLE") }}
          </q-item-main>
        </q-item>
        <q-item :to="{ name: 'groupDescription', params: { groupId } }">
          <q-item-side class="text-center">
            <i class="far fa-address-card"/>
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.DESCRIPTION") }}
          </q-item-main>
        </q-item>
        <q-item :to="{ name: 'groupMembers', params: { groupId } }">
          <q-item-side class="text-center">
            <q-icon name="fas fa-users" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.MEMBERS") }}
          </q-item-main>
        </q-item>
        <q-item :to="{ name: 'groupHistory', params: { groupId } }">
          <q-item-side class="text-center">
            <i class="far fa-clock"/>
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.HISTORY") }}
          </q-item-main>
        </q-item>
        <q-item
          v-if="$q.platform.is.mobile"
          :to="{ name: 'map', params: { groupId } }"
        >
          <q-item-side class="text-center">
            <q-icon name="fas fa-map" />
          </q-item-side>
          <q-item-main>
            {{ $t('GROUPMAP.TITLE') }}
          </q-item-main>
        </q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QItemSide, QItemMain, QIcon, QTooltip, QChip } from 'quasar'
import SidenavBox from './SidenavBox'
import GroupOptions from './GroupOptions'

export default {
  components: {
    SidenavBox, GroupOptions, QBtn, QList, QItem, QItemSide, QItemMain, QIcon, QTooltip, QChip,
  },
  props: {
    groupId: { required: true, type: Number },
    expanded: { default: true, type: Boolean },
    unreadCount: { default: 0, type: Number },
  },
}
</script>
