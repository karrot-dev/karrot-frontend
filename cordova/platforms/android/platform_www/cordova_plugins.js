cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-cookieemperor.cookieEmperor",
        "file": "plugins/cordova-plugin-cookieemperor/www/cookieEmperor.js",
        "pluginId": "cordova-plugin-cookieemperor",
        "clobbers": [
            "cookieEmperor"
        ]
    },
    {
        "id": "cordova-plugin-fcm.FCMPlugin",
        "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
        "pluginId": "cordova-plugin-fcm",
        "clobbers": [
            "FCMPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "cordova-plugin-cookieemperor": "1.0.0",
    "cordova-plugin-crosswalk-webview": "2.3.0",
    "cordova-plugin-fcm": "2.1.2"
};
// BOTTOM OF METADATA
});