# Mobile

We use cordova to package the app as an android app. This gives us access to push notifications (doesn't yet have decent [mobile browser support](https://caniuse.com/#feat=push-api)), and offers the installable app experience that some people expect.

## Android SDK Setup

Firstly, make sure you have a working Android SDK setup, and a working emulator configuration. See [Android Setup](android-sdk.md) for more details.

## Get some credentials to make push messaging work

We use google firebase messaging for push notifications. We have two firebase projects, karrot (for karrot.world), and karrot-dev (for dev.karrot.world). If you want access to either of them then ask us, otherwise you can create your own project to use locally.

### frontend

- go to https://console.firebase.google.com
- select (or create) the project
- project settings
- general tab
- select (or create) the app
- there is a button to download `google-services.json`
- put that in the root of the cordova directory (`karrot-frontend/cordova`)

### backend

- go to https://console.firebase.google.com
- project settings
- cloud messaging tab
- in the "Project credentials" section there should be a "server key" available
- put it in your backend local settings under `FCM_SERVER_KEY` (`karrot-backend/config/local_settings.py`)

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

If you have an android device connected in USB debugging mode it will install it on that,
otherwise it will try and start an emulator, but you might have to run one yourself if the default does not work.

Then open the chrome developer tools, which can connect to the remote webview:

```
chrome://inspect
```

## Building

We try and make as easy as possible to build an installable app during development. There are a few pieces:
- `karrot.jks` keystore with a common yunity password
- `google-services.json` for development (which [seems](https://groups.google.com/forum/#!topic/firebase-talk/bamCgTDajkw) to be safe into include)
- config.xml containing app details

We maintain a dev config inside the repo. When we are ready for production we will probably keep the files more secret.

The aim is that the dev version would connect to dev.karrot.world and the production one to karrot.world.

### Debug build

```
cordova build android -- --password=<password> --storePassword=<password>
```

If you connect your phone to your computer, you can use the chrome debugging tools with this.

### Release build

```
cordova build android --release -- --password=<password> --storePassword=<password>
```
