Cookie Emperor
==============

Since cordova apps should not live without the Crosswalk Project anymore and the InAppBrowser-plugin does not use the XWalk webview sharing cookies is not that easy. Setting up cookies via
document.cookie does not provide the expected result and thus the CookieMaster was born. Since CookieMaster is no longer maintained and cannot be build with android sdk < 23 (without gradle hacks)
I came to the conclusion to fork this project and keep it maintained to a certain level.

Feel free to contribute, pull-requests will be reviewed.

## Supported Platforms
* Android
* iOS

## Installing

Install with Cordova CLI

    $ cordova plugin add https://github.com/rtk/cordova-cookie-emperor.git

## Usage
A global object cookieEmperor will be bound to the window object.

### Get cookie value
```javascript
window.cookieEmperor.getCookie('http://<some host>:<some port>', '<cookie name>', function(data) {
  console.log(data.cookieValue);
}, function(error) {
  if (error) {
    console.log('error: ' + error);
  }
});
```
### Set cookie value
```javascript
window.cookieEmperor.setCookie('http://<some host>:<some port>', '<cookie name>', '<cookie value>',
    function() {
        console.log('A cookie has been set');
    },
    function(error) {
        console.log('Error setting cookie: '+error);
    });
```
The cookie value should be formatted just like a regular <code>document.cookie</code> value.

### Clear all cookies
```javascript
window.cookieEmperor.clearAll(
    function() {
    console.log('Cookies have been cleared');
    },
    function() {
        console.log('Cookies could not be cleared');
    });
```

## License
This plugin is distributed under the MIT License.

## Thanks to
This plugin is forked from https://github.com/kristianhristov/cordova-cookie-master