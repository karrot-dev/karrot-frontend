class PickupDateComService {
  constructor($http) {
    'ngInject';
    this.$http=$http;
  }
  
  pickupDate(/*search*/) {
    return this.$http.get('/api/pickup-dates/').then(res => res.data);
  } 
  
  create(group) {
    return this.$http.post('/api/pickup-dates/', group).then(res => res.data);
  }
  
  get(params) {
    return this.$http({
        url: '/api/pickup-dates/', 
        method: "GET",
        params: params
     }).then(res => res.data);
  }

  getById(pickupId) {
    return this.$http.get(`/api/pickup-dates/${pickupId}/`).then(res => res.data);
  }

  save(pickupId, updates) {
    return this.$http.patch(`/api/pickup-dates/${pickupId}/`, updates).then(res => res.data);
  }

  delete(pickupId) {
    return this.$http.delete(`/api/pickup-dates/${pickupId}/`);
  }
  
  join(pickupId) {
    return this.$http.post(`/api/pickup-dates/${pickupId}/add/`, {});
  }
  
  leave(pickupId) {
    return this.$http.post(`/api/pickup-dates/${pickupId}/remove/`, {});
  }
}

export default PickupDateComService;
