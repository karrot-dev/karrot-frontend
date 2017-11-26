# Pages and Routes

Pages are the views of the app, each of them is defined in a route object. It carries some important data:

```js
{
  name: 'groupPreview',
  path: '/groupPreview/:groupPreviewId',
  meta: {
    // custom properties like data loading and breadcrumb definitions
  },
  components: {
    default: GroupInfo,
  },
},
```

## Loading data on page load

Quite often, you will find that a page needs data from the API to show something meaningful. We use a declarative approach to do this. By specifying a vuex action `beforeEnter` properties on the route `meta` object, the action will run before the page loads.

The action gets the route `params` object passed as first argument. In the example below, you can use the `groupPreviewId` in the action.

```js
{
  name: 'groupPreview',
  path: '/groupPreview/:groupPreviewId',
  meta: {
    beforeEnter: 'groups/selectPreview',
    afterLeave: 'groups/clearGroupInfo',
  },
  components: {
    default: GroupInfo,
  },
},
```

The `beforeEnter` action gets `await`ed, so it's guaranteed to complete before the page loads. Still, better make everything reactive anyways.

If you have nested routes, the actions of the parent will run before the child ones. To pass data from parent to child (e.g. selected group), you can use the vuex state. All actions get the complete route `params` object.

### Show a route error page

If the `beforeEnter` action determines that the route can't be accesses (e.g. because of invalid IDs in the URL), it can throw a special `routeError` to show an error page.

You can pass a message to the user along with the error:

```js
if (hasError) {
  throw createRouteError({ translation: 'NOT_FOUND.EXPLANATION' })
}
```

## Clean up after yourself when leaving a page

Similar to `beforeEnter`, you specify an `afterLeave` property on the `meta` object. That makes it possible to clear form errors that should not persist page reloads.

```js
{
  name: 'groupPreview',
  path: '/groupPreview/:groupPreviewId',
  meta: {
    afterLeave: 'groups/clearGroupInfo',
  },
  components: {
    default: GroupInfo,
  },
},
```
