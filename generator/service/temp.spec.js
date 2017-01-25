import <%= upCaseName %>Module from "./<%= name %>";

const { module } = angular.mock;

describe("<%= name %>", () => {
  let $log, <%= upCaseName %>;
  beforeEach(() => {
    module(<%= upCaseName %>Module);
    inject(($injector) => {
      $log = $injector.get("$log");
      $log.reset();
      <%= upCaseName %> = $injector.get("<%= upCaseName %>");
    });
  });
  afterEach(() => {
    $log.assertEmpty();
  });

  it("exists", () => {
    expect(<%= upCaseName %>).to.exist;
  });

});
