import ConversationsModule from "./conversations";
const { module } = angular.mock;

describe("conversations", () => {

  let $httpBackend, Conversations;
  beforeEach(() => {
    module(ConversationsModule);
    inject(($injector) => {
      $httpBackend = $injector.get("$httpBackend");
      Conversations = $injector.get("Conversations");
    });
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  let toCreate = {

  }
  it("exists", () => {
    expect(Conversations).to.exist;
  });

  it("creates a private conversation", () => {
    $httpBackend.expectPOST("/api/conversations/", {

    }).respond(201);
    expect(Group.createPrivate(1, ''))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(groupData);
    $httpBackend.flush();
  })

});
