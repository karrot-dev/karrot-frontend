//TODO: Add tests

import PickupDateModule from './pickupDate';

describe('pickupDate service', function() {
  beforeEach(window.module(PickupDateModule));
  let $httpBackend; //PickupDate;

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    //PickupDate = $injector.get('PickupDate');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
})