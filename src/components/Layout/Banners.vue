<script>
import { connect } from 'vuex-connect'
import BannersUI from './BannersUI'

export default connect({
  actionsToEvents: {
    dismiss: 'banners/dismiss',
    agree: 'agreements/agree',
  },
  gettersToProps: {
    banners: 'banners/all',
  },
})('Banners', BannersUI)
</script>
