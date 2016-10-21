import UserListModule from "./userList";
import UserModule from "../../common/user/user";

describe("UserList", () => {
  let $rootScope, $componentController, $httpBackend;

  let { module } = angular.mock;

  beforeEach(module(UserListModule));
  beforeEach(module(UserModule));

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $rootScope = $injector.get("$rootScope");
    $componentController = $injector.get("$componentController");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  let userOne = {
    "id": 1,
    "name": "Testuser1",
    "description": "all the good stuff",
    "group": 1,
    "address": null,
    "latitude": null,
    "longitude": null
  };

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe("Controller", () => {
    let controller;

    it("check binding of complete users",() => {
      controller = $componentController("userList", {
        $scope: $rootScope.$new()
      }, {
        users: [userOne]
      });

      expect(controller.userData).to.deep.equal([userOne]);
    });


    it("maps users-array",() => {
      controller = $componentController("userList", {
        $scope: $rootScope.$new()
      }, {
        users: [1]
      });

      $httpBackend.expectGET("/api/users/1/").respond(userOne);
      $httpBackend.flush();
    });
  });

  describe("Template", () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
  });

  describe("Component", () => {
      // component/directive specs
  });
});
