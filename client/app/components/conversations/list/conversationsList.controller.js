class ConversationsListController {
  constructor(Authentication, Conversations, $scope) {
    "ngInject";
    this.list = [];
    this.isInitialized = false;

    Promise.all([
      Authentication.update(),
      Conversations.list()
    ]).then( ([loggedin, conversations]) => {
      this.list = conversations.map( ({ id,type,topic,messages,participants }) => {
        let previewMessage = messages[messages.length - 1];
        let repliedLast = previewMessage.author === loggedin.id;

        if (type === "ONE_ON_ONE") {
          let partnerIndex = participants[0].id === loggedin.id ? 1 : 0;
          return {
            id,
            type,
            partner: participants[partnerIndex],
            previewMessage,
            repliedLast
          };
        } else {
          return {
            id,
            type,
            topic,
            participants: participants.filter( (p) => p.id !== loggedin.id),
            previewMessage,
            repliedLast
          };
        }
      });
      this.isInitialized = true;
      $scope.$apply();
    });
  }
}

export default ConversationsListController;
