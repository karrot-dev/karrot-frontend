class ConversationService {

  constructor(Message, Socket, $log, $timeout, $http) {
    "ngInject";
    Object.assign(this, {
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
      this.$timeout(() => messages.push(payload));
    };

    // Fetch the initial messages first before we subscribe for new ones
    // TODO: there is a small chance we get a message twice if the timing is bad
    return this.Message.list(conversationId).then((items) => {
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
