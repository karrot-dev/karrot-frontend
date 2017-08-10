# Contribution
If you want to contribute code to the frontend repository, you should first read through these guidelines.

## General

Have a look through the issues. If there's something that is interesting to you, assign it to yourself. Usually you will need additional information, so feel free to comment on the issue before you start writing code. Even better: join our [group chat](slackin.yunity.org) and get in direct contact with us!

## Feature development

If you have an idea about a feature or a change to an existing feature, just open an issue in the frontend repo and describe your idea briefly. Members of the development team will look into it and review the idea. Then write some code and stay in contact with us. If you need additional features in the backend, open an issue there (and reference the main frontend issue).

The feature will get merged if there is no resistance from the development team.

## Development workflow

To fix a bug or to add a new feature, the workflow is roughly the following. First, switch to master, get the lastest version and update your dependencies:

```sh
git checkout master
git pull
yarn
```

Then you are ready to start working. Turn on the development server and open the URL (usually http://localhost:3000). As soon as you change a file in the repository and save it, it will automatically reload the page.

```sh
yarn run dev
```

If you are finished with your work, you should run the tests and check the code style.

```sh
yarn run test:watch
yarn run lint
```

You can use `yarn run test` to disable the restarting the tests after a file changed. Also, if you use an IDE that supports [code style plugins](#code-style), you can usually skip the `lint` step.

```sh
git checkout -b newBranchForIssue
git diff
git add .
git commit
git push
```

If you now visit github.com/yunity/foodsaving-frontend, there should be a message that you can open a Pull Request for your recently pushed branch.

### Backend connection

Per default, all requests to `/api` are forwarded to the online backend `foodsaving.world/api`.
To use a [local backend](https://github.com/yunity/foodsaving-backend/), create a file `.env` with content like

```
BACKEND=http://localhost:8080/
```


## Adding features

### Add components
To add a component, just execute `gulp component --name <component>`. It will create all necessary files in `client/app/_<component>`:

```
+<component>
+-<component>.component.js       component configuration
+-<component>.controller.js      controller function
+-<component>.html               component HTML
+-<component>.js                 module declaration
+-<component>.spec.js            tests
+-<component>.styl               styles
```

To add a component that already includes a route definition (URL), execute `gulp page --name <component>`.

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

## Code style

Be careful to adapt your coding style to the already existing one. That makes it easier for future contributors to understand and get used to the code. Some helps:

* We use [editorconfig](http://editorconfig.org/). Plugins are available for many editors, e.g. for Atom:`editorconfig`)
* check your code style with `yarn run lint`, or better: install an `eslint` plugin in your IDE
* Use ES6 features (but use `$q` of `Promise`, see here: https://github.com/yunity/foodsaving-frontend/issues/45)
* Avoid creating directives
* Avoid global components, import them where needed

## Strings and translation

### Adding new messages

If you want to add a message to the user, be sure to make it translatable. You can follow this workflow:

1. add the message using the `translate` directive, e.g. `<span translate="SOME.MESSAGE"></span>`. Other possibilities can be found in the [angular-translate documentation](https://angular-translate.github.io/docs/#/guide)
2. add the translation message to the source file: `config/app/locales/locale-en.json`

```json
"SOME": {
  "MESSAGE": "This is my message to the user"
}
```

### Translating and updating

Use the [transifex command line client](https://docs.transifex.com/client/introduction) to upload the new messages to the translation service and download the translated files after they've been translated in our [transifex project](https://www.transifex.com/yunity-1/foodsaving-tool/dashboard/).

```sh
# push English source
tx push -s

# get translated files
yarn run update_i18n

# (it will run the following commands:)
# tx pull -a
# curl https://www.transifex.com/api/2/project/foodsaving-tool/resource/frontend/stats/
```

Now you can commit those files and open a Pull Request in GitHub.

## Used tools and libraries

To make it easier to look for documentation and help on the internet, here's a list of our tools and libraries. It's roughly sorted by importance to developers.

* [AngularJS](https://docs.angularjs.org)
* User interface library: [Angular Material](https://material.angularjs.org/latest/api/)
* [Stylus](http://stylus-lang.com/), we use it instead of CSS
* Test framework: [Mocha](https://mochajs.org/)
* Assertions for tests: [Chai](http://chaijs.com/)
* Stubs and mocks for tests: [Sinon](http://sinonjs.org/)
* Test runner: [Karma](https://karma-runner.github.io/)
