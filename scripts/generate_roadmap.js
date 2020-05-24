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
# Karrot Roadmap

## General Direction

First of all, we want to support the existing users on karrot.world, which are mostly foodsaving groups. For this, we want to improve governance and usability. That means we want to expand on the already existing voting feature and make it usable for general decision making, and we want to help users find their way around Karrot by offering them practical and concise tutorial videos.

Secondly, we want to make Karrot attractive to groups that have other purposes than saving food. Therefore we want to progress generalization and customization features, as well as easier ways to connect and switch between groups in one area.

Karrot is a free and open-source software and its vision should inspire more people to contribute and co-create it. Therefore we need to work also on the following:

- Grow the team of volunteers, also by reconnecting to foodsharing.de and its members
- Strengthen the bonds between users from different places and the development team, also by coming up with better participatory feature creation processes
- Create a sustainable working culture, also through new ways of dealing with money and putting an emphasis on intra-project care work
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
