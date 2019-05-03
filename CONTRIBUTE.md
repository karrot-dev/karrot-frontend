# Contribution
If you want to contribute code to the frontend repository, you should first read through these guidelines.

## General

Have a look through the issues. If there's something that is interesting to you, assign it to yourself. Usually you will need additional information, so feel free to comment on the issue before you start writing code. Even better: join our [group chat](https://slackin.yunity.org) and get in direct contact with us!

## Feature development

If you have an idea about a feature or a change to an existing feature, just open an issue in the frontend repo and describe your idea briefly. Members of the development team will look into it and review the idea. Then write some code and stay in contact with us. If you need additional features in the backend, open an issue there (and reference the main frontend issue).

The feature will get merged if there is no resistance from the development team.

## Development workflow

To fix a bug or to add a new feature, the workflow is roughly the following. First, switch to master, get the latest version and update your dependencies:

```sh
git checkout master
git pull
yarn
```

Then you are ready to start working. Turn on the development server and open the URL (usually http://localhost:3000). As soon as you change a file in the repository and save it, it will automatically reload the page.

```sh
yarn dev
```

If you are finished with your work, you should run the tests and check the code style.

```sh
yarn test
yarn lint
```

You can use `yarn test` to disable the restarting the tests after a file changed. Also, if you use an IDE that supports [code style plugins](#code-style), you can usually skip the `lint` step.

```sh
git checkout -b newBranchForIssue
git diff
git add .
git commit
git push
```

If you now visit github.com/yunity/karrot-frontend, there should be a message that you can open a Pull Request for your recently pushed branch.

### Backend connection

Per default, all requests to `/api` are forwarded to the online backend `dev.karrot.world/api`.
To use a [local backend](https://github.com/yunity/karrot-backend/), create a file `.env` with content like

```
BACKEND=http://localhost:8000
```

## Code style

Be careful to adapt your coding style to the already existing one. That makes it easier for future contributors to understand and get used to the code. Some helps:

* We use [editorconfig](http://editorconfig.org/). Plugins are available for many editors, e.g. for Atom:`editorconfig`)
* check your code style with `yarn lint`, or better: install an `eslint` plugin in your IDE
* use `yarn fix` to automatically fix some kinds of code style errors
* Use ES6/7 features (including async/await)
* Avoid global components, import them where needed

### Translating and updating

Every morning, a cron job runs on CirleCI that updates messages from the `master` branch on transifex (our translation manager service). New translations will open up a Pull Request shortly afterwards.

## Making a new release

Have a look at the file `scripts/prepare-release.js`.

## Used tools and libraries

To make it easier to look for documentation and help on the internet, here's a list of our tools and libraries. It's roughly sorted by importance to developers.

* JS framework: [VueJS](https://vuejs.org/v2/guide/)
* UI framework: [Quasar](http://quasar-framework.org/guide/)
* State management: [Vuex](https://vuex.vuejs.org/en/)
* Style: [Stylus](http://stylus-lang.com/)
* Test framework: [Jest](https://facebook.github.io/jest/docs/en/getting-started.html)
