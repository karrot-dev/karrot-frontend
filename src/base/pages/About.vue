<template>
  <div class="landing">
    <p class="text-center">
      <img
        :src="logo"
        class="logo"
      >
    </p>
    <h1 class="text-center">
      About Karrot as a project
    </h1>

    <section>
      <h2 v-t="'ABOUT_KARROT.SECTIONS.DEMOCRATIC.TITLE'" />
      <p v-t="'ABOUT_KARROT.SECTIONS.DEMOCRATIC.DESCRIPTION'" />
    </section>

    <section>
      <h2>Get involved</h2>
      <i18n
        path="ABOUT_KARROT.SECTIONS.DEMOCRATIC.DESCRIPTION2"
        tag="p"
      >
        <a
          slot="code"
          href="https://github.com/yunity/karrot-frontend"
        >GitHub</a>
      </i18n>
      <p> Rocket Chat </p>
      <p> Community Forum </p>
      <p> Mastodon </p>
    </section>
    <section>
      <h2>Vision and values</h2>
    </section>
  </div>
</template>

<script>
import logo from '@/logo/assets/carrot-logo.svg'
export default {
  created () {
    this.logo = logo
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.landing

  width 1050px
  max-width 100vw
  padding 40px
  margin 0 auto
  background white

  @media (min-width: 1050px)
    // extra padded when on a big enough screen
    padding 60px 100px

  section
    padding 30px 0
    margin 30px 0
    border-bottom 2px dotted $info

    &:last-child
      border none

    > h2
      margin-bottom 40px

  a
    text-decoration underline

  >>> p
    font-size 140%

  h1
    line-height 4rem

  h2
    margin-top 0

  .button
    display inline-block
    padding 10px
    margin 10px
    color white
    text-decoration none
    text-transform uppercase
    background var(--q-color-secondary)
    border-radius 3px

.inline-images
  padding 0
  margin 30px 0
  @media (min-width: 600px)
    // on wider screens, give them a bit more room to breathe
    padding 0 100px

.logo
  width 120px

.screenshot
  width 100%
  box-shadow 1px 4px 10px rgba(1, 1, 1, .8)

.screenshot-fullwidth
  @media (min-width: 1200px)
    // horizontally center the oversized image
    // (also needed an "overflow-x hidden" on the main page container, in Root)
    width 1200px
    margin-left 50%
    transform translateX(-50%)

// on wider screens alternate the left/right ordering
@media (min-width: 600px)
  .swap
    order -1000

</style>
