<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<script>
import { connect } from 'vuex-connect'
import router from '@/router'
import ApplicationFormUI from '@/applications/components/ApplicationFormUI'

export default connect({
  gettersToProps: {
    group: 'groups/activePreview',
    status: 'applications/applyStatus',
  },
  actionsToEvents: {
    apply: 'applications/apply',
  },
  methodsToEvents: {
    cancel: (_, groupId) => {
      router.push({ name: 'groupPreview', params: { groupId } }).catch(() => {})
    },
  },
})('ApplicationForm', ApplicationFormUI)
</script>
