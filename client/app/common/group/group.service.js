class GroupComService {

  constructor($http) {
    'ngInject';
    this.$http=$http;
  }
  
  groups(/*search*/) {
    return this.$http.get('/api/groups/').then(res => res.data);
  } 
  
  create(group) {
    return this.$http.post('/api/groups/', group).then(res => res.data);
  }

  get(groupId) {
    return this.$http.get(`/api/groups/${groupId}/`).then(res => res.data);
  }

  save(groupId, updates) {
    return this.$http.patch(`/api/groups/${groupId}/`, updates).then(res => res.data);
  }

  delete(groupId) {
    return this.$http.delete(`/api/groups/${groupId}/`);
  }
}

export default GroupComService;
