#Contribution
If you want to contribute code to the frontend repository, you should first read through these guidelines.

##General
* before committing make sure `npm run lint` and `npm test` were successful
* branches and PRs instead of direct commits to master (except it is a small and urgent fix)
* if you are working on issues create a branch labeled as what your change (in one word) postfixed with `#` and issue number
* claim in the issue comments when you're working on one, and take part in the discussion
* follow the style guide
* be awesome and passionate

##Adding features

###Add components
To add a component just execute `gulp component --name <component>`. It will create all necessary files in *client/app/component*:
```
+<comp>
+-<comp>.component.js       component configuration
+-<comp>.controller.js      controller function
+-<comp>.html               component HTML
+-<comp>.js                 module declaration
+-<comp>.spec.js            tests
+-<comp>.styl               styles
```

###Add routes
Follow *Add components* first the add some routing configuration to `<component>.js`.
In case you need AngularUI Routers transition hooks create `<component>.hook.js` and place your hook code there. Make a `.run()` call your transition hook code.

###Add directives
If you need to add a directive place it as a separate file in your component folder. Name the file like `<component>.<directives name or job>.js`, for example `home.logout.js`. Define it in `<component>.js`, then.

###Add services
Add services by executing `gulp component --name <service> --template service --parent ../common`.
```
+<service>
+-<service>.js              module declaration
+-<service>.service.js      service fetching data
+-<service>.spec.js         tests
```

##Code style
* use the *.editorconfig* file (for atom: install *editorconfig* module)
* Use ES6 features

##How to use what?

###Directives
Please avoid built-in directives like `ng-click`. Create a directive instead but keep them simple as possible.

###Controller
Keep controllers simple!
As the use of `ng-click` is discouraged, so are controller functions.

###Services
A service calls the backend through `$http` and validates data.
