<template>
  <div
    class="notice q-pa-sm"
    style="margin: 0 auto"
  >
    <QCard
      color="secondary"
      class="generic-padding card items-center q-pa-none"
      :class="$q.platform.is.mobile ? 'column' : 'row no-wrap'"
    >
      <div class="icon">
        <slot name="icon" />
      </div>
      <div :class="!$q.platform.is.mobile ? 'q-ml-md' : 'text-center'">
        <div
          :class="$q.platform.is.mobile && 'q-mt-sm'"
        >
          <slot />
        </div>
        <div class="desc q-mt-md">
          <slot name="desc" />
        </div>
      </div>
    </QCard>
  </div>
</template>

<script>
import { QCard } from 'quasar'

export default {
  components: { QCard },
}
</script>

<style scoped lang="stylus">
@import '~variables'
@keyframes rotateIn
  0%
    transform rotate(0deg)
  100%
    transform rotate(-3deg)

.notice
  max-width 90%
  animation .3s ease-out 0s 1 rotateIn;
  transform rotate(-3deg);
  .icon
    font-size 4.5rem
  .desc
    font-size 80%
</style>
