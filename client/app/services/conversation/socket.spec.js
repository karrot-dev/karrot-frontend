import ConversationModule from "./conversation";

const { module } = angular.mock;

import { Server } from "mock-socket";

describe("socket.service", () => {
  beforeEach(module(ConversationModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let $httpBackend, Socket;

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    Socket = $injector.get("Socket");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("with subscriber", () => {

    let messages = [], mockServer;

    beforeEach(() => {
      mockServer = new Server("ws://localhost:9876/api/ws");
      messages.length = 0;
      Socket.subscribe((message) => {
        messages.push(message);
      });
    });

    afterEach((done) => mockServer.stop(done));

    it("receives messages", (done) => {
      mockServer.on("connection", () => {
        mockServer.send(angular.toJson({ content: "woo" }));
      });
      Socket.connect();
      // eslint-disable-next-line angular/timeout-service
      setTimeout(() => {
        expect($log.info.logs.pop()[0]).to.equal("socket opened!");
        expect(messages.length).to.equal(1);
        expect(messages).to.deep.equal([{ content: "woo" }]);
        done();
      }, 100);
    });

    it("can subscribe and unsubscribe", () => {
      let subscriber = () => {};
      let unsubscribe = Socket.subscribe(subscriber);
      expect(Socket.subscribers).to.include(subscriber);
      unsubscribe();
      expect(Socket.subscribers).to.not.include(subscriber);
    });

    it("errors if message is not json format", (done) => {
      mockServer.on("connection", () => {
        mockServer.send("I am not json");
      });
      Socket.connect();
      // eslint-disable-next-line angular/timeout-service
      setTimeout(() => {
        expect($log.info.logs.pop()[0]).to.equal("socket opened!");
        expect($log.error.logs.pop()[0]).to.equal("websocket message was not json");
        expect(messages.length).to.equal(0);
        done();
      }, 100);
    });

  });

});
