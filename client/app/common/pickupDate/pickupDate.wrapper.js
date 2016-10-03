import base from '../base/service';

class PickupDateService extends base {
    
  static properties () {
    return [];
  }
  
  constructor(PickupDateCommunication) {
    'ngInject';
    super();
    this.PickupCom = PickupDateCommunication;
  }

  create(group) {
    return this.PickupCom.create(group);
  }

  get(params) {
      if(params.id){
          return this.PickupCom.getById(params.id);
      } else {
          return this.PickupCom.get(params);
      }
  }

  save(pickupId, updates) {
    return this.PickupCom.save(pickupId, updates);
  }

  delete(pickupId) {
    return this.PickupCom.delete(pickupId);
  }
  
  join(pickupId) {
      return this.PickupCom.join(pickupId);
  }
  
  leave(pickupId) {
      return this.PickupCom.leave(pickupId);
  }
}
export default PickupDateService;
