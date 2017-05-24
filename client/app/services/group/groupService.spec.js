import GroupModule from "./group";

const { module } = angular.mock;

describe("group service", () => {
  beforeEach(module(GroupModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let $httpBackend, GroupService;

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
    GroupService = $injector.get("GroupService");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("lists groups", () => {
    $httpBackend.expectGET("/api/groups/?include_empty=False").respond(groupData);
    expect(GroupService.list())
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("creates group", () => {
    $httpBackend.expectPOST("/api/groups/", groupCreateData).respond(groupData);
    expect(GroupService.create(groupCreateData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("gets group details via get", () => {
    $httpBackend.expectGET("/api/groups/1/").respond(groupData[0]);
    expect(GroupService.get(1))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData[0]);
    $httpBackend.flush();
  });

  it("filters groups by member ID", () => {
    $httpBackend.expectGET("/api/groups/?members=2").respond(groupData);
    expect(GroupService.listByMemberId(2))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("filters groups by name", () => {
    $httpBackend.expectGET("/api/groups/?name=Foodsharing+Darmstadt").respond(groupData);
    expect(GroupService.listByGroupName("Foodsharing Darmstadt"))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("filters groups by search", () => {
    $httpBackend.expectGET("/api/groups/?search=Foods").respond(groupData);
    expect(GroupService.search("Foods"))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("saves group details", () => {
    $httpBackend.expectPATCH("/api/groups/1/", groupModifyData).respond(groupData);
    expect(GroupService.save(groupModifyData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  });

  it("joins a group", () => {
    $httpBackend.expectPOST("/api/groups/1/join/", {}).respond(200);
    expect(GroupService.join(1)).to.be.fulfilled;
    $httpBackend.flush();
  });

  it("joins a group with password", () => {
    $httpBackend.expectPOST("/api/groups/1/join/", { password: "abc" }).respond(200);
    expect(GroupService.join(1, { password: "abc" })).to.be.fulfilled;
    $httpBackend.flush();
  });


  it("leaves a group", () => {
    $httpBackend.expectPOST("/api/groups/1/leave/", {}).respond(200);
    expect(GroupService.leave(1)).to.be.fulfilled;
    $httpBackend.flush();
  });

  context("auth interaction", () => {
    let Authentication;
    beforeEach(inject((_Authentication_) => {
      Authentication = _Authentication_;
    }));

    it("filters my groups", () => {
      Authentication.data = { id: 2 };
      $httpBackend.expectGET("/api/groups/?members=2").respond(groupData);
      expect(GroupService.listMy())
        .to.be.fulfilled.and
        .to.eventually.deep.equal(groupData);
      $httpBackend.flush();
    });
  });
});
