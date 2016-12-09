class ConversationController {
  constructor(Authentication, Conversations, $scope) {
    "ngInject";
    console.log({id:this.id});
    Object.assign(this, {
      Authentication,
      Conversations,
      $scope,

      topic: '',
      type: '',
      messages: [],
      partner: {},
      participants: [],
      participantById: {},
      isInitialized: false,
      editTitleMode: false,
    })
    this.load()
  }
  load() {
    Promise.all([
      this.Authentication.update(),
      this.Conversations.get(this.id)
    ])
    .then( ([loggedin, {type,topic,messages,participants}]) => {
      if(type == 'ONE_ON_ONE') {
        this.partner = (participants[0].id == loggedin.id ? 1 : 0)
      } else {
        this.topic = topic
        this.participants = participants
      }
      for(let participant of participants) {
        this.participantById[participant.id] = participant
      }
      this.type = type
      this.messages = messages
      this.isInitialized = true
      this.$scope.$apply()
    })
  }
  onKeyDown(e) {
    if(e.keyCode != 13 || e.shiftKey) return
    e.preventDefault()
    console.log('send!');
  }
}

export default ConversationController;
