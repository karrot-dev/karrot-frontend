<template>
  <div>
    <SidenavBox
      v-if="currentUserId"
    >
      <template slot="icon">
        <QIcon name="fas fa-fw fa-user-circle" />
      </template>

      <template slot="name">
        {{ $t('USERDATA.ACCOUNT') }}
      </template>

      <QList
        no-border
        link
      >
        <QItem
          item
          :to="{name: 'user', params: {userId: currentUserId}}"
        >
          <QItemSide>
            <i class="fas fa-user fa-fw" />
          </QItemSide>
          <QItemMain :label="$t('TOPBAR.USERPROFILE')" />
        </QItem>

        <QItem
          item
          :to="{name: 'groupsGallery'}"
        >
          <QItemSide>
            <i class="fas fa-exchange-alt" />
          </QItemSide>
          <QItemMain :label="$t('TOPBAR.CHANGE_GROUP')" />
        </QItem>

        <QItem
          item
          :to="{name: 'settings'}"
        >
          <QItemSide>
            <i class="fas fa-cog fa-fw" />
          </QItemSide>
          <QItemMain :label="$t('SETTINGS.TITLE')" />
        </QItem>

        <QItem
          @click.native="$emit('logout'), $emit('toggleSidenav')"
        >
          <QItemSide>
            <i class="fas fa-sign-out-alt fa-fw" />
          </QItemSide>
          <QItemMain :label="$t('TOPBAR.LOGOUT')" />
        </QItem>
      </QList>
    </SidenavBox>
  </div>
</template>
<script>

import {
  QList,
  QIcon,
  QItem,
  QItemSide,
  QItemMain,
} from 'quasar'
import SidenavBox from '@/sidenav/components/SidenavBox'

export default {
  components: {
    QList,
    QIcon,
    QItem,
    QItemSide,
    QItemMain,
    SidenavBox,
  },
  props: {
    currentUserId: {
      type: Number,
      default: null,
    },
  },
}
</script>
