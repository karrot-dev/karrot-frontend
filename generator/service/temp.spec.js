import <%= upCaseName %>Module from "./<%= name %>";

const { module } = angular.mock;

describe("<%= name %>", () => {
  let <%= upCaseName %>;
  beforeEach(() => {
    module(<%= upCaseName %>Module);
    inject((_<%= upCaseName %>_) => {
      <%= upCaseName %> = _<%= upCaseName %>_;
    });
  });

  it("exists", () => {
    expect(<%= upCaseName %>).to.exist;
  });

});
