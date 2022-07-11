<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


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
