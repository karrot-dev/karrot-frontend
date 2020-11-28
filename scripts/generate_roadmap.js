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

const { Octokit } = require('@octokit/rest')

const octokit = new Octokit()

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
# Karrot Roadmap

## General Direction as of 2020-11-22

- usability! maybe a pipeline, people notice little niggles, katie can sketch some solutions, and bruno and the students can implement it! supported with Nicks help
- finish the governance design process, let's see about actually implementing
- conceptualizing of karrot itself, values, etc... a clearer message, leading to outreach, what is it and how does it work? a rocket chat channel...?
- generalization progress, continuing momentum
- maintainance + code improvements
`

async function run ({ owner, repo }) {
  const result = await octokit.issues.listMilestones({ owner, repo })
  const output = [HEADER.trim()]
  for (const milestone of result.data.sort(sortMilestones)) {
    output.push(`## ${milestone.title}`)
    output.push(milestone.description)
    output.push((await getIssues({ owner, repo, milestone: milestone.number })).map(issue => {
      return `- [${issue.title}](${issue.html_url})`
    }).join('\n'))
    output.push(`[View issues](${milestone.html_url})`)
  }
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
