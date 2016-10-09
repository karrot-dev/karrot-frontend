import AuthenticationModule from "./authentication";
import hookFactory from "./hook.js";

describe("authentication", () => {
  let $httpBackend, Authentication;

  beforeEach(angular.module(AuthenticationModule));
  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    Authentication = $injector.get("Authentication");
  }));

  let loginData = {
    "id": 7,
    "display_name": "asdflo",
    "first_name": null,
    "last_name": null,
    "email": "asdf.asdf@asdf.asdf",
    "address": null,
    "latitude": null,
    "longitude": null
  };

  describe("service", () => {
    let failLoginStatusString = "{\"error\": \"not_authed\"}";

    it("rejects anonymous user", () => {
      $httpBackend.expectGET("/api/auth/status/").respond(() => {
        return [401, failLoginStatusString];
      });
      Authentication.update()
        .then(() => {
          assert.done(new Error("shouldn't be resolved"));
        })
        .catch(() => {
          assert.done();
        });
      $httpBackend.flush();
    });

    it("allows authenticated user", () => {
      $httpBackend.expectGET("/api/auth/status/").respond(loginData);
      Authentication.update()
        .then(() => {
          assert.done();
        })
        .catch(() => {
          assert.fail();
        });
    });

    it("allows login", () => {
      $httpBackend.expectPOST("/api/auth/").respond(loginData);
      Authentication.login("", "")
        .then((data) => {
          expect(data).to.be.deep.equal(loginData);
        })
        .catch(() => {
          assert.fail();
        });
    });

    it("disallows login", () => {
      $httpBackend.expectPOST("/api/auth/").respond(() => {
        return [400];
      });
      Authentication.login("", "")
        .then(() => {
          assert.fail();
        })
        .catch(() => {
          assert.done();
        });
    });

    it("logs user out", () => {
      $httpBackend.expectPOST("/api/auth/logout/").respond(() => {
        return [200];
      });
      Authentication.logout()
        .then(() => {
          assert.done();
        });
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

  describe("hook", () => {
    let $state, $q, $transition, testModule = "yunity.test.authentication";

    beforeEach(() => {
      angular
        .module(testModule, [AuthenticationModule])
        .config(($stateProvider) => {
          "ngInject";
          $stateProvider
            .state("login", {})
            .state("home", {});
        });
    });

    beforeEach(inject(($injector) => {
      $state = $injector.get("$state");
      $q = $injector.get("$q");
      $transition = $injector.get("$transition");
    }));

    let mockAuthenticationSuccess = {
      update: () => {
        return $q((resolve) => {
          resolve(loginData);
        });
      }
    };
    let mockAuthenticationFailure = {
      update: () => {
        return $q((resolve, reject) => {
          reject();
        });
      }
    };

    describe("transition from login", () => {

      beforeEach(() => {
        $state.go("login");
      });

      it("to login", () => {
        angular.module(($provide) => {
          $provide.value("Authentication", mockAuthenticationFailure);
        });
        let hook = hookFactory("home", { authenticated: true, anonymous: "login" });
        hook($transition);
      });
    });

    it("to home", () => {
      angular.module(($provide) => {
        $provide.value("Authentication", mockAuthenticationSuccess);
      });
      let mockReaction = ($state, reaction) => {
        expect(reaction).to.be(true);
      };
      let hook = hookFactory("home", { authenticated: true, anonymous: "login" }, mockReaction);
      hook($transition);
    });

    describe("transition from home", () => {
      beforeEach(() => {
        $state.go("home");
      });
      it("to login", () => {

      });
      it("to home", () => {

      });
    });

  });
});
