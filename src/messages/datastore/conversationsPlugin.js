export default datastore => {
  datastore.watch(state => state.route.query && state.route.query.mute_conversation, muteConversation => {
    if (muteConversation) {
      const isLoggedIn = datastore.getters['auth/isLoggedIn']
      if (isLoggedIn) {
        datastore.dispatch('conversations/maybeSetMuted', {
          conversationId: muteConversation,
          value: false,
        })
      }
      else {
        datastore.dispatch('auth/setMuteConversationAfterLogin', muteConversation)
      }
    }
  }, { immediate: true })
}
