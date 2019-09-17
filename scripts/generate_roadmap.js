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

First of all, we want to support the existing users on karrot.world, which are mostly foodsaving groups. For this, we want to improve governance and statistics.

To use Karrot for other purposes than saving food, we want to consolidate a user base that is part of two or more groups. Development should focus on a useful platform for them to coordinate with their groups/teams and to create synergies of cooperation between groups and people in those groups. An example of that, which is already happening in Gothenburg, is the foodsaving group (Solikyl) and the Bike Kitchen group. There is potential for much more in this city, which could prototype this kind of use case.

To make Karrot useful to a wider public, we want to add sharing features and allow users to communicate directly with established groups, which would become hubs for saving and sharing. The possibility to create new groups for sharing stuff or coordinating activities would also be a much more straightforward feature.

Karrot is a free and open-source software and its vision should inspire more people to contribute and co-create it. Therefore we need to work also on the following:

- On governance and organisation: finish writing the constitution and defining what kind of association should be created. This would give clear guidelines for the role of contributors and ensures a more transparent and democratic development process.
- [Discuss and define the need and role of funding](https://community.foodsaving.world/t/funding-concept-for-karrot/136). Apply for grants when time is right and there is an opportunity.
- Start doing some PR and recruiting: by improving the website with a clearer description of what Karrot does and its vision, reach out in our networks to show it off and recruit new contributors.
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
