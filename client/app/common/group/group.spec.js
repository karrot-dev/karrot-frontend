import GroupModule from "./group";

const { module } = angular.mock;

describe("group service", () => {
  beforeEach(module(GroupModule));
  let $httpBackend, Group;

  let groupData = [{
    "id": 1,
    "name": "Foodsharing Darmstadt",
    "address": "Luisenplatz 1",
    "latitude": "49.4879289985449",
    "longitude": "8.46548080444336",
    "members": [2]
  }];

  let groupCreateData = [{
    "id": 1,
    "name": "Foodsharing Darmstadt",
    "address": "Luisenplatz 1",
    "latitude": "49.4879289985449",
    "longitude": "8.46548080444336"
  }];

  let groupModifyData = {
    "id": 1,
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
    expect(Group.list())
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("creates group", () => {
    $httpBackend.expectPOST("/api/groups/", groupCreateData).respond(groupData);
    expect(Group.create(groupCreateData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("gets group details via get", () => {
    $httpBackend.expectGET("/api/groups/1/").respond(groupData[0]);
    expect(Group.get(1))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData[0]);
    $httpBackend.flush();
  });

  it("filters groups by member ID", () => {
    $httpBackend.expectGET("/api/groups/?members=2").respond(groupData);
    expect(Group.listByMemberId(2))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("filters groups by search", () => {
    $httpBackend.expectGET("/api/groups/?search=Foods").respond(groupData);
    expect(Group.search("Foods"))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("saves group details", () => {
    $httpBackend.expectPATCH("/api/groups/1/", groupModifyData).respond(groupData);
    expect(Group.save(groupModifyData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });
});
