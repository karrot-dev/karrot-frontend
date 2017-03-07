class SearchBarController {
  constructor($timeout, $window) {
    "ngInject";
    Object.assign(this, {
      $timeout,
      $window,
      showSearch: false
    });
  }

  toggleSearch(){
    this.showSearch = !this.showSearch;
    if (this.showSearch){
      this.$timeout(() => {
        const searchInputField = this.$window.document.getElementById("search-bar");
        searchInputField.focus();
      }, 200);
    }
  }

  searchEntryDone(){
    this.showSearch = this.searchQuery !== "";
  }
}

export default SearchBarController;
