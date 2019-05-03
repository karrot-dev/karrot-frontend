#!/usr/bin/env node
/*
 * Generates the content used for ROADMAP.md by fetching information from the GitHub API.
 *
 * To update the roadmap run:
 *
 *   ./scripts/generate_roadmap.js > ROADMAP.md
 *
 * You might exceed the API quota if you run it a lot, in which case generate a personal access token
 * and specify it via the GITHUB_TOKEN environment variable. e.g.:
 *
 *   GITHUB_TOKEN=myspecialtoken ./scripts/generate_roadmap.js > ROADMAP.md
 *
 */

const Octokit = require('@octokit/rest')

const octokit = Octokit()

const { GITHUB_TOKEN } = process.env
if (GITHUB_TOKEN) {
  octokit.authenticate({
    type: 'token',
    token: GITHUB_TOKEN,
  })
}

run({
  owner: 'yunity',
  repo: 'karrot-frontend',
})

const HEADER = `
# karrot Roadmap

Only major features and improvements will be listed here.
`
const FOOTER = `
## Ideas / Brainstorming

Rough ideas, have been mentioned by someone.

- Sharing of things: text+image with a tag system
- Undo functionality for changes
- Make karrot into a multisharing platform
`

async function run ({ owner, repo }) {
  const result = await octokit.issues.listMilestonesForRepo({ owner, repo })
  const output = [HEADER.trim()]
  for (const milestone of result.data.sort(sortMilestones)) {
    output.push(`## ${milestone.title}`)
    output.push(milestone.description)
    output.push((await getIssues({ owner, repo, milestone: milestone.number })).map(issue => {
      return `- [${issue.title}](${issue.html_url})`
    }).join('\n'))
    output.push(`[View issues](${milestone.html_url})`)
  }
  output.push(FOOTER.trim())
  console.log(output.join('\n\n').trim() + '\n')
}

async function getIssues ({ owner, repo, milestone }) {
  const result = await octokit.issues.listForRepo({ owner, repo, milestone })
  return result.data
}

function scoreMilestone ({ title }) {
  let score = 0
  if (/development/i.test(title)) score += 2
  if (/higher/i.test(title)) score += 1
  return score
}

function sortMilestones (a, b) {
  return scoreMilestone(b) - scoreMilestone(a)
}
