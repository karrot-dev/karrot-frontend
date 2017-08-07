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
        $log.info.logs.length = 0;
        done();
      }, 100);
    });

  });

});
