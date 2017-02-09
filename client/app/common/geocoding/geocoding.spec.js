import GeocodingModule from "./geocoding";

const { module } = angular.mock;

describe("geocoding", () => {
  let $httpBackend, Geocoding;
  beforeEach(() => {
    module(GeocodingModule);
  });

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    Geocoding = $injector.get("Geocoding");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("gets coords for address", () => {
    let latlonname = [{
      lat: "1.99",
      lon: "2.99",
      display_name: "something" // eslint-disable-line
    }];
    $httpBackend.expectGET("https://nominatim.openstreetmap.org/search?accept-language=en&format=json&q=enter_some")
      .respond(latlonname);
    expect(Geocoding.lookupAddress("enter_some", "en"))
      .to.be.fulfilled.and
      .to.eventually.deep.equal([
        {
          lat: 1.99,
          lng: 2.99,
          name: "something"
        }
      ]);
    $httpBackend.flush();
  });

});
