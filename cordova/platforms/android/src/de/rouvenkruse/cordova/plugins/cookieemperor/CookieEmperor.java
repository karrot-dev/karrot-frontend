package de.rouvenkruse.cordova.plugins.cookieemperor;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.os.Build;
import android.webkit.ValueCallback;
import android.webkit.CookieManager;

import org.xwalk.core.XWalkCookieManager;

/*
XWalkCookieManager cookieManager = new XWalkCookieManager();
String someCookie = cookieManager.getCookie("http://mydomain");
*/

public class CookieEmperor extends CordovaPlugin {

    public static final String ACTION_GET_COOKIE_VALUE = "getCookieValue";
    public static final String ACTION_SET_COOKIE_VALUE = "setCookieValue";
    public static final String ACTION_CLEAR_COOKIES = "clearCookies";

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (ACTION_GET_COOKIE_VALUE.equals(action)) {
            return this.getCookie(args, callbackContext);
        }
        else if (ACTION_SET_COOKIE_VALUE.equals(action)) {
            return this.setCookie(args, callbackContext);
        }
        else if (ACTION_CLEAR_COOKIES.equals(action)) {
            CookieManager cookieManager = CookieManager.getInstance();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                cookieManager.removeAllCookies(new ValueCallback<Boolean>() {
                    @Override
                    public void onReceiveValue(Boolean value) {}
                });

                cookieManager.flush();
            }
            else {
                cookieManager.removeAllCookie();
                cookieManager.removeSessionCookie();
            }

            callbackContext.success();
        }

        callbackContext.error("Invalid action");
        return false;

    }

    /**
     * returns cookie under given key
     * @param args
     * @param callbackContext
     * @return
     */
    private boolean getCookie(JSONArray args, final CallbackContext callbackContext) {
        try {
            final String url = args.getString(0);
            final String cookieName = args.getString(1);

            cordova
                    .getThreadPool()
                    .execute(new Runnable() {
                        public void run() {
                            try {
                                //CookieManager cookieManager = CookieManager.getInstance();
                                //String str = cookieManager.getCookie(url);

                                XWalkCookieManager cookieManager = new XWalkCookieManager();
                                String str = cookieManager.getCookie(url);

                                if (str != null) {

                                    String[] cookies = str.split("; ");
                                    String cookieValue = "";

                                    for (int i = 0; i < cookies.length; i++) {
                                        if (cookies[i].contains(cookieName + "=")) {
                                            cookieValue = cookies[i].split("=")[1].trim();
                                            break;
                                        }
                                    }

                                    JSONObject json = null;

                                    if (cookieValue != "") {
                                        json = new JSONObject("{cookieValue:\"" + cookieValue + "\"}");
                                    }

                                    if (json != null) {
                                        PluginResult res = new PluginResult(PluginResult.Status.OK, json);
                                        callbackContext.sendPluginResult(res);
                                    }
                                    else {
                                        callbackContext.error("Cookie not found!");
                                    }
                                } else {
                                    callbackContext.error("Cookie not found for url! [" + url + "]");
                                }
                            }
                            catch (Exception e) {
                                callbackContext.error(e.getMessage());
                            }
                        }
                    });

            return true;
        }
        catch(JSONException e) {
            callbackContext.error("JSON parsing error");
        }

        return false;
    }

    /**
     * sets cookie value under given key
     * @param args
     * @param callbackContext
     * @return boolean
     */
    private boolean setCookie(JSONArray args, final CallbackContext callbackContext) {
        try {
            final String url = args.getString(0);
            final String cookieName = args.getString(1);
            final String cookieValue = args.getString(2);

            cordova
                    .getThreadPool()
                    .execute(new Runnable() {
                        public void run() {
                            try {
                                CookieManager cookieManager = CookieManager.getInstance();
                                cookieManager.setCookie(url, cookieName + "=" + cookieValue);

                                PluginResult res = new PluginResult(PluginResult.Status.OK, "Successfully added cookie");
                                callbackContext.sendPluginResult(res);
                            }
                            catch (Exception e) {
                                callbackContext.error(e.getMessage());
                            }
                        }
                    });

            return true;
        }
        catch(JSONException e) {
            callbackContext.error("JSON parsing error");
        }

        return false;
    }
}
