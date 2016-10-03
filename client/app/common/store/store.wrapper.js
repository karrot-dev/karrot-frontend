import base from '../base/service';

class StoreService extends base {
    
  static properties () {
    return [];
  }
  
  constructor(StoreCommunication) {
    'ngInject';
    super();
    this.StoreCom=StoreCommunication;
  }
  
  stores(search) {
    return this.StoreCom.stores(search);
  }

  create(store) {
    return this.StoreCom.create(store);
  }

  get(params) {
    if(params.id){
        return this.StoreCom.getById(params.id);
    } else {
        return this.StoreCom.get(params);
    }
  }

  save(storeId, updates) {
    return this.StoreCom.save(storeId, updates);
  }

  delete(storeId) {
    return this.StoreCom.delete(storeId);
  }
}

export default StoreService;
