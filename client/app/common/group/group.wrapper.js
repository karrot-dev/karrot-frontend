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
  
  create(group) {
    return this.GroupCom.create(group);
  }

  get(params) {
    if(params.id){
        return this.GroupCom.getById(params.id);
    } else {
        return this.GroupCom.get(params);
    }
  }

  save(groupId, updates) {
    return this.GroupCom.save(groupId, updates);
  }

  delete(groupId) {
    return this.GroupCom.delete(groupId);
  }
}

export default GroupService;
