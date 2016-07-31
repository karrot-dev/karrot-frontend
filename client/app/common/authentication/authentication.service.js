class AuthCommunicationService {

  constructor($rootScope, $http) {
    'ngInject';
    this.$http=$http;
  }

  login(email,password) {
    return this.$http.post('/api/auth/',{email,password})
    .then((data) => {
      return Promise.resolve(data.data);
    }, (data) => {
      return Promise.reject(data);
    });
  }

  update() {
    return this.$http.get('/api/auth/status/')
    .then((data) => {
      return Promise.resolve(data.data);
    }, () => {
      return Promise.reject();
    });
  }

  logout() {
    var email='',password='';
    return this.$http.post('/api/auth/logout/',{email,password})
    .then(() => {
      return Promise.resolve()
    }, () => {
      return Promise.reject();
    });
  }
}

export default AuthCommunicationService;
