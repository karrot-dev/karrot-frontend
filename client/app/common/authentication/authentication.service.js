class AuthenticationService {

  constructor($http, $q) {
    "ngInject";
    this.$http = $http;
    this.$q = $q;
  }

  login(email, password) {
    return this.$http.post("/api/auth/", { email, password })
      .then((res) => res.data)
      .catch((res) => this.$q.reject(res.data));
  }

  update() {
    return this.$http.get("/api/auth/status/")
      .then((res) => res.data)
      .catch((res) => this.$q.reject(res.data));
  }

  logout() {
    return this.$http.post("/api/auth/logout/", {});
  }
}

export default AuthenticationService;
