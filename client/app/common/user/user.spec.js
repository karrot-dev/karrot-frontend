import UserModule from "./user";

let { module } = angular.mock;

describe("user service", () => {
  beforeEach(module(UserModule));
  let $httpBackend, User;

  let userData = [{
    "id": 1,
    "display_name": "Mr T",
    "first_name": "tilmann",
    "last_name": "becker",
    "email": "til@man.com",
    "address": null,
    "latitude": null,
    "longitude": null
  }];

  let userCreateData = [{
    "display_name": "Mr T",
    "first_name": "tilmann",
    "last_name": "becker",
    "email": "til@man.com",
    "password": "abc"
  }];

  let userModifyData = {
    "last_name": "becker"
  };

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    User = $injector.get("User");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("lists users", () => {
    $httpBackend.expectGET("/api/users/").respond(userData);
    expect(User.get()).to.eventually.deep.equal(userData);
    $httpBackend.flush();
  });

  it("lists filtered users", () => {
    $httpBackend.expectGET("/api/users/?last_name=becker").respond(userData);
    expect(User.get({ "last_name": "becker" })).to.eventually.deep.equal(userData);
    $httpBackend.flush();
  });

  it("creates user", () => {
    $httpBackend.expectPOST("/api/users/", userCreateData).respond(userData);
    expect(User.create(userCreateData)).to.eventually.deep.equal(userData);
    $httpBackend.flush();
  });

  it("gets user details via get", () => {
    $httpBackend.expectGET("/api/users/1/").respond(userData[0]);
    expect(User.get({ id: 1, someOtherAttribute: "someValue" })).to.eventually.deep.equal(userData[0]);
    $httpBackend.flush();
  });

  it("gets user details via getById", () => {
    $httpBackend.expectGET("/api/users/1/").respond(userData[0]);
    expect(User.getById(1)).to.eventually.deep.equal(userData[0]);
    $httpBackend.flush();
  });

  it("saves user details", () => {
    $httpBackend.expectPATCH("/api/users/1/", userModifyData).respond(userData[0]);
    expect(User.save(1, userModifyData)).to.eventually.deep.equal(userData[0]);
    $httpBackend.flush();
  });

  it("deletes user", () => {
    $httpBackend.expectDELETE("/api/users/1/").respond(200);
    expect(User.delete(1)).to.be.fulfilled;
    $httpBackend.flush();
  });

  it("fails to delete non-existing user", () => {
    $httpBackend.expectDELETE("/api/users/1337/").respond(404);
    expect(User.delete(1337)).to.be.rejected;
    $httpBackend.flush();
  });
});
