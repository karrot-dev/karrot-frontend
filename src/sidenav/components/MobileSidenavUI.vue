<template>
  <div>
    <SideNavBox
      v-if="currentUserId"
    >
      <template #icon>
        <QIcon name="fas fa-fw fa-user-circle" />
      </template>

      <template #name>
        {{ $t('USERDATA.ACCOUNT') }}
      </template>

      <SideNavMenu :entries="entries" />
    </SideNavBox>
  </div>
</template>
<script>

import {
  QIcon,
} from 'quasar'
import SideNavBox from '@/sidenav/components/SideNavBox'
import SideNavMenu from '@/sidenav/components/SideNavMenu'

export default {
  components: {
    QIcon,
    SideNavBox,
    SideNavMenu,
  },
  props: {
    currentUserId: {
      type: Number,
      default: null,
    },
  },
  computed: {
    entries () {
      return [{
        label: this.$t('TOPBAR.USERPROFILE'),
        icon: 'fas fa-user fa-fw',
        to: { name: 'user', params: { userId: this.currentUserId } },
      }, {
        label: this.$t('TOPBAR.CHANGE_GROUP'),
        icon: 'fas fa-exchange-alt fa-fw',
        to: { name: 'groupsGallery' },
      }, {
        label: this.$t('SETTINGS.TITLE'),
        icon: 'fas fa-cog fa-fw',
        to: { name: 'settings' },
      }, {
        label: this.$t('TOPBAR.LOGOUT'),
        icon: 'fas fa-sign-out-alt fa-fw',
        handler: () => {
          this.$emit('logout')
          this.$emit('toggle-sidenav')
        },
      }]
    },
  },
}
</script>
