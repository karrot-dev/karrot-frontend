let AppTitleConfig = ["$rootScope", "$breadcrumb", "$document", ($rootScope, $breadcrumb, $document) => {
  $rootScope.setPageTitle = () => {
    let pageTitleString = "";
    let breadcrumbs = $breadcrumb.getStatesChain();
    angular.forEach(breadcrumbs, (crumb) => {
      pageTitleString = crumb.ncyBreadcrumbLabel + " · " + pageTitleString;
    });
    pageTitleString += "Foodsaving";
    $document[0].title = pageTitleString;
  };

  $rootScope.$watch(() => {
    return $document[0].URL;
  }, $rootScope.setPageTitle);
}];

export default AppTitleConfig;
