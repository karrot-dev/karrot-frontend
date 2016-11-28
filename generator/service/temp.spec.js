import <%= upCaseName %>Module from "./<%= name %>";

const { module } = angular.mock;

describe("<%= name %>", () => {
  let <%= upCaseName %>;
  beforeEach(() => {
    module(<%= upCaseName %>Module);
    inject(($injector) => {
      <%= upCaseName %> = $injector.get("<%= upCaseName %>");
    });
  });

  it("exists", () => {
    expect(<%= upCaseName %>).to.exist;
  });

});
