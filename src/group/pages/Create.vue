<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->



<script>
import { connect } from 'vuex-connect'
import GroupEdit from '@/group/components/GroupEdit'

export default connect({
  gettersToProps: {
    timezones: 'timezones/autocompleteData',
    allGroups: 'groups/all',
    status: 'groups/createStatus',
    defaultMapCenter: 'geo/myCoordinates',
  },
  actionsToEvents: {
    save: 'groups/create',
  },
  methodsToEvents: {
    reset: ({ dispatch }) => dispatch('groups/meta/clear', ['create']),
  },
})('GroupCreate', GroupEdit)
</script>
