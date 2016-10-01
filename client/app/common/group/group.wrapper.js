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
    return this.GroupCom.users(search);
  }

  create(group) {
    return this.GroupCom.create(user);
  }

  get(groupId) {
    return this.GroupCom.get(groupId);
  }

  save(user) {
    return this.GroupCom.save(user);
  }

  delete(pk) {
    return this.GroupCom.delete(pk);
  }
}

export default GroupService;
