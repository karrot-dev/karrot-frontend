<script>
import { connect } from 'vuex-connect'
import BannersUI from './BannersUI'

export default connect({
  actionsToEvents: {
    agree: 'agreements/agree',
    reconnect: 'connectivity/reconnect',
  },
  gettersToProps: {
    banners: 'banners/all',
  },
})('Banners', BannersUI)
</script>
