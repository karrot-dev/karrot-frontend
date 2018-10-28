import currentGroup, { plugin as currentGroupPlugin } from '@/group/datastore/currentGroup'
import timezones from '@/group/datastore/timezones'

export default {
  modules: {
    currentGroup,
    timezones,
  },
  plugins: [
    currentGroupPlugin,
  ],
}
