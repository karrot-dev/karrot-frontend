# Alerts

We distinguish between banners and toasts.

## Banners
Banners are alerts that are potentially shown for a long period of time. For instance, a banner could remind the user to sign an agreement which does not have a deadline.

Banners are shown at the top of the screen, right below the navigation bar.

To create a new banner, first add a new method to the `BannerUI` Vue component:

```js
newBanner (context) {
  return {
    color: 'some_color',
    icon: 'some_icon',
    message: 'SOME.MESSAGE',
    actions: [
      {
         label: this.$t('SOME.ACTION'),
         handler: () => {
           doSomething()
         },
      },
    ],
  }
}
```

Then add it to the list of banners in the `banners` vuex store:

```js
if (newBannerShouldBeShown) {
  banners.push({
    type: 'newBanner',
    context: someContext
  })
}
```

Note that `type` has to equal the name of the method created in the first step, and `someContext` will be passed to it as a parameter.
The flag `newBannerShouldBeShown` controls when the banner should be displayed.

## Toasts
Toasts are alerts that are shown only for a very short period of time or that require immediate interaction. Typical examples are simple sucess or error alerts.

A toast is displayed at the bottom of the screen. If it is not closed manually (by clicking the default close button), it disappears automatically after a couple of seconds.

To show a toast, simply trigger the `toasts/show` action:

```js
dispatch('toasts/show', {
  message: 'SOME.MESSAGE',
  messageParams: { param: value },
  config: { type: 'someType' },
}, { root: true })
```

Both `messageParams`and `config` are optional.
