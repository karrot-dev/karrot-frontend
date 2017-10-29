<script>
import { connect } from 'vuex-connect'
import MainAlertsUI from './MainAlertsUI'

export default connect({
  actionsToEvents: {
    dismiss: 'alerts/dismiss',
    agree: 'agreements/agree',
  },
  gettersToProps: {
    alerts: 'alerts/all',
  },
})('MainAlerts', MainAlertsUI)
</script>
