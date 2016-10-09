class AuthCommunicationService {

  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  login(email,password) {
    return this.$http.post("/api/auth/",{ email,password })
      .then((res) => res.data);
  }

  update() {
    return this.$http.get("/api/auth/status/")
      .then((res) => res.data);
  }

  logout() {
    return this.$http.post("/api/auth/logout/");
  }
}

export default AuthCommunicationService;
