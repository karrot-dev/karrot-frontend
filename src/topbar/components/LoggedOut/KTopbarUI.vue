<template>
  <QToolbar>
    <RouterLink
      :to="'/'"
      class="logo"
    >
      <KarrotLogo show-loading />
    </RouterLink>
    <QToolbarTitle>
      <div class="row justify-between no-wrap">
        <div />
        <KBreadcrumb
          class="bread"
          :breadcrumbs="breadcrumbs"
        />
        <div />
      </div>
    </QToolbarTitle>
    <div class="actions">
      <LocaleSelect />
      <RouterLink :to="{ name: 'login' }">
        <QBtn class="text-white">
          {{ $t('LOGIN.SUBMIT') }}
        </QBtn>
      </RouterLink>
      <RouterLink
        v-if="!$q.platform.is.mobile"
        :to="{ name: 'signup' }"
      >
        <QBtn
          flat
          class="text-white bg-secondary"
        >
          {{ $t('LOGIN.SIGNUP') }}
        </QBtn>
      </RouterLink>
    </div>
  </QToolbar>
</template>

<script>
import { QToolbar, QToolbarTitle, QBtn } from 'quasar'
import KarrotLogo from '@/logo/components/KarrotLogo'
import KBreadcrumb from '@/topbar/components/KBreadcrumb'
import LocaleSelect from '@/utils/components/LocaleSelect'

export default {
  components: {
    QToolbar, QToolbarTitle, QBtn, KarrotLogo, KBreadcrumb, LocaleSelect,
  },
  props: {
    breadcrumbs: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.logo
  margin-left 1em
  height 36px
.actions .router-link-exact-active
  display none
</style>
