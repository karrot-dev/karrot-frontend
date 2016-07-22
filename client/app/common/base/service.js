class base {
  validate(o) {
    for (prop of this.properties) {
      if(!o.hasOwnProperty(prop))
        return false;
    }
    return true;
  }
  constructor() {

  }
}

export default base;
