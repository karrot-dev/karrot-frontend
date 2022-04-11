import markdownIt from 'markdown-it'
import markdownLinkAttributes from 'markdown-it-link-attributes'
import emoji from 'markdown-it-emoji'
import defaultEmojiShortcuts from 'markdown-it-emoji/lib/data/shortcuts'
import twemoji from 'twemoji'
import RegexPlugin from 'markdown-it-regexp'

import utils from 'markdown-it-regexp/lib/utils'

// Override to pass the env through...
RegexPlugin.prototype.render = function (tokens, id, options, env) {
  return this.replacer(tokens[id].meta.match, utils, env)
}

// Use a more basic smile for the default normal simple smile
const emojiShortcuts = { ...defaultEmojiShortcuts }
emojiShortcuts.slightly_smiling_face = emojiShortcuts.smiley
delete emojiShortcuts.smiley

const internalBaseURLs = []
if (!window.location.href.startsWith('file:///')) {
  internalBaseURLs.push(window.location.href.split('/#')[0])
}
if (process.env.KARROT.BACKEND) {
  internalBaseURLs.push(process.env.KARROT.BACKEND)
}

const mentions = RegexPlugin(
  /@([a-zA-Z0-9_\-.]+)/, // needs to match backend
  (match, utils, env) => {
    if (!env.users) return match[0]
    const username = match[1]
    const user = env.users.find(user => user.username === username)
    if (!user) return match[0]
    const url = `/#/user/${user.id}`
    return `
      <a class="mention" href="${utils.escape(url)}">
        @${utils.escape(user.username)}
      </a>`
  },
)

const md = markdownIt('zero', {
  html: false,
  breaks: true,
  linkify: true,
  typopgrapher: true,
  quotes: '“”‘’', // TODO support locale-specific quotes
})
  .use(mentions)
  .use(markdownLinkAttributes, [
    {
      matcher: href => href.startsWith('mailto:'),
      attrs: {
        class: 'fas-after fa-after-envelope',
      },
    },
    {
      matcher: href => href.startsWith('tel:'),
      attrs: {
        class: 'fas-after fa-after-phone',
      },
    },
    {
      matcher: href => internalBaseURLs.find(baseURL => href.startsWith(baseURL)),
      attrs: {},
    },
    {
      // default to external link
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
