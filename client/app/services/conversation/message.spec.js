import ConversationModule from "./conversation";

const { module } = angular.mock;

describe("message service", () => {
  beforeEach(module(ConversationModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let $httpBackend, Message;

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    Message = $injector.get("Message");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("lists messages", () => {
    let conversationId = 1;
    let messages = [{ content: "a message" }, { content: "another message" }];
    $httpBackend.expectGET(`/api/messages/?conversation=${conversationId}`)
      .respond(messages);
    expect(Message.list(conversationId))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(messages);
    $httpBackend.flush();
  });

  it("can create a message", () => {
    let messageCreate = {
      content: "my nice message"
    };
    let message = {
      id: 1,
      author: 5,
      content: "my nice message"
    };
    $httpBackend.expectPOST("/api/messages/", messageCreate).respond(message);
    expect(Message.create(messageCreate))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(message);
    $httpBackend.flush();
  });

});
