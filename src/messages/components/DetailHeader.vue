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

<script>
import DetailHeaderUI from './DetailHeaderUI'

export default {
  components: {
    DetailHeaderUI,
  },
}
</script>
