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

  let CurrentGroup, $httpBackend;

  beforeEach(inject(($injector) => {
    CurrentGroup = $injector.get("CurrentGroup");
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

  it("can persist current group", inject(($q) => {
    CurrentGroup.persistCurrentGroup.restore();
    sinon.stub(CurrentGroup.Authentication, "update").returns($q.resolve({ id: 1 }));
    let user = {
      id: 1,
      current_group: 4              //eslint-disable-line
    };
    $httpBackend.expectPATCH(`/api/users/${user.id}/`, user).respond(200, {});
    CurrentGroup.persistCurrentGroup(user.current_group);
    $httpBackend.flush();
  }));

  it("sets map overview mode", inject(($rootScope) => {
    // default is true
    expect(CurrentGroup.map.overview).to.be.truthy;

    // does it trigger a watch?
    let stub = sinon.stub();
    let deregister = $rootScope.$watch(() => CurrentGroup.map.overview, stub);
    CurrentGroup.setMapOverview();
    $rootScope.$apply();

    expect(CurrentGroup.map.overview).to.be.truthy;
    expect(stub).to.have.been.calledWith(2);
    deregister();
  }));

  it("sets map center", inject(($rootScope) => {
    // does it trigger a watch?
    let stub = sinon.stub();
    let deregister = $rootScope.$watch(() => CurrentGroup.map.center, stub);
    let center = { lat: 1, lng: 2, zoom: 15 };
    CurrentGroup.setMapCenter(center);
    $rootScope.$apply();

    expect(CurrentGroup.map.overview).to.be.falsy;
    expect(CurrentGroup.map.center).to.deep.equal(center);
    expect(stub).to.have.been.calledWith(center);
    deregister();
  }));

});
