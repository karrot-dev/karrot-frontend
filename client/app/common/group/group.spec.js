import GroupModule from "./group";

describe("group service", () => {
  beforeEach(window.module(GroupModule));
  let $httpBackend, Group;

  let groupData = [{
    "id": 1,
    "name": "Foodsharing Darmstadt",
    "address": "Luisenplatz 1",
    "latitude": "49.4879289985449",
    "longitude": "8.46548080444336",
    "members": []
  }];

  let groupCreateData = [{
    "id": 1,
    "name": "Foodsharing Darmstadt",
    "address": "Luisenplatz 1",
    "latitude": "49.4879289985449",
    "longitude": "8.46548080444336"
  }];

  let groupModifyData = {
    "name": "Foodsharing Mannheim"
  };

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    Group = $injector.get("Group");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("lists groups", () => {
    $httpBackend.expectGET("/api/groups/").respond(groupData);
    expect(Group.get()).to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("creates group", () => {
    $httpBackend.expectPOST("/api/groups/", groupCreateData).respond(groupData);
    expect(Group.create(groupCreateData)).to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("gets group details via get", () => {
    $httpBackend.expectGET("/api/groups/1/").respond(groupData[0]);
    expect(Group.get({ id: 1 })).to.eventually.deep.equal(groupData[0]);
    $httpBackend.flush();
  });
  
  it("filters groups by search", () => {
    $httpBackend.expectGET("/api/groups/?search=Foods").respond(groupData);
    expect(Group.get({ search: "Foods" })).to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("saves group details", () => {
    $httpBackend.expectPATCH("/api/groups/1/", groupModifyData).respond(groupData);
    expect(Group.save(1, groupModifyData)).to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("deletes group", () => {
    $httpBackend.expectDELETE("/api/groups/1/").respond(200);
    expect(Group.delete(1)).to.be.fulfilled;
    $httpBackend.flush();
  });
});
