class GroupComService {

  constructor($http) {
    'ngInject';
    this.$http=$http;
  }
  
  groups(/*search*/) {
    return this.$http.get('/api/groups/')
    .then((data) => {
      return Promise.resolve(data.data);
    }, (data) => {
      return Promise.reject();
    });      
  } 
  
  create(group) {
    return this.$http.post('/api/groups/',group)
    .then(() => {
      return Promise.resolve();
    }, () => {
      return Promise.reject();
    });
  }

  get(groupId) {
    return this.$http.get(`/api/groups/${groupId}`)
    .then((data) => {
      return Promise.resolve(data.data);
    }, () => {
      return Promise.reject();
    });
  }

  save(group) {
    return this.$http.patch(`/api/groups/${group.id}/`)
    .then((data) => {
      return Promise.resolve(data.data);
    }, () => {
      return Promise.reject();
    });
  }

  delete(groupId) {
    return this.$http.delete(`/api/groups/${groupId}`)
    .then(() => {
      return Promise.resolve();
    }, () => {
      return Promise.reject();
    })
  }
}

export default GroupComService;
