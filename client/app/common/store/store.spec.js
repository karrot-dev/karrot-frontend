import StoreModule from './store';

describe('store service', function() {
  beforeEach(window.module(StoreModule));
  let $httpBackend, Store;

  let storeData = [{
      "id": 1,
      "name": "Rewe Center",
      "description": "Großer Rewe im Industriegebiet",
      "group": 14,
      "address": "Luisenplatz 1",
      "latitude": "49.4879289985449",
      "longitude": "8.46548080444336"
  }];

  let storeCreateData = [{
      "id": 1,
      "name": "Rewe Center",
      "description": "Großer Rewe im Industriegebiet",
      "group": 14,
      "address": "Luisenplatz 1",
      "latitude": "49.4879289985449",
      "longitude": "8.46548080444336"
  }];

  let storeModifyData = {
    "name": "Aldi"
  };

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Store = $injector.get('Store');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('lists stores', () => {
    $httpBackend.expectGET('/api/stores/').respond(storeData);
    Store.stores().then((data) => {
      expect(data).to.deep.equal(storeData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it('creates store', () => {
    $httpBackend.expectPOST('/api/stores/', storeCreateData).respond(storeData);
    Store.create(storeCreateData).then((data) => {
      expect(data).to.deep.equal(storeData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });


  it('get all stores', () => {
    $httpBackend.expectGET('/api/stores/').respond(storeData);
    Store.get({}).then((data) => {
      expect(data).to.deep.equal(storeData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });
  
  
  it('get store details', () => {
    $httpBackend.expectGET('/api/stores/1/').respond(storeData);
    Store.get({id: 1}).then((data) => {
      expect(data).to.deep.equal(storeData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });
  
  
  it('filter stores by group', () => {
    $httpBackend.expectGET('/api/stores/?group=1').respond(storeData);
    Store.get({group: 1}).then((data) => {
      expect(data).to.deep.equal(storeData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it('save store details', () => {
    $httpBackend.expectPATCH('/api/stores/1/', storeModifyData).respond(storeData);
    Store.save(1, storeModifyData).then((data) => {
      expect(data).to.deep.equal(storeData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it('delete store', () => {
    $httpBackend.expectDELETE('/api/stores/1/').respond(200);
    Store.delete(1).then(() => {
      assert(true);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });
})