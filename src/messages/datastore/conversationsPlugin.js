export default datastore => {
  datastore.watch(state => state.route.query && state.route.query.mute_conversation, muteConversation => {
    if (muteConversation) {
      const isLoggedIn = datastore.getters['auth/isLoggedIn']
      if (isLoggedIn) {
        datastore.dispatch('conversations/maybeSave', {
          conversationId: muteConversation,
          value: {
            notifications: 'muted',
          },
        })
      }
      else {
        datastore.dispatch('auth/setMuteConversationAfterLogin', muteConversation)
      }
    }
  }, { immediate: true })
}
