<script>
import { connect } from 'vuex-connect'
import MainAlertsUI from './MainAlertsUI.vue'

export default connect({
  actionsToEvents: {
    dismiss: 'alerts/dismiss',
  },
  gettersToProps: {
    alerts: 'alerts/list',
  },
})('MainAlerts', MainAlertsUI)
</script>
