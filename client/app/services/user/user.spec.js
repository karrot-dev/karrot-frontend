import UserModule from "./user";

let { module } = angular.mock;

describe("user service", () => {
  beforeEach(module(UserModule));
  let $httpBackend, User;

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let userData = [{
    "id": 1,
    "display_name": "Mr T",
    "email": "til@man.com",
    "address": null,
    "latitude": null,
    "longitude": null
  }];

  let userCreateData = [{
    "display_name": "Mr T",
    "email": "til@man.com",
    "password": "abc"
  }];

  let userModifyData = {
    "id": 1,
    "display_name": "becker"
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
    expect(User.list())
      .to.be.fulfilled.and
      .to.eventually.deep.equal(userData);
    $httpBackend.flush();
  });

  it("lists filtered users", () => {
    $httpBackend.expectGET("/api/users/?search=becker").respond(userData);
    expect(User.search("becker"))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(userData);
    $httpBackend.flush();
  });

  it("creates user", () => {
    $httpBackend.expectPOST("/api/users/", userCreateData).respond(userData);
    expect(User.create(userCreateData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(userData);
    $httpBackend.flush();
  });

  it("gets user details", () => {
    $httpBackend.expectGET("/api/users/1/").respond(userData[0]);
    expect(User.get(1))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(userData[0]);
    $httpBackend.flush();
  });

  it("saves user details", () => {
    $httpBackend.expectPATCH("/api/users/1/", userModifyData).respond(userData[0]);
    expect(User.save(userModifyData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(userData[0]);
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

  it("verifies mail", () => {
    let key = "abc";
    $httpBackend.expectPOST("/api/users/verify_mail/", { key }).respond(200);
    expect(User.verifyMail(key))
      .to.be.fulfilled;
    $httpBackend.flush();
  });

  it("resets password", () => {
    let email = "abc@example.com";
    $httpBackend.expectPOST("/api/users/reset_password/", { email }).respond(200);
    expect(User.resetPassword(email))
      .to.be.fulfilled;
    $httpBackend.flush();
  });
});
