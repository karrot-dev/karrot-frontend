class base {

  static properties () {
    return [];
  }

  validate(o, cb, conc) {
    if(Array.isArray(cb)) {
      cb = null;
      conc = cb;
    }
    var props=this.constructor.properties();
    if(conc) props=props.concat(conc);
    for (let p of props) {
      if(!o.hasOwnProperty(p) || (cb?cb.call(this,p,o):String(o[p]) === ""))
        return false;
    }
    return true;
  }
  constructor() {}
}

export default base;
