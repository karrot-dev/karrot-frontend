import markdownIt from 'markdown-it'
import markdownLinkAttributes from 'markdown-it-link-attributes'
import emoji from 'markdown-it-emoji'
import twemoji from 'twemoji'
import escapeRegExp from 'escape-string-regexp'

const escapedHost = escapeRegExp(window.location.href.split('/#')[0])
const pattern = RegExp(`^(?!$)(?!${escapedHost})`)

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
      pattern,
      attrs: {
        target: '_blank',
        rel: 'noopener nofollow noreferrer',
        class: 'fas-after fa-after-external-link',
      },
    },
  ])
  .use(emoji)
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
