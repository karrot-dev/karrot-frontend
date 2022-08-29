/*

This relates to quasar-ui-qiconpicker

It includes icon-set files, which are not the icons themselves but
a big list with the names and tags.

They are quite big! In total 1.1MB of data (143kb gzipped).

We only actually use have 2 icon libraries installed so we can avoid loading them all.
In theory the library could load them async, but it uses require() and webpack eagerly loads them all.

Also, the component only lets you pick one icon-set at a time, but you can pass a list of icons...
So by doing this we can allow the users to choose icons from either set.

We use webpack IgnorePlugin so the component doesn't automatically load any of these icon-set files.
We are then relying on loading them explicitly here.

*/
import fontAwesomeV5 from '@quasar/quasar-ui-qiconpicker/dist/icon-set/fontawesome-v5.umd'
import materialIcons from '@quasar/quasar-ui-qiconpicker/dist/icon-set/material-icons.umd'

const icons = [
  ...fontAwesomeV5.icons,
  ...materialIcons.icons,
]

export default icons

export const tags = getTags()

function getTags () {
  const results = new Set()
  for (const icon of icons) {
    for (const tag of icon.tags) {
      results.add(tag)
    }
  }
  return Array.from(results).sort((a, b) => a.localeCompare(b))
}
