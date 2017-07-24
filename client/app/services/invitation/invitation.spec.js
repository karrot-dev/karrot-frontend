import InvitationModule from "./invitation";

const { module } = angular.mock;

describe("invitation service", () => {
  let $log, Invitation, $httpBackend;
  beforeEach(() => {
    module(InvitationModule);
    inject(($injector) => {
      $log = $injector.get("$log");
      $log.reset();
      Invitation = $injector.get("Invitation");
      $httpBackend = $injector.get("$httpBackend");
    });
  });
  afterEach(() => {
    $log.assertEmpty();
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  let invitationCreateData = {
    email: "mail@example.com",
    group: 5
  };

  let invitationData = {
    id: 1,
    email: "mail@example.com",
    group: 5
  };

  it("creates invitation", () => {
    $httpBackend.expectPOST("/api/invitations/", invitationCreateData).respond(invitationData);
    expect(Invitation.create(invitationCreateData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(invitationData);
    $httpBackend.flush();
  });

  it("lists invitations", () => {
    $httpBackend.expectGET("/api/invitations/").respond([invitationData]);
    expect(Invitation.list())
      .to.be.fulfilled.and
      .to.eventually.deep.equal([invitationData]);
    $httpBackend.flush();
  });

  it("lists invitations by group", () => {
    $httpBackend.expectGET("/api/invitations/?group=5").respond([invitationData]);
    expect(Invitation.listByGroupId(5))
      .to.be.fulfilled.and
      .to.eventually.deep.equal([invitationData]);
    $httpBackend.flush();
  });

  it("gets invitation via id", () => {
    $httpBackend.expectGET("/api/invitations/1/").respond(invitationData);
    expect(Invitation.get(1))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(invitationData);
    $httpBackend.flush();
  });

  it("accepts invitation via token", () => {
    $httpBackend.expectPOST("/api/invitations/abcdef12345/accept/").respond({});
    expect(Invitation.accept("abcdef12345"))
      .to.be.fulfilled.and
      .to.eventually.deep.equal({});
    $httpBackend.flush();
  });


});
