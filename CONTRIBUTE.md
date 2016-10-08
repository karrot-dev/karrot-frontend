# Contribution
If you want to contribute code to the frontend repository, you should first read through these guidelines.

## Development process

If you have an idea about a feature or a change to an existing feature, just open an issue in the frontend repo and describe your idea briefly. Members of the development team will look into it and review the idea. Then write some code and stay in contact with us. If you need additional features in the backend, open an issue there (and reference the main frontend issue).

The feature will get merged if there is no resistance from the development team.

## General
* before committing make sure `npm run lint` and `npm test` were successful
* branches and PRs instead of direct commits to master (except it is a small and urgent fix)
* if you are working on issues create a branch labeled as what your change (in one word) postfixed with `#` and issue number
* claim in the issue comments when you're working on one, and take part in the discussion
* follow the style guide
* be awesome and passionate

## Adding features

### Add components
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

### Add routes
Follow *Add components* first the add some routing configuration to `<component>.js`.
In case you need AngularUI Routers transition hooks create `<component>.hook.js` and place your hook code there. Make a `.run()` call your transition hook code.

### Add directives
If you need to add a directive place it as a separate file in your component folder. Name the file like `<component>.<directives name or job>.js`, for example `home.logout.js`. Define it in `<component>.js`, then.

### Add services
Add services by executing `gulp component --name <service> --template service --parent ../common`.
```
+<service>
+-<service>.js              module declaration
+-<service>.service.js      service fetching data
+-<service>.spec.js         tests
```

## Code style
* use the *.editorconfig* file (for atom: install *editorconfig* module)
* Use ES6 features

## How to use what?

### Directives
Use built-in directives, e.g. `ng-click`.

### Controller
Use controller functions, but keep them simple.

### Services
A service calls the backend through `$http` and validates data.
