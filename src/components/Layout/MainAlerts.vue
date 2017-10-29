<script>
import { connect } from 'vuex-connect'
import MainAlertsUI from './MainAlertsUI'

export default connect({
  actionsToEvents: {
    dismiss: 'alerts/dismiss',
  },
  gettersToProps: {
    alerts: 'alerts/list',
  },
})('MainAlerts', MainAlertsUI)
</script>
