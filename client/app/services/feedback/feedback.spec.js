import FeedbackModule from "./feedback";

const { module } = angular.mock;

describe("feedback", () => {
  let $log, Feedback, $httpBackend;
  beforeEach(() => {
    module(FeedbackModule);
    inject(($injector) => {
      $log = $injector.get("$log");
      $log.reset();
      Feedback = $injector.get("Feedback");
      $httpBackend = $injector.get("$httpBackend");
    });
  });
  afterEach(() => {
    $log.assertEmpty();
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  const feedbackData = {
    about: 99,
    weight: 10,
    comment: "so much"
  };

  it("creates feedback", () => {
    $httpBackend.expectPOST("/api/feedback/", feedbackData).respond(feedbackData);
    expect(Feedback.create(feedbackData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(feedbackData);
    $httpBackend.flush();
  });


  it("lists feedback", () => {
    $httpBackend.expectGET("/api/feedback/").respond([feedbackData]);
    expect(Feedback.list())
      .to.be.fulfilled.and
      .to.eventually.deep.equal([feedbackData]);
    $httpBackend.flush();
  });


});
