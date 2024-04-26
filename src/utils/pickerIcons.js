/*

This relates to quasar-ui-qiconpicker

It includes icon-set files, which are not the icons themselves but
a big list with the names and tags.

They are quite big! In total 1.1MB of data (143kb gzipped).

We only actually use have 2 icon libraries installed so we can avoid loading them all.

Also, the component only lets you pick one icon-set at a time, but you can pass a list of icons...
So by doing this we can allow the users to choose icons from either set.

We used to have to use webpack IgnorePlugin to avoid all the icon sets bundled in,
but it seems to be OK now.
*/
import fontAwesomeV5 from '@quasar/quasar-ui-qiconpicker/dist/icon-set/fontawesome-v5.umd'
import materialIcons from '@quasar/quasar-ui-qiconpicker/dist/icon-set/material-icons.umd'

const icons = [
  ...fontAwesomeV5.icons,
  ...materialIcons.icons,
]

export default icons
