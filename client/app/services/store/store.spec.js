import StoreModule from "./store";

const { module } = angular.mock;

describe("store service", () => {
  beforeEach(module(StoreModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

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
    "id": 1,
    "name": "Aldi"
  };

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    Store = $injector.get("Store");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("lists stores", () => {
    $httpBackend.expectGET("/api/stores/").respond(storeData);
    expect(Store.list())
      .to.be.fulfilled.and
      .to.eventually.deep.equal(storeData);
    $httpBackend.flush();
  });

  it("creates store", () => {
    $httpBackend.expectPOST("/api/stores/", storeCreateData).respond(storeData);
    expect(Store.create(storeCreateData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(storeData);
    $httpBackend.flush();
  });

  it("gets store details", () => {
    $httpBackend.expectGET("/api/stores/1/").respond(storeData);
    expect(Store.get(1))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(storeData);
    $httpBackend.flush();
  });

  it("filters stores by group", () => {
    $httpBackend.expectGET("/api/stores/?group=1").respond(storeData);
    expect(Store.listByGroupId(1))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(storeData);
    $httpBackend.flush();
  });

  it("filters stores by group and name", () => {
    $httpBackend.expectGET("/api/stores/?group=1&name=Rewe+Center").respond(storeData);
    expect(Store.listStoresInGroupByName(1,"Rewe Center"))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(storeData);
    $httpBackend.flush();
  });

  it("filters stores by searchquery", () => {
    $httpBackend.expectGET("/api/stores/?search=sometext").respond(storeData);
    expect(Store.search("sometext"))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(storeData);
    $httpBackend.flush();
  });

  it("saves store details", () => {
    $httpBackend.expectPATCH("/api/stores/1/", storeModifyData).respond(storeData);
    expect(Store.save(storeModifyData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(storeData);
    $httpBackend.flush();
  });

  it("deletes store", () => {
    $httpBackend.expectDELETE("/api/stores/1/").respond(200);
    expect(Store.delete(1)).to.be.fulfilled;
    $httpBackend.flush();
  });
});
