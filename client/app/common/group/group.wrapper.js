import base from '../base/service';

class GroupService extends base {
    
  static properties () {
    return [];
  }
  
  constructor(GroupCommunication) {
    'ngInject';
    super();
    this.GroupCom=GroupCommunication;
  }
  
  groups(search) {
    return this.GroupCom.groups(search);
  }

  create(group) {
    return this.GroupCom.create(group);
  }

  get(groupId) {
    return this.GroupCom.get(groupId);
  }

  save(group) {
    return this.GroupCom.save(group);
  }

  delete(groupId) {
    return this.GroupCom.delete(groupId);
  }
}

export default GroupService;
