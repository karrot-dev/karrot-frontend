class AuthenticationService {

  constructor($http,$q) {
    "ngInject";
    this.$http = $http;
    this.$q = $q;
  }

  login(email,password) {
    return this.$http.post("/api/auth/", { email,password })
      .then((data) => data.data).catch((data) => this.$q.reject(data.data));
  }

  update() {
    return this.$http.get("/api/auth/status/")
      .then((data) => data.data).catch((data) => this.$q.reject(data.data));
  }

  logout() {
    return this.$http.post("/api/auth/logout/", {});
  }
}

export default AuthenticationService;
