import GeocodingModule from "./geocoding";

const { module } = angular.mock;

describe("geocoding", () => {
  let $httpBackend, Geocoding;
  beforeEach(() => {
    module(GeocodingModule);
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
    $httpBackend.expectGET("https://nominatim.openstreetmap.org/search?format=json&limit=1&q=enter_some")
      .respond(latlonname);
    expect(Geocoding.lookupAddress("enter_some"))
      .to.be.fulfilled.and
      .to.eventually.deep.equal({
        latitude: 1.99,
        longitude: 2.99,
        name: "something"
      });
    $httpBackend.flush();
  });

});
