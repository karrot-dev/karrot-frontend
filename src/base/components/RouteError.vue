<template>
  <div
    v-if="hasError"
    class="error-page window-height window-width column items-center no-wrap"
  >
    <div class="error-code flex items-center justify-center">
      <img :src="rolling">
    </div>
    <div class="error-card q-pa-lg bg-white column items-center justify-center no-wrap rounded-borders">
      <div class="text-h2 q-pa-md">
        Oooooops!
      </div>
      <p
        v-if="message"
        class="caption text-center"
      >
        <span
          v-if="message.translation"
          v-t="message.translation"
        />
      </p>
      <p
        v-else
        class="caption text-center"
      >
        {{ $t('NOT_FOUND.EXPLANATION') }}
      </p>
      <p class="q-gutter-md">
        <QBtn
          v-if="canGoBack()"
          color="grey"
          icon="keyboard_arrow_left"
          :label="$t('BUTTON.BACK')"
          @click="goBack"
        />
        <QBtn
          color="secondary"
          icon="fas fa-home"
          :label="$t('NOT_FOUND.HOME')"
          @click="goHome"
        />
      </p>
    </div>
  </div>
</template>

<script setup>
import { QBtn } from 'quasar'
import { useRouter } from 'vue-router'

import rolling from '@/base/assets/rolling.png'
import { useRouteErrorService } from '@/base/services'

const router = useRouter()

const {
  hasError,
  message,
} = useRouteErrorService()

function canGoBack () {
  return window.history.length > 1
}

function goBack () {
  window.history.go(-1)
}

function goHome () {
  router.replace('/')
}
</script>

<style scoped lang="sass">
.error-page
  .error-code
    position: relative
    z-index: 0
    width: 200%
    height: 45vh
    padding-top: 15vh
    margin-top: -10vh
    overflow: hidden
    font-size: 30vmax
    color: rgba(255, 255, 255, .2)
    transform: rotate(-5deg)

    img
      position: absolute
      bottom: -20%
      left: 40%
      width: 30%
      min-width: 400px
      max-width: 700px
      transform: scaleX(-1) rotate(-17deg)

  .error-card
    z-index: 10
    width: 80vw
    max-width: 600px
    margin-top: -30px

    > h1
      margin-bottom: 0
      font-size: 3.2em

    > i
      font-size: 5rem
</style>
