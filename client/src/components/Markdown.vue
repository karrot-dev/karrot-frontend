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
  render (h, { props: { inline, source } }) {
    return h('div', {
      class: { parsed: true },
      domProps: { innerHTML: markdown.render(source) },
    })
  },
}
</script>

<style lang="stylus">
// TODO if you can make this work with scoped CSS, you get a (saved) cookie!
.parsed img.emoji
   height: 1em
   width: 1em
   margin: 0 .05em 0 .1em
   vertical-align: -0.1em
.parsed a
  text-decoration underline
</style>
