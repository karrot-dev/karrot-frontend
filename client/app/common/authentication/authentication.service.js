class AuthenticationService {

  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  login(email,password) {
    return this.$http.post("/api/auth/", { email,password })
      .then((data) => data.data);
  }

  update() {
    return this.$http.get("/api/auth/status/")
      .then((data) => data.data);
  }

  logout() {
    let email = "",password = "";
    return this.$http.post("/api/auth/logout/", { email,password });
  }
}

export default AuthenticationService;
