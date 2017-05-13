
class HistoryService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }//03-22-2017
  list(filter) {
    return this.$http.get("/api/history/", { params: filter })
      .then((res) => {
        return res.data.results.map( (entry) => {
          entry.date = new Date(entry.date);
           var utc = new Date().toISOString().substr(0,10); 
          if (entry.date.toISOString().substr(0,10)==utc)
            entry.status="Today, ";
          else if (entry.date.toISOString().substr(0,2)==utc.substr(0,2) && entry.date.toISOString().substr(6,10)==utc.substr(6,10) && parseInt(entry.date.toISOString().substr(3,5),10)==parseInt(utc.substr(3,5),10)-1) 
            entry.status="Yesterday, ";
          return entry;
        });
      });
  }
}

export default HistoryService;
