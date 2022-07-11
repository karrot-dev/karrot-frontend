<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
<template>
  <GroupOptionsUI
    :current-group-id="$store.getters['currentGroup/id']"
    :roles="$store.getters['currentGroup/roles']"
    @leave="data => $store.dispatch('groups/leave', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import GroupOptionsUI from './GroupOptionsUI'

export default {
  components: {
    GroupOptionsUI,
  },
}
</script>
