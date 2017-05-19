import GroupModule from "./group";

const { module } = angular.mock;

describe("CurrentGroup service", () => {
  beforeEach(module(GroupModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let CurrentGroup, SessionUser, $httpBackend;

  beforeEach(inject(($injector) => {
    CurrentGroup = $injector.get("CurrentGroup");
    SessionUser = $injector.get("SessionUser");
    $httpBackend = $injector.get("$httpBackend");

    sinon.stub(CurrentGroup, "persistCurrentGroup");
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
    expect(CurrentGroup.persistCurrentGroup).to.have.been.calledWith(newGroup.id).calledOnce;
    expect(CurrentGroup.value).to.deep.equal(newGroup);
  });

  it("can be cleared", () => {
    CurrentGroup.set({ some: "data" });
    CurrentGroup.clear();
    expect(CurrentGroup.persistCurrentGroup).to.have.been.calledTwice;
    expect(CurrentGroup.value).to.deep.equal({});
  });

  it("copies properties from group during set", () => {
    let value = CurrentGroup.value;
    CurrentGroup.set({ some: "data" });
    expect(CurrentGroup.persistCurrentGroup).to.have.been.calledOnce;
    expect(CurrentGroup.value).to.equal(value);
  });

  it("can persist current group", () => {
    CurrentGroup.persistCurrentGroup.restore();
    SessionUser.set({ id: 1 });
    let user = {
      id: 1,
      current_group: 4              //eslint-disable-line
    };
    $httpBackend.expectPATCH(`/api/users/${user.id}/`, user).respond(200, {});
    CurrentGroup.persistCurrentGroup(user.current_group);
    $httpBackend.flush();
  });

});
