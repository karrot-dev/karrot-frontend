# Mobile

We use cordova to package the app as an android app. This gives us access to push notifications (doesn't yet have decent [mobile browser support](https://caniuse.com/#feat=push-api)), and offers the installable app experience that some people expect.

## Android SDK Setup

Firstly, make sure you have a working Android SDK setup, and a working emulator configuration. See [Android Setup](android-sdk.md) for more details.

## Install

Install cordova globally:

```
yarn global add cordova
```

Build the main project:
```
yarn build:cordova
```

(You can customize the backend by setting the `BACKEND` env variable, e.g. in `.env`)

Enter the cordova directory from the project root:
```
cd cordova
```

Add android platform:
```
cordova platform add android
```

Run!
```
cordova run android
```

It will try and start an emulator, but you might have to run one yourself if the default does not work.

Then open the chrome developer tools, which can connect to the remote webview:

```
chrome://inspect
```