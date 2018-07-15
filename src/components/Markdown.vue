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
  >>> img.emoji
    height: 1em
    width: 1em
    margin: 0 .05em 0 .1em
    vertical-align: -0.1em
  >>> a
    text-decoration underline
</style>
