<script>
import markdownIt from 'markdown-it'
import markdownLinkAttributes from 'markdown-it-link-attributes'

const md = markdownIt({
  html: false,
  breaks: true,
  linkify: true,
  typopgrapher: true,
  quotes: '“”‘’', // TODO support locale-specific quotes
}).use(markdownLinkAttributes, {
  target: '_blank',
  rel: 'noopener nofollow noreferrer',
})

export default {
  functional: true,
  props: {
    source: {
      required: true,
    },
  },
  render (h, { props: { source } }) {
    return h('div', {
      domProps: {
        innerHTML: md.render(source),
      },
    })
  },
}
</script>
