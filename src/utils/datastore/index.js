import about from '@/utils/datastore/about'
import connectivity from '@/utils/datastore/connectivity'
import presence from '@/utils/datastore/presence'
import refresh from '@/utils/datastore/refresh'
import refreshPlugin from '@/utils/datastore/refreshPlugin'

export default {
  modules: {
    about,
    connectivity,
    presence,
    refresh,
  },
  plugins: [
    refreshPlugin,
  ],
}
