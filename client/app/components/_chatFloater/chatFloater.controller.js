class ChatFloaterController {
  constructor(GroupService, CurrentGroup, Conversation) {
    "ngInject";
    Object.assign(this, {
      groupData: CurrentGroup.value,
      Conversation,
      GroupService,
      conversation: null,
      newMessageBody: ""
    });
  }

  sendMessage() {
    this.conversation.sendMessage({ content: this.newMessageBody });
    this.newMessageBody = "";
  }

  $onInit() {
    this.GroupService.conversation(this.groupData.id).then(({ id }) => {
      this.Conversation.subscribe(id).then((val) => {
        this.conversation = val;
      });
    });
  }

  $onDestroy() {
    if (this.conversation) this.conversation.unsubscribe();
  }

}

export default ChatFloaterController;
