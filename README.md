[![CodeCov](https://codecov.io/github/yunity/foodsaving-frontend/coverage.svg)](https://codecov.io/gh/yunity/foodsaving-frontend)
[![CircleCI](https://circleci.com/gh/yunity/foodsaving-frontend.svg?style=shield)](https://circleci.com/gh/yunity/foodsaving-frontend)
[![Known Vulnerabilities](https://snyk.io/test/github/yunity/foodsaving-frontend/e4f6927cccfbde340636d20b863efd508be19ec0/badge.svg)](https://snyk.io/test/github/yunity/foodsaving-frontend/e4f6927cccfbde340636d20b863efd508be19ec0)


# foodsaving frontend

Welcome to the foodsaving tool frontend repository! This is the browser-side software that powers [foodsaving worldwide](https://foodsaving.world).


## yunity and foodsaving

The foodsaving tool is a project of [yunity](https://yunity.org). 
The [foodsaving worldwide team](https://yunity.atlassian.net/wiki/display/FSINT/) within yunity provides additional resources to build up foodsaving.
At a later point, more features could be added that support the yunity vision and mission, e.g. multi-sharing communities, item pooling, integrated decision making (syscon).

## Development goals

Our current development goals are prioritized and written down in our [elaborate roadmap](ROADMAP.md).

We are keeping the features down to a minimum, in order to progressively build up a useful tool.

## Releases

Look into our [change log file](CHANGELOG.md) for a quick overview of past versions and recent changes.

### Potential users

Have a look [on the live site](https://foodsaving.world) for all groups that have registered so far. Not all of them are using the app right now, but we have received feature requests from them.

## Translation

We are using [Transifex](https://www.transifex.com/) to provide the foodsaving tool in many languages. To help us with translation, please [create an account](http://transifex.com/signup) and [apply for foodsaving tool group](https://www.transifex.com/yunity-1/foodsaving-tool/frontend/).

After selecting your destination language and choosing the resource file, go ahead to start translating!

# Setup

## Requirements

- [Node.js](https://nodejs.org/) and [yarn](https://yarnpkg.com/en/docs/install)
- gulp (`yarn global add gulp`)
- chrome or [chromium](https://www.chromium.org/) (for testing)

To clone and install:

```
git clone https://github.com/yunity/foodsaving-frontend.git
cd foodsaving-frontend
yarn
```

To run the local dev server:

```
yarn run dev
```

To lint and run the tests:

```
yarn run lint
yarn run test
```

If you want to use an eslint plugin for your editor, please keep in mind that you either have to install all eslint plugins listed in package.json globally or you run `yarn install`. Otherwise your eslint plugin may not work.

# Start contributing?

Be sure to join us in the #foodsaving-tool [chatroom on slack](https://slackin.yunity.org/) and get in contact!
The most important information are written down in our [contribution guidelines](CONTRIBUTE.md).

The [backend](https://github.com/yunity/foodsaving-backend) is developed to support this frontend. If you find a bug or miss something in the API, please file an issue in the backend repository.
