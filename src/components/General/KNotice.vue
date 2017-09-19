<template>
   <div class="notice">
    <q-card color="secondary" class="generic-padding row no-wrap">
      <div>
        <div class="icon">
          <slot name="icon"/>
        </div>
      </div>
      <div>
        <h5>
          <slot/>
        </h5>
        <slot name="desc"/>
      </div>
    </q-card>
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
.card
  margin 0
.padding
  padding 1em
.notice
  .icon
    font-size 4rem
    margin .1em 0 0 0
    padding-right .3em
  padding 2em 3em
  transform: translateZ(1px) rotate(-3deg);
  h5
    padding 0
</style>
