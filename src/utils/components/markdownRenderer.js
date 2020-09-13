import markdownIt from 'markdown-it'
import markdownLinkAttributes from 'markdown-it-link-attributes'
import emoji from 'markdown-it-emoji'
import defaultEmojiShortcuts from 'markdown-it-emoji/lib/data/shortcuts'
import twemoji from 'twemoji'
import escapeRegExp from 'escape-string-regexp'

// Use a more basic smile for the default normal simple smile
const emojiShortcuts = { ...defaultEmojiShortcuts }
emojiShortcuts.slightly_smiling_face = emojiShortcuts.smiley
delete emojiShortcuts.smiley

const internalLinkParts = ['$']
if (!window.location.href.startsWith('file:///')) {
  internalLinkParts.push(escapeRegExp(window.location.href.split('/#')[0]))
}
if (process.env.KARROT.BACKEND) {
  internalLinkParts.push(escapeRegExp(process.env.KARROT.BACKEND))
}
const internalLinkPattern = RegExp(`^(${internalLinkParts.join('|')})`)

const md = markdownIt('zero', {
  html: false,
  breaks: true,
  linkify: true,
  typopgrapher: true,
  quotes: '“”‘’', // TODO support locale-specific quotes
})
  .use(markdownLinkAttributes, [
    {
      pattern: /^mailto:/,
      attrs: {
        class: 'fas-after fa-after-envelope',
      },
    },
    {
      pattern: /^tel:/,
      attrs: {
        class: 'fas-after fa-after-phone',
      },
    },
    {
      pattern: internalLinkPattern,
      attrs: {},
    },
    {
      // default to external link
      pattern: /.*/,
      attrs: {
        target: '_blank',
        rel: 'noopener nofollow noreferrer',
        class: 'fas-after fa-after-external-link',
      },
    },
  ])
  .use(emoji, {
    shortcuts: emojiShortcuts,
  })
  .enable([
    'heading',
    'emphasis',
    'strikethrough',
    'blockquote',
    'newline',
    'image',
    'link',
    'backticks',
    'linkify',
    'hr',
    'list',
    'fence',
    'code',
  ])

md.renderer.rules.emoji = (token, idx) => twemoji.parse(token[idx].content)

export default md
