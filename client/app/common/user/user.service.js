class UserCommunicationService {

  constructor($http) {
    'ngInject';
    this.$http=$http;
  }

  users(/*search*/) {
    return this.$http.get('/api/users/')
    .then((data) => {
      return Promise.resolve(data.data);
    }, (data) => {
      return Promise.reject(data);
    });
  }

  create(user) {
    return this.$http.post('/api/users/',user)
    .then(() => {
      return Promise.resolve();
    }, () => {
      return Promise.reject();
    });
  }

  get(pk) {
    return this.$http.get(`/api/users/${pk}`)
    .then((data) => {
      return Promise.resolve(data.data);
    }, () => {
      return Promise.reject();
    });
  }

  save(user) {
    return this.$http.patch(`/api/users/${user.id}/`)
    .then((data) => {
      return Promise.resolve(data.data);
    }, () => {
      return Promise.reject();
    });
  }

  delete(pk) {
    return this.$http.delete(`/api/users/${pk}`)
    .then(() => {
      return Promise.resolve();
    }, () => {
      return Promise.reject();
    })
  }
}

export default UserCommunicationService;
