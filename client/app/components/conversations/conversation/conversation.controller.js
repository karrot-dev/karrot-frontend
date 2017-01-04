class ConversationController {
  constructor(Authentication, Conversations, $scope) {
    "ngInject";
    Object.assign(this, {
      Authentication,
      Conversations,
      $scope,

      topic: "",
      type: "",
      messages: [],
      partner: {},
      participants: [],
      participantById: {},
      isInitialized: false,
      editTitleMode: false,
      currentUserId: false
    });

    setTimeout( ( ) => {
      this.load();
    }, 50)
  }
  load() {
    if(this.id == 'new') {
      this.isInitialized = true
      return
    }

    Promise.all([
      this.Authentication.update(),
      this.Conversations.get(this.id)
    ])
    .then( ([loggedin, { type,topic,messages,participants }]) => {
      this.currentUserId = loggedin.id
      if (type === "ONE_ON_ONE") {
        this.partner = participants[0].id === loggedin.id ? 1 : 0;
      } else {
        this.topic = topic;
        this.participants = participants;
      }
      for (let participant of participants) {
        this.participantById[participant.id] = participant;
      }
      this.type = type;
      this.messages = messages;
      this.isInitialized = true;
      this.$scope.$apply();
    });
  }
  onKeyDown(e) {

    // is enter key?
    if (e.keyCode !== 13 || e.shiftKey) return;
    e.preventDefault();

    // is conversation being created right now?
    if(this.id == -1) return


    const content = e.target.value;
    const message = {
      content,
      time: (new Date).toISOString(),
      author: this.currentUserId,
      pending: true
    }

    // conversation exists
    if(this.id) {
      this.messages.push(message);
      this.Conversations.sendMessage(this.id, content)
      .then( () => {
        message.pending = false
      }).catch( (err) => {
        message.error = true
      })


    // create new conversation
    } else {
      this.id = -1

      // is a topic set?
      if(!this.topic) return this.editTopic()

      // are participants set?
      if(!this.participants.length) return this.editParticipants()

      // TODO: send
    }
    e.target.value = ''
  }

  isSameDate(a,b) {
    if(!a || !b) return false
    return (new Date(a.time)).toDateString() == (new Date(b.time)).toDateString()
  }
}

export default ConversationController;
