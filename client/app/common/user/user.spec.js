import UserService from './user';

describe('user service', () => {
  var $httpBackend, requestHandler;

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');

    var userData = [{
        "id": 1,
        "display_name": "Mr T",
        "first_name": "tilmann",
        "last_name": "becker",
        "email": "til@man.com",
        "address": null,
        "latitude": null,
        "longitude": null
    }];
    requestHandler = $httpBackend.when('GET', '/api/users')
      .respond(userData);
  }));

  afterEach(function() {
  $httpBackend.verifyNoOutstandingExpectation();
  $httpBackend.verifyNoOutstandingRequest();
});

  it('lists users', () => {
    $httpBackend.expectGET('/api/users');
    UserService.users();
  });
})
