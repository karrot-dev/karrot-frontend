export default store => {
  store.watch(state => state.route.query && state.route.query.mute_conversation, muteConversation => {
    if (muteConversation) {
      const isLoggedIn = store.getters['auth/isLoggedIn']
      if (isLoggedIn) {
        store.dispatch('conversations/maybeToggleEmailNotifications', {
          conversationId: muteConversation,
          value: false,
        })
      }
      else {
        store.dispatch('auth/setMuteConversationAfterLogin', muteConversation)
      }
    }
  }, { immediate: true })
}
