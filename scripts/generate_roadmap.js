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

const {Octokit} = require('@octokit/rest')

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

## General Direction

Main topics of Karrot are currently generalization, that means making the features on Karrot available for customization beyond just food pick-ups.
We also want to work on governance topics: how to make decision both in groups and about further Karrot development.
We are taking steps to connect more with the existing user community, but also other people via social media (e.g. Mastodon) and academia.

In the next months, we want to continue working on the stuff that we already started before. In the last months, we established a steady work flow that should help us to do things and put the "dreaming" part on a back-burner.
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
