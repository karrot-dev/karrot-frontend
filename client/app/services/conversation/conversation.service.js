class ConversationService {

  constructor(CurrentUsers, Message, Socket, $log, $timeout, $http) {
    "ngInject";
    Object.assign(this, {
      CurrentUsers,
      Message,
      Socket,
      $log,
      $timeout,
      $http
    });
  }

  subscribe(conversationId) {

    let messages = [];

    this.Socket.connect();

    // Send a message in the context of this conversation
    let sendMessage = ({ content }) => {
      // TODO: add optimistic sending (add it to messages immediately, but marked as "sending")
      return this.Message.create({ conversation: conversationId, content });
    };

    // This receives all socket messages then filters for the ones we want
    let receiveSocketMessage = ({ topic, payload }) => {
      if (topic !== "conversations:message") return;
      if (payload.conversation.id !== conversationId) return;
      Object.assign(payload, {
        user: this.CurrentUsers.get(payload.author)
      });
      this.$timeout(() => messages.push(payload));
    };

    // Fetch the initial messages first before we subscribe for new ones
    // TODO: there is a small chance we get a message twice if the timing is bad
    return this.Message.list(conversationId).then((items) => {

      // Set the user on them
      items.forEach((item) => {
        Object.assign(item, {
          user: this.CurrentUsers.get(item.author)
        });
      });

      // Append all new messages, wrapped in $timeout to update angular
      this.$timeout(() => Array.prototype.push.apply(messages, items));
    }).then(() => {
      return {
        messages,
        sendMessage,
        unsubscribe: this.Socket.subscribe(receiveSocketMessage)
      };
    });
  }

}

export default ConversationService;
