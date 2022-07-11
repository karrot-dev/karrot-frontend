<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
<template>
  <DetailHeaderUI
    :user="$store.getters['detail/user']"
    :activity="$store.getters['detail/activity']"
    :application="$store.getters['detail/application']"
    :conversation="$store.getters['detail/conversation']"
    :current-user="$store.getters['auth/user']"
    @save-conversation="data => $store.dispatch('conversations/maybeSave', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import DetailHeaderUI from './DetailHeaderUI'

export default {
  components: {
    DetailHeaderUI,
  },
}
</script>
