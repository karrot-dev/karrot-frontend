import GroupModule from './group';

describe('group service', function() {
  beforeEach(window.module(GroupModule));
  let $httpBackend, Group;

  let groupData = [{
      "id": 1,
      "name": "Foodsharing Darmstadt",
      "address": "Luisenplatz 1",
      "latitude": "49.4879289985449",
      "longitude": "8.46548080444336",
      "members": []
  }];

  let groupCreateData = [{
      "id": 1,
      "name": "Foodsharing Darmstadt",
      "address": "Luisenplatz 1",
      "latitude": "49.4879289985449",
      "longitude": "8.46548080444336"
  }];

  let groupModifyData = {
    "name": "Foodsharing Darmstadt"
  };

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Group = $injector.get('Group');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('lists groups', () => {
    $httpBackend.expectGET('/api/groups/').respond(groupData);
    Group.groups().then((data) => {
      expect(data).to.deep.equal(groupData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it('creates group', () => {
    $httpBackend.expectPOST('/api/groups/', groupCreateData).respond(groupData);
    Group.create(groupCreateData).then((data) => {
      expect(data).to.deep.equal(groupData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it('get group details', () => {
    $httpBackend.expectGET('/api/groups/1/').respond(groupData);
    Group.get(1).then((data) => {
      expect(data).to.deep.equal(groupData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it('save group details', () => {
    $httpBackend.expectPATCH('/api/groups/1/', groupModifyData).respond(groupData);
    Group.save(1, groupModifyData).then((data) => {
      expect(data).to.deep.equal(groupData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it('delete group', () => {
    $httpBackend.expectDELETE('/api/groups/1/').respond(200);
    Group.delete(1).then(() => {
      assert(true);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });
})