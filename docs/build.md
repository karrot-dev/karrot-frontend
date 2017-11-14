#  Build

This explains anything that relates to building the project

## IntlPolyfillServicePlugin

This is a small plugin based on [webpack-polyfill-injector](https://github.com/SebastianS90/webpack-polyfill-injector)
to polyfill `Intl` (via [polyfill.io](https://polyfill.io)) for browsers that don't have it.

It's a nice approach because it means we neither have to package the polyfill for everyone,
or make an extra request to the polyfill.io service if the browser supports it.

Most browsers already have it, but we got some errors from a Samsung android device that does not, see:
- issue [#748](https://github.com/yunity/karrot-frontend/issues/748)
- [Sentry error](https://sentry.io/foodsaving-worldwide/karrot/issues/403966409/)
