<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

<script>
import { connect } from 'vuex-connect'
import DeleteAccount from '@/authuser/components/Settings/DeleteAccount'

export default connect({
  gettersToProps: {
    status: 'deleteAccount/deleteAccountStatus',
    success: 'deleteAccount/success',
  },
  lifecycle: {
    // when page is loaded, use the `?code` route parameter to trigger deletion
    mounted: ({ getters, dispatch }) => dispatch('deleteAccount/deleteAccount', getters['route/query'].code),
  },
})('DeleteAccount', DeleteAccount)
</script>
