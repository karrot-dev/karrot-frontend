<template>
  <QItem
    clickable
    @click="toggleAbout"
  >
    <QItemSection
      side
      class="text-center"
    >
      <KarrotLogo style="width: auto; height: 19px;" />
    </QItemSection>
    <QItemSection>
      {{ $t("GLOBAL.ABOUT_KARROT") }}
    </QItemSection>
  </QItem>
  <CommunityFeed />
  <QItem
    v-if="$q.platform.is.mobile"
    clickable
    @click="logout()"
  >
    <QItemSection side>
      <QIcon
        size="1em"
        name="fas fa-sign-out-alt fa-fw"
      />
    </QItemSection>
    <QItemSection>
      {{ $t('TOPBAR.LOGOUT') }}
    </QItemSection>
  </QItem>
  <QDialog v-model="showAbout">
    <KAbout @close="toggleAbout" />
  </QDialog>
</template>
<script setup>
import { QItem, QItemSection } from 'quasar'
import { ref } from 'vue'

import { useLogoutMutation } from '@/authuser/mutations'

import KAbout from '@/base/components/KAbout.vue'
import CommunityFeed from '@/communityFeed/components/CommunityFeed.vue'
import KarrotLogo from '@/logo/components/KarrotLogo.vue'

const { mutate: logout } = useLogoutMutation()

const showAbout = ref(false)

function toggleAbout () {
  showAbout.value = !showAbout.value
}
</script>
