class <%= upCaseName %>Service {
  constructor(<%= upCaseName %>Communication) {
    'ngInject';
    this.<%= upCaseName %>Com=<%= upCaseName %>Communication;
  }
}

export default <%= upCaseName %>Service;
