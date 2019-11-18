'use strict'

const stylelint = require('stylelint')

const hasBlock = require('stylelint/lib/utils/hasBlock')
const report = stylelint.utils.report
const ruleMessages = stylelint.utils.ruleMessages
const validateOptions = stylelint.utils.validateOptions

const ruleName = 'karrot/no-semicolons'

const messages = ruleMessages(ruleName, {
  rejected: 'Unexpected semicolon',
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
      const isLast = node === node.parent.last
      const hasSemicolon = isLast ? node.parent.raws.semicolon : !node.omittedSemi

      if (!hasSemicolon) return

      // auto-fix
      if (context.fix) {
        if (isLast) {
          node.parent.raws.semicolon = false
        }
        else {
          node.omittedSemi = true
        }
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
