<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-bind="$attrs"
    class="markdown"
    v-html="rendered"
  />
  <!-- eslint-enable -->
</template>

<script>
import markdown from './markdownRenderer'
import { mapGetters } from 'vuex'

export default {
  props: {
    source: {
      required: true,
      type: String,
    },
    mentions: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters({
      users: 'users/byCurrentGroup',
    }),
    markdownEnv () {
      if (this.mentions && this.users) {
        return {
          users: this.users,
        }
      }
      return {}
    },
    rendered () {
      return markdown.render(this.source, this.markdownEnv)
    },
  },
}
</script>

<style scoped lang="sass">
.markdown
  overflow-wrap: break-word

.markdown ::v-deep()
  .mention
    padding: 2px 2px
    margin: 0 2px 0 2px
    font-weight: bold
    text-decoration: none
    background-color: $grey-3
    border-radius: 3px

  img.emoji
    width: 1em
    height: 1em
    margin: 0 .05em 0 .1em
    vertical-align: -0.1em

  a
    text-decoration: underline
    opacity: .9

    &:hover
      opacity: 1

      &.fas-after::after
        opacity: 1

    &.fas-after::after
      display: inline-block
      padding-left: 4px
      font-family: 'Font Awesome 5 Free'
      font-size: 80%
      font-weight: 900
      text-decoration: none
      opacity: .7

    &.fa-after-external-link::after
      content: "\F35D"

    &.fa-after-envelope::after
      content: "\F0E0"

    &.fa-after-phone::after
      content: "\F095"

  p
    margin-bottom: 0.5rem

  h1
    font-size: 1.6em
    line-height: 1.12

  h2
    font-size: 1.3em
    line-height: 1.12

  h3
    font-size: 1.2em
    line-height: 1.12

  h4
    font-size: 1.1em
    line-height: 1.12

  h5, h6
    font-size: 1em
    line-height: 1.12

  pre
    display: block
    padding: 3px
    margin-top: 0.5rem
    margin-bottom: 0.5rem
    overflow-x: auto
    font-size: 0.8em
    overflow-wrap: normal
    background-color: #ededed

  p > code
    padding-right: 3px
    padding-left: 3px
    overflow-x: auto
    font-size: 0.8em
    overflow-wrap: normal
    background-color: #ededed

  blockquote
    padding-left: 8px
    margin-top: 0.5rem
    margin-bottom: 0.5rem
    margin-left: 0
    border-left: 3px solid grey

    p:last-child
      margin-bottom: 0rem

  img:not(.emoji)
    max-width: 300px
    max-height: 150px
</style>
