import JoinGroupPreviewModule from "./joinGroupPreview";

const { module } = angular.mock;

describe("JoinGroupPreview", () => {
  beforeEach(module(JoinGroupPreviewModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named joinGroupPreview", () => {
      expect(JoinGroupPreviewModule).to.equal("joinGroupPreview");
    });
  });

  describe("Component", () => {
    let $ctrl, $scope, $parentScope, $q;
    beforeEach(inject((_$rootScope_, _$compile_, _$q_) => {
      $q = _$q_;
      $parentScope = _$rootScope_.$new();
      Object.assign($parentScope, {
        group: {
          protected: true,
          password: "abc"
        },
        joinfn: () => {}
      });
      $scope = _$compile_(
        "<join-group-preview group='group' on-join-group='joinfn()'></join-group-preview>"
      )($parentScope).isolateScope();
      $scope.$apply();
      $ctrl = $scope.$ctrl;
    }));

    it("sets password error if promise is rejected", () => {
      $parentScope.joinfn = () => {
        return $q.reject();
      };
      $scope.$apply();
      $ctrl.joinGroup();
      $scope.$apply();
      expect($scope.form.password.$error.check).to.be.true;
      expect($scope.form.$valid).to.be.false;
    });

    it("sets form valid if promise is fulfilled", () => {
      $parentScope.joinfn = () => {
        return $q.resolve();
      };
      $scope.$apply();
      $ctrl.joinGroup();
      $scope.$apply();
      expect($scope.form.$valid).to.be.true;
    });
  });
});
