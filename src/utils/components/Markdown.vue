<script>
import markdown from './markdownRenderer'

export default {
  functional: true,
  props: {
    source: {
      required: true,
      type: String,
    },
  },
  render (h, { props, data }) {
    if (data.style || data.class || data.staticClass) {
      throw new Error('Markdown component does not support style or class attributes')
    }
    return h('div', {
      class: {
        markdown: true,
      },
      domProps: {
        innerHTML: markdown.render(props.source),
      },
    })
  },
}
</script>

<style scoped lang="stylus">
.markdown
  overflow-wrap break-word

.markdown >>>
  img.emoji
    width: 1em
    height: 1em
    margin: 0 .05em 0 .1em
    vertical-align: -0.1em

  a
    text-decoration underline
    opacity .9

    &:hover
      opacity 1

      &.fas-after::after
        opacity 1

    &.fas-after::after
      display inline-block
      padding-left 4px
      font-family 'Font Awesome 5 Free'
      font-size 80%
      font-weight 900
      text-decoration none
      opacity .7

    &.fa-after-external-link::after
      content "\F35D"

    &.fa-after-envelope::after
      content "\F0E0"

    &.fa-after-phone::after
      content "\F095"

  p
    margin-bottom 0.5rem

  h1
    font-size 1.6em
    line-height 1.12

  h2
    font-size 1.3em
    line-height 1.12

  h3
    font-size 1.2em
    line-height 1.12

  h4
    font-size 1.1em
    line-height 1.12

  h5, h6
    font-size 1em
    line-height 1.12

  pre
    display block;
    padding 3px
    margin-top 0.5rem
    margin-bottom 0.5rem
    overflow-x auto
    font-size 0.8em
    overflow-wrap normal
    background-color #ededed

  p > code
    padding-right 3px
    padding-left 3px
    overflow-x auto
    font-size 0.8em
    overflow-wrap normal;
    background-color #ededed

  blockquote
    padding-left 8px
    margin-top 0.5rem
    margin-bottom 0.5rem
    margin-left 0
    border-left 3px solid grey

    p:last-child
      margin-bottom 0rem

  img:not(.emoji)
    max-width 300px;
    max-height 150px
</style>
