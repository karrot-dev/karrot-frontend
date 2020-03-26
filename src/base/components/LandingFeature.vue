<template>
  <section
    class="row q-my-lg q-py-lg"
    :class="'side-' + side"
  >
    <div class="col-sm-8 q-px-lg self-center">
      <h2 v-t="t + '.TITLE'" />
      <p>
        <strong v-t="t + '.SUBTITLE'" />
      </p>
      <p v-t="t + '.DESCRIPTION'" />
    </div>
    <div class="col q-px-lg self-center col-image">
      <img
        :src="imageSrc"
        alt="karrot"
        class="screenshot"
      >
    </div>
  </section>
</template>

<script>
export default {
  props: {
    t: {
      type: String,
      required: true,
    },
    side: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
.screenshot
  width 100%
  box-shadow 1px 4px 10px rgba(1, 1, 1, .8)

// when narrow we don't want the left/right thing
@media (min-width: 600px)
  .side-right
    .col-image
      order -1000
</style>
