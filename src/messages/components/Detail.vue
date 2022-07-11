<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->



<<<<<<< HEAD

=======
<template>
  <DetailUI
    :user="$store.getters['detail/user']"
    :activity="$store.getters['detail/activity']"
    :application="$store.getters['detail/application']"
    :conversation="$store.getters['detail/conversation']"
    :away="$store.getters['presence/toggle/away']"
    :current-user="$store.getters['auth/user']"
    @send="data => $store.dispatch('conversations/send', data)"
    @mark="data => $store.dispatch('conversations/maybeMark', data)"
    @toggle-reaction="data => $store.dispatch('conversations/toggleReaction', data)"
    @save-message="data => $store.dispatch('conversations/saveMessage', data)"
    @fetch-past="data => $store.dispatch('conversations/fetchPast', data)"
    @fetch-future="data => $store.dispatch('currentThread/fetchFuture', data)"
    @application-accept="data => $store.dispatch('applications/accept', data)"
    @application-decline="data => $store.dispatch('applications/decline', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import DetailUI from './DetailUI'

export default {
  components: {
    DetailUI,
  },
}
</script>
