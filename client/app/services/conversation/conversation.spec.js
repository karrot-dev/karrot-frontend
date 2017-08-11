import ConversationModule from "./conversation";

const { module } = angular.mock;

import { Server } from "mock-socket";

describe("conversation.service", () => {
  beforeEach(module(ConversationModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let $httpBackend, $timeout, Conversation;

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $timeout = $injector.get("$timeout");
    Conversation = $injector.get("Conversation");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  let mockServer;

  function sendMessage(message) {
    mockServer.send(angular.toJson({
      topic: "conversations:message",
      payload: message
    }));
  }

  beforeEach(() => {
    mockServer = new Server("ws://localhost:9876/api/ws");
  });

  afterEach((done) => mockServer.stop(done));

  it("lists existing messages and gets new ones", (done) => {
    let conversationId = 1;
    let initialMessages = [{ content: "a message" }, { content: "another message" }];
    let newMessage = { conversation: { id: conversationId }, content: "woo" };
    $httpBackend.expectGET(`/api/messages/?conversation=${conversationId}`)
      .respond(initialMessages);
    Conversation.subscribe(conversationId).then((conversation) => {
      sendMessage(newMessage);
      // eslint-disable-next-line angular/timeout-service
      setTimeout(() => {
        $timeout.flush();
        $log.info.logs.pop();
        expect(conversation.messages.length).to.equal(3);
        expect(conversation.messages[0]).to.deep.equal(initialMessages[0]);
        expect(conversation.messages[1]).to.deep.equal(initialMessages[1]);
        expect(conversation.messages[2]).to.deep.equal(newMessage);
        done();
      }, 100);
    });
    $httpBackend.flush();
  });

});
