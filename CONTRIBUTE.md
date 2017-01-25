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
To add a component(-partial) just execute `gulp component --name <component>`. It will create all necessary files in *client/app/_<component>* (The underscore is there for clarification, that this is not a page component):
```
+<component>
+-<component>.component.js       component configuration
+-<component>.controller.js      controller function
+-<component>.html               component HTML
+-<component>.js                 module declaration
+-<component>.spec.js            tests
+-<component>.styl               styles
```

To add a component-page, execute `gulp page --name <component>`. In comparison to the above, it adds some default routing configuration.

### Add routes
Follow *Add components* first to create your page component.
In the config section you can use the `hookProvider` to create a new hook to handle rerouting.
The method `hookProvider.setup("targetState", { authenticated: true, anonymous: "login" });` can handle different behaviours for an authenticated ("loggedIn") and anonymous state.

### Add directives
If you need to add a directive place it as a separate file in your component folder. Name the file like `<component>.<directives name or job>.js`, for example `home.logout.js`. Define it in `<component>.js`, then.

### Add services
Add services by executing `gulp service --name <service>`.
```
+<service>
+-<service>.js              module declaration
+-<service>.service.js      service fetching data
+-<service>.spec.js         tests
```

## Naming conventions
* components, that don't add a route (=partials) should have a "_"-prefix in their folder name

## Code style
* use the *.editorconfig* file (for atom: install *editorconfig* module)
* Use ES6 features (except of `Promise`, see here: https://github.com/yunity/foodsaving-frontend/issues/45)
* Avoid creating directives
* Avoid global components, import them where needed

## Strings and translation

If you want to add a message to the user, follow this workflow:

1. in your feature branch, add a new key-value pair in `locale-en.json`
2. open a Pull Request, get it merged to master
3. upload `locale-en.json` to our transifex project - you can ask in yunity Slack #foodsaving-tool for help
4. get it translated - you can ask in yunity Slack #translation
5. download the resulting `locale-**.json` files and get it merged to master

The transifex command line client can help you with steps 3 and 5.

## How to use what?

### Directives
Use built-in directives, e.g. `ng-click`.

### Controller
Use controller functions, but keep them simple.

### Services
A service calls the backend through `$http` and validates data.
