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
    height: 1em
    width: 1em
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
      padding-left 4px
      font-family 'Font Awesome 5 Free'
      font-weight 900
      font-size 80%
      display inline-block
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
  h2
    font-size 1.3em
  h3
    font-size 1.2em
  h4
    font-size 1.1em
  h5, h6
    font-size 1em
  pre
    font-size 0.8em
    padding 3px
    background-color #ededed
    margin-top 0.5rem
    margin-bottom 0.5rem
    overflow-x auto
    overflow-wrap normal
    display block
  p > code
    font-size 0.8em
    padding-left 3px
    padding-right 3px
    background-color #ededed
    overflow-x auto
    overflow-wrap normal
  blockquote
    margin-bottom 0.5rem
    p:last-child
      margin-bottom 0rem
  img:not(.emoji)
    max-height 150px
    max-width 300px
</style>
