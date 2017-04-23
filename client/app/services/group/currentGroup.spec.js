import GroupModule from "./group";
import UserModule from "../user/user";

const { module } = angular.mock;

describe("CurrentGroup service", () => {
  beforeEach(module(GroupModule));
  beforeEach(module(UserModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let CurrentGroup, Authentication, $httpBackend, stub;

  beforeEach(inject(($injector) => {
    CurrentGroup = $injector.get("CurrentGroup");
    Authentication = $injector.get("Authentication");
    $httpBackend = $injector.get("$httpBackend");

    Authentication.data = { id: 1 };
    stub = sinon.stub(CurrentGroup, "persistCurrentGroup");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("starts with an empty empty", () => {
    expect(CurrentGroup.value).to.deep.equal({});
  });

  it("can be set", () => {
    let newGroup = {
      id: 1,
      anything: "can",
      go: "here",
      including: ["lists", "of", "stuff"]
    };
    CurrentGroup.set(newGroup);
    assert(stub.withArgs(newGroup.id).calledOnce);
    expect(CurrentGroup.value).to.deep.equal(newGroup);
  });

  it("can be cleared", () => {
    CurrentGroup.set({ some: "data" });
    CurrentGroup.clear();
    assert(stub.calledTwice);
    expect(CurrentGroup.value).to.deep.equal({});
  });

  it("copies properties from group during set", () => {
    let value = CurrentGroup.value;
    CurrentGroup.set({ some: "data" });
    assert(stub.calledOnce);
    expect(CurrentGroup.value).to.equal(value);
  });

  it("can persist current group", () => {
    stub.restore();
    let user = {
      id: Authentication.data.id,
      current_group: 4
    };
    $httpBackend.expectPATCH(`/api/users/${user.id}/`, user).respond(200, {});
    CurrentGroup.persistCurrentGroup(user.current_group);
    $httpBackend.flush();
  });

});
