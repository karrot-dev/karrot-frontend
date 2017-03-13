import template from "./searchBar.html";
import controller from "./searchBar.controller";
import "./searchBar.styl";

let searchBarComponent = {
  bindings: {
    searchQuery: "="
  },
  template,
  controller
};

export default searchBarComponent;
