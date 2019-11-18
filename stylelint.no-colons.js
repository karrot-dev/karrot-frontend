'use strict'

const stylelint = require('stylelint')

const hasBlock = require('stylelint/lib/utils/hasBlock')
const report = stylelint.utils.report
const ruleMessages = stylelint.utils.ruleMessages
const validateOptions = stylelint.utils.validateOptions

const ruleName = 'karrot/no-colons'

const messages = ruleMessages(ruleName, {
  rejected: 'Unexpected colon',
})

const plugin = stylelint.createPlugin(ruleName, (expectation, secondary, context) => {
  if (!expectation) return
  return (root, result) => {
    if (root.source.lang !== 'stylus') return

    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [true],
    })

    if (!validOptions) {
      return
    }

    root.walkAtRules((atRule) => {
      if (hasBlock(atRule)) {
        return
      }
      checkNode(atRule)
    })

    root.walkDecls((decl) => {
      checkNode(decl)
    })

    function checkNode (node) {
      const hasColon = !node.raws.stylusBetween && /:/.test(node.raws.between)

      if (!hasColon) return

      // auto-fix
      if (context.fix) {
        node.raws.stylusBetween = node.raws.between.replace(/:/g, '')
        return
      }

      const message = messages.rejected

      report({
        message,
        node,
        index: node.toString().trim().length,
        result,
        ruleName,
      })
    }
  }
})

plugin.ruleName = ruleName
plugin.messages = messages
module.exports = plugin
