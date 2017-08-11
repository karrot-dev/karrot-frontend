class ChatController {

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
      console.log('init!', id); // eslint-disable-line
      this.Conversation.subscribe(id).then((val) => {
        this.conversation = val;
      });
    });
  }

  $onUpdate() {
    console.log('update!'); // eslint-disable-line
  }

  $onDestroy() {
    if (this.conversation) this.conversation.unsubscribe();
  }

}

export default ChatController;
