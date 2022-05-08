<template>
  <div
    class="row q-gutter-md q-mt-md landing-buttons"
    :class="{ 'align-left-on-bigger-screens': alignLeftOnBiggerScreens }"
  >
    <RouterLink
      v-if="!isLoggedIn"
      :to="{ name: 'signup' }"
    >
      <QBtn
        :label="$t('SIGNUP.TITLE')"
        color="secondary"
        unelevated
        class="button"
      />
    </RouterLink>
    <RouterLink
      :to="{ name: 'groupsGallery' }"
    >
      <QBtn
        :label="$t('JOINGROUP.BROWSE_GROUPS')"
        color="secondary"
        outline
        class="button"
      />
    </RouterLink>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { QBtn } from 'quasar'

export default {
  components: {
    QBtn,
  },
  props: {
    alignLeftOnBiggerScreens: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
}
</script>

<style scoped lang="sass">
.landing-buttons
  justify-content: center
  // q-gutter-md defines a 16px gutter which isn't optimal
  // -> override x-axis gutter to be 10px instead
  margin-left: -10px

  > *
    margin-left: 10px

  &.align-left-on-bigger-screens
    @media (min-width: 600px)
      justify-content: flex-start

  a
    flex-shrink: 0

    .button
      @media (min-width: 410px)
        font-size: 1rem // 16px
</style>
