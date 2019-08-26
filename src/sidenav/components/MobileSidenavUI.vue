<template>
  <div>
    <SidenavBox
      v-if="currentUserId"
    >
      <template v-slot:icon>
        <QIcon name="fas fa-fw fa-user-circle" />
      </template>

      <template v-slot:name>
        {{ $t('USERDATA.ACCOUNT') }}
      </template>

      <SidenavMenu :entries="entries" />
    </SidenavBox>
  </div>
</template>
<script>

import {
  QIcon,
} from 'quasar'
import SidenavBox from '@/sidenav/components/SidenavBox'
import SidenavMenu from '@/sidenav/components/SidenavMenu'

export default {
  components: {
    QIcon,
    SidenavBox,
    SidenavMenu,
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
          this.$emit('toggleSidenav')
        },
      }]
    },
  },
}
</script>
