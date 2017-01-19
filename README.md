[![Stories in Ready](https://badge.waffle.io/yunity/foodsaving-frontend.svg?label=ready&title=ready)](http://waffle.io/yunity/foodsaving-frontend)
[![Stories in Progress](https://badge.waffle.io/yunity/foodsaving-frontend.svg?label=in-progress&title=in-progress)](http://waffle.io/yunity/foodsaving-frontend)
[![Stories in Progress](https://badge.waffle.io/yunity/foodsaving-frontend.svg?label=needs-approval&title=needs-approval)](http://waffle.io/yunity/foodsaving-frontend)

[![CodeCov](https://codecov.io/github/yunity/foodsaving-frontend/coverage.svg)](https://codecov.io/gh/yunity/foodsaving-frontend)
[![CircleCI](https://circleci.com/gh/yunity/foodsaving-frontend.svg?style=shield)](https://circleci.com/gh/yunity/foodsaving-frontend)
[![Known Vulnerabilities](https://snyk.io/test/github/yunity/foodsaving-frontend/e4f6927cccfbde340636d20b863efd508be19ec0/badge.svg)](https://snyk.io/test/github/yunity/foodsaving-frontend/e4f6927cccfbde340636d20b863efd508be19ec0)


# foodsaving frontend
Frontend for the foodsaving tool using AngularJS 1.5 (component-based style).
Read more about our [contribution guidelines](https://github.com/yunity/foodsaving-frontend/blob/master/CONTRIBUTE.md).

The [backend](https://github.com/yunity/foodsaving-backend) had quite some progress in the last months and is currently in a stable state. If you find a bug or miss something in the API, please file an issue in the backend repository.

We used the [NG6-starter](https://github.com/AngularClass/NG6-starter) kit.


## yunity and foodsaving
The foodsaving tool will be the first release of the yunity platform.
The [FSINT team](https://yunity.atlassian.net/wiki/display/FSINT/) within yunity provides additional resources to build up foodsaving.
At a later point, more features could be added that support the yunity vision and mission, e.g. multi-sharing communities, item pooling, integrated decision making (syscon).

## Development goals

Our current development goals are prioritized and written down in our [elaborate roadmap](ROADMAP.md).

We are keeping the features down to a minimum (check out [that meeting's notes](https://yunity.atlassian.net/wiki/display/YUN/2016-09-13+-+Narrowing+down+features)), in order to progressively build up a useful tool.

## Releases

Look into our [change log file](CHANGELOG.md) for a quick overview of past versions and recent changes.

### Potential users
In future, we want our feature requests to come directly from foodsaving communities, to fulfill their needs and desires.

We don't have testing communities yet: we are in touch with [existing foodsaving networks](https://yunity.atlassian.net/wiki/display/YUN/Existing+initiatives) who have shown interest in testing the tool once it presents sufficient features for them.

## Translation

We are using [Transifex](https://www.transifex.com/) to provide the foodsaving tool in many languages. To help us with translation, please [create an account](http://transifex.com/signup) and [apply for foodsaving tool group](https://www.transifex.com/yunity-1/foodsaving-tool/frontend/).

After selecting your destination language and choosing the resource file, go ahead to start translating!

# Getting started

## Requirements

- nodejs and npm
- gulp `npm install -g gulp`
- chrome or chromium (for testing)

To clone and install

```
git clone
cd foodsaving-frontend
npm install
```

To run the local dev server

```
npm run dev
```

To lint and run the tests

```
npm run lint
npm run test
```

If you want to use an eslint plugin for your editor, please keep in mind that you either have to install all eslint plugins listed in package.json globally or you run `npm install`. Otherwise your eslint plugin may not work.

## Backend

Per default, all requests to `/api` are forwarded to the online backend `foodsaving.world/api`.
To use a local backend, create a file `.env` with content like

```
BACKEND=http://localhost:8080/
```

## Transifex integration

Configuration for the [transifex CLI client](https://docs.transifex.com/client/) is in `.tx/config`. After instaling the client, you can use `tx push` and `tx pull` to synchronize the strings with the transifex server.
# Questions?

Join our [open chatroom on matrix.org](https://riot.im/app/#/room/#foodsaving-tool:matrix.org)!
