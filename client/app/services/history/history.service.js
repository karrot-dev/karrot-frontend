class HistoryService {
  constructor() {
    "ngInject";
    Object.assign(this, {
    });
  }
  get(filter = {}) {
    return [
      {
        date: new Date(),

      }
    ]
  }
}

export default HistoryService;
