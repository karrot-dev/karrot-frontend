<template>
  <q-toolbar>
    <router-link :to="{name: 'group'}" class="logo">
      <KarrotLogo />
    </router-link>
    <q-toolbar-title>
      <div class="row justify-between no-wrap">
        <div></div>
        <KBreadcrumb class="bread" :breadcrumbs="breadcrumbs" />
        <div></div>
      </div>
    </q-toolbar-title>
    <div class="actions">
      <LocaleSelect />
      <router-link :to="{ name: 'login' }">
        <q-btn>{{ $t('LOGIN.SUBMIT') }}</q-btn>
      </router-link>
      <router-link :to="{ name: 'signup' }">
        <q-btn flat class="submit shadow-4">{{ $t('LOGIN.SIGNUP') }}</q-btn>
      </router-link>
    </div>
  </q-toolbar>
</template>

<script>
import { QToolbar, QToolbarTitle, QBtn } from 'quasar'
import KarrotLogo from '@/components/Layout/KarrotLogo'
import KBreadcrumb from '@/components/General/KBreadcrumb'
import LocaleSelect from '@/components/General/LocaleSelect'

export default {
  components: {
    QToolbar, QToolbarTitle, QBtn, KarrotLogo, KBreadcrumb, LocaleSelect,
  },
  props: {
    breadcrumbs: { required: false, default: () => [] },
    currentUserId: {},
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.logo
  margin-left 1em
  height 36px

.white-box
  background-color white
  border-radius $borderRadiusSmall
  padding 0 .2em
  margin 0 .3em
  .q-field
    margin-top .2em
.error
  color $warning
  margin 0 1em
  .fa
    margin-right .5em
.submit
  color white
  background-color $secondary
.submit:hover
  background-color $positive
.shake
  animation shake 0.82s cubic-bezier(.36, .07, .19, .97) both
  transform translate3d(0, 0, 0)
  backface-visibility hidden
  perspective 1000px

@keyframes shake
  10%, 90%
    transform translate3d(-1px, 0, 0)
  20%, 80%
    transform translate3d(2px, 0, 0)
  30%, 50%, 70%
    transform translate3d(-4px, 0, 0)
  40%, 60%
    transform translate3d(4px, 0, 0)

</style>
