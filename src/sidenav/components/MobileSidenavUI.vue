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
          <QItemSection side class="text-center">
            <i class="fas fa-user fa-fw" />
          </QItemSection>
          <QItemSection :label="$t('TOPBAR.USERPROFILE')" />
        </QItem>

        <QItem
          item
          :to="{name: 'groupsGallery'}"
        >
          <QItemSection side class="text-center">
            <i class="fas fa-exchange-alt" />
          </QItemSection>
          <QItemSection :label="$t('TOPBAR.CHANGE_GROUP')" />
        </QItem>

        <QItem
          item
          :to="{name: 'settings'}"
        >
          <QItemSection side class="text-center">
            <i class="fas fa-cog fa-fw" />
          </QItemSection>
          <QItemSection :label="$t('SETTINGS.TITLE')" />
        </QItem>

        <QItem
          @click.native="$emit('logout'), $emit('toggleSidenav')"
        >
          <QItemSection side class="text-center">
            <i class="fas fa-sign-out-alt fa-fw" />
          </QItemSection>
          <QItemSection :label="$t('TOPBAR.LOGOUT')" />
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
  QItemSection
  QItemSection,
} from 'quasar'
import SidenavBox from '@/sidenav/components/SidenavBox'

export default {
  components: {
    QList,
    QIcon,
    QItem,
    QItemSection
    QItemSection,
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
