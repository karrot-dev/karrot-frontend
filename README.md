[![Stories in Ready](https://badge.waffle.io/yunity/foodsaving-frontend.svg?label=ready&title=ready)](http://waffle.io/yunity/foodsaving-frontend)
[![Stories in Progress](https://badge.waffle.io/yunity/foodsaving-frontend.svg?label=in-progress&title=in-progress)](http://waffle.io/yunity/foodsaving-frontend)
[![Stories in Progress](https://badge.waffle.io/yunity/foodsaving-frontend.svg?label=needs-approval&title=needs-approval)](http://waffle.io/yunity/foodsaving-frontend)

[![CodeCov](https://codecov.io/github/yunity/foodsaving-frontend/coverage.svg)](https://codecov.io/gh/yunity/foodsaving-frontend)
[![CircleCI](https://circleci.com/gh/yunity/foodsaving-frontend.svg?style=shield)](https://circleci.com/gh/yunity/foodsaving-frontend)
[![Known Vulnerabilities](https://snyk.io/test/github/yunity/yunity-angular/badge.svg)](https://snyk.io/test/github/yunity/yunity-angular)


# foodsaving frontend
Frontend for the foodsaving tool using AngularJS 1.5 (component-based style).
Read more about our [contribution guidelines](https://github.com/yunity/foodsaving-frontend/blob/master/CONTRIBUTE.md).

The [backend](https://github.com/yunity/foodsaving-backend) had quite some progress in the last months and is currently in a stable state. If you find a bug or miss something in the API, please file an issue in the backend repository.

We used the [NG6-starter](https://github.com/AngularClass/NG6-starter) kit.


## yunity and foodsaving
The foodsaving tool will be the first release of the yunity platform.
The [FSINT team](https://yunity.atlassian.net/wiki/display/FSINT/) within yunity provides additional resources to build up foodsaving.
At a later point, more features could be added that support the yunity vision and mission, e.g. multi-sharing communities, item pooling, integrated decision making (syscon).

### Potential users
In future, we want our feature requests to come directly from foodsaving communities, to fulfill their needs and desires.

We don't have testing communities yet: we are in touch with [existing foodsaving networks](https://yunity.atlassian.net/wiki/display/YUN/Existing+initiatives) who have shown interest in testing the tool once it presents sufficient features for them.

# Getting started

## Requirements

- nodejs and npm
- gulp `npm install -g gulp`
- chrome (for testing)

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
