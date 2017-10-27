<script>
import markdownIt from 'markdown-it'
import markdownLinkAttributes from 'markdown-it-link-attributes'
import emoji from 'markdown-it-emoji'
import twemoji from 'twemoji'

const md = markdownIt({
  html: false,
  breaks: true,
  linkify: true,
  typopgrapher: true,
  quotes: '“”‘’', // TODO support locale-specific quotes
}).use(markdownLinkAttributes, {
  attrs: {
    target: '_blank',
    rel: 'noopener nofollow noreferrer',
  },
}).use(emoji)

md.renderer.rules.emoji = (token, idx) => twemoji.parse(token[idx].content)

export default {
  functional: true,
  props: {
    source: {
      required: true,
    },
  },
  render (h, { props: { source } }) {
    return h('div', {
      class: { parsed: true },
      domProps: { innerHTML: md.render(source) },
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
