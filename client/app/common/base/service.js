class base {

  static properties () {
    return [];
  }

  static validate(o, cb, conc) {
    if(Array.isArray(cb)) {
      cb = null;
      conc = cb;
    }
    if(!cb)
      cb = (p,o) => {
        return !(String(o[p]) === "")
      };
    var props=this.properties();
    if(conc)
      props=props.concat(conc);
    for (let p of props) {
      if(!o.hasOwnProperty(p) || !cb.call(this,p,o,props)) {
        return false;
      }
    }
    return true;
  }
  constructor() {}
}

export default base;
