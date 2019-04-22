<template>
  <div class="error-page window-height window-width bg-primary column items-center no-wrap">
    <div class="error-code bg-light flex items-center justify-center">
      <img src="@/base/assets/rolling.png">
    </div>
    <div class="error-card shadow-4 bg-white column items-center justify-center no-wrap">
      <h1 class="accent-font">
        Oooooops!
      </h1>
      <slot>
        <p class="caption text-center">
          {{ $t('NOT_FOUND.EXPLANATION') }}
        </p>
      </slot>
      <p class="text-center group">
        <QBtn
          v-if="canGoBack"
          color="secondary"
          push
          icon="keyboard_arrow_left"
          @click="goBack"
        >
          {{ $t('BUTTON.BACK') }}
        </QBtn>
        <QBtn
          color="secondary"
          push
          icon-right="fas fa-home"
          @click="$router.replace('/')"
        >
          {{ $t('NOT_FOUND.HOME') }}
        </QBtn>
      </p>
    </div>
  </div>
</template>

<script>
import { QBtn } from 'quasar'

export default {
  components: {
    QBtn,
  },
  data () {
    return {
      canGoBack: window.history.length > 1,
    }
  },
  methods: {
    goBack () {
      window.history.go(-1)
    },
  },
}
</script>

<style scoped lang="stylus">
.error-page
  .error-code
    height 45vh
    margin-top -10vh
    width 200%
    padding-top 15vh
    font-size 30vmax
    color rgba(255, 255, 255, .2)
    overflow hidden
    transform rotate(-5deg)
    z-index 0
    position relative
    img
      width 30%
      min-width: 400px
      max-width 700px
      transform scaleX(-1) rotate(-17deg)
      position absolute
      bottom -20%
      left 40%
  .error-card
    border-radius 2px
    margin-top -30px
    width 80vw
    max-width 600px
    padding 25px
    z-index 10
    > h1
      font-size 3.2em
      margin-bottom 0
    > i
      font-size 5rem
</style>
