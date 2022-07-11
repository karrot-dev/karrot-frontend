<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<script>
import { connect } from 'vuex-connect'
import GroupManageAgreement from '@/agreements/components/GroupManageAgreement'

export default connect({
  gettersToProps: {
    agreement: 'currentGroup/agreement',
  },
  actionsToEvents: {
    save: 'currentGroup/agreementSave',
    replace: 'currentGroup/agreementReplace',
    remove: 'currentGroup/agreementRemove',
  },
})('GroupManageAgreement', GroupManageAgreement)
</script>
