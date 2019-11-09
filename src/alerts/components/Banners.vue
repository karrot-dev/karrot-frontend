<script>
import { connect } from 'vuex-connect'
import BannersUI from './BannersUI'

export default connect({
  actionsToEvents: {
    reconnect: 'connectivity/reconnect',
  },
  gettersToProps: {
    banners: 'banners/all',
  },
})('Banners', BannersUI)
</script>
