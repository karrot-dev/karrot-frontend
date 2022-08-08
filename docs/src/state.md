# State

_Note: not all state is using these patterns yet, it's a work in progress..._

## Types of state

There are multiple aspects of state to manage in the frontend:
1. state within an individual component (e.g. is a dialog open or not)
2. state that lives on the server (e.g. upcoming activities)
3. state that might be used across the application (e.g. logged in user)

State can be one or more of those things at the same time.

### State within an individual component

Here we simply use what vue provides using the [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html), preferring `<script setup>` definitions if possible.

So, in order of preference:
- `<script setup>` with Composition API (see https://vuejs.org/api/sfc-script-setup.html)
- Options API, using `setup()` function (see https://vuejs.org/api/composition-api-setup.html)
- Options API, using `data` / `computed` / and friends (see https://vuejs.org/api/options-state.html)

### State that lives on the server

The most interesting state is on the server, and for that we are using [vue-query](https://github.com/DamianOsipiuk/vue-query) (which is build on top of [TanStack Query](https://tanstack.com/query)).

Some state from the server is queried each time we need it (not quite true, as there is caching... but conceptually we are loading it each time):
- messages
- activities
- offers
- ... most things

For this we define queries in `<module>/queries.js` as vue composable functions
(e.g. `useActivitiesListQuery`), which themselves are composed of vue-query composables.

They take arguments which will become the parameters to the query, if they are passed as a `ref`,
the query will automatically rerun when the parameters change.

Here's a simplified example:

```js
// "groupId" is a value, or ref, for a group id
const groupId = ref(1)

// "activities" is a ref to a list of activities for group 1
const { activities } = useActivityListQuery({ groupId })

groupId.value = 2

// the same "activities" ref will now contain a list of activities for group 2 (after loading is complete)
```

The queries layer sits between a component and the API layer (the files in `<module>/api/*`).

#### API Layer

The API layer is just a thin wrapper over the basic HTTP calls to add:
- conversion of parameters to/from JavaScript/JSON values (e.g. `Date` objects)
- conversation between `camelCase` (frontend) and `underscore_case` (backend)
- friendly methods with parameters (e.g. `activitiesAPI.get(id)`)
- making the correct calls to axios, and giving you the interesting data back

#### The query layer

The query layer is where vue-query comes in, and helps us with:
- deciding when to run the queries (when data is needed, when parameters change)
- caching data, either where multiple components want the same data, or the user is leaving/returning to the same page
- allowing us to update the client state via websockets
- keeping track of the status of the requests (e.g. for loading indicators)

The queries should:
- accept parameters either as refs or as plain values (can use `unref` when passing to API layer)
- define an `enabled` option with a computed value, to ensure it only runs when it has valid parameters
- return a meaningful name for the `query.data` value
- for paginated queries, return a flattened version too
- be clear how it should be cached/refreshed, e.g. websockets, and use `cacheTime`, `staleTime` options sensibly...
- define query keys as exportable functions, that support partial use
- be named with `Query` suffix if return a `Query` object (and `Mutation` suffix for `Mutation` return values)

Example showing all of the above:

```js
// Query keys that can be used elsewhere to update/invalidate/access cache
export const queryKeys = {
  // .filter(Boolean) so if used without groupId, can refer to all queries under ['activities', 'list'] key
  activityList: groupId => ['activities', 'list', groupId].filter(Boolean),
}

export function useActivityListQuery ({ groupId }) {
  const query = useInfiniteQuery(

    // pass refs directly into queryKey, as vue-query handles unrefing (reactivity would not work otherwise)
    queryKeys.activityList(groupId),

    ({ pageParam }) => activityAPI.list({
      // must unref for the fetcher function, as API layer doesn't deal with refs
      group: unref(groupId),

      // don't forget to make use of the pageParam if using a paginated query
      cursor: pageParam,
    }),
    {
      // only enabled when any required parameters are available
      enabled: computed(() => Boolean(unref(groupId))),

      // by default staleTime is 0, which means it'll refetch every time...
      // ... if there is cached data though, it'll use the cached data, and refetch in the background
      // being clear it's relying on websockets ...
      staleTime: Infinity, // rely on websocket updates

      // in some places we might not even want to cache the data at all
      // by default it is 5 minutes
      // cacheTime: 0,

      // as it's an infinite query, also need to define these
      // (important to specifically return undefined, rather than null/false/etc)
      getNextPageParam: page => extractCursor(page.next) || undefined,

      // ... I'm not sure we will be using previous param, so can probably leave this one out...
      getPreviousPageParam: page => extractCursor(page.previous) || undefined,

      // For paginated data our backend returns the data in the "results" field,
      // so we can fish it out here
      // For non-paginated queries the vue-query cache just holds the value returned by the API directly
      // For paginated queries it holds an object with 2 fields: "pages" and "pageParams"
      // a "pageParam" is what we would call a "cursor"
      // Each of those is an array, e.g.
      // {
      //   pages: [
      //     [{ id: 1 }, { id: 2 }, { id: 3 }, ...], // first page of results
      //     [{ id: 11 }, { id: 12 }, { id: 13 }, ...], // second page of results
      //   ],
      //   pageParams: [
      //     null, // the first page has no cursor value
      //     'somecursorvalue',
      //   ]
      // }
      // As we have already extracted the "next"/"previous" values above,
      // here we can just pick out the "results" from the response data.
      select: ({ pages, pageParams }) => ({
        // For queries that return related data alongside the main data
        // this is a good place to mix that into the objects
        // See feedback queries for an example of that
        pages: pages.map(page => page.results),
        pageParams,
      }),
    },
  )
  return {
    // be sure to pass the rest of the query through, as lots of handy stuff on it...
    // it's designed to be destructured, so this is fine to just spread it into our return value
    ...query,

    // nicely named flattened data (via helper), otherwise data is held in pages
    activities: flattenPaginatedData(query),

    // ... if it wasn't paginated data, we could just do this
    // activities: query.data,
  }
}

```

### State that might be used across the application

Some of the state, from the server or elsewhere, we want to always have available,
as it's used in many locations, this is:
- currently logged in user
- status information about unread messages, notifications, etc...
- list of public group info
- list of users which are also in groups the logged in user is part of
- list of places
- ... maybe some more?

For these things we define a `Service`. A `Service` is also accessed as a composable function,
but you will always get the same one each time it's called,
this means it can hold onto the state for us.

This is useful as we can also derive state, and hold onto that too.

Inside the service, it uses the same kind of queries as we use for the state we query each time.

Here's a simplified example:

```js

// "defineService" is a simple function that stores whatever the function returns and returns that on subsequent calls
export const useUserService = defineService(() => {
  const { users } = useUserListQuery() // this would be defined elsewhere

  function getUserById (userId) {
    // we are usually dealing with refs, so need the `.value` here
    return users.value.find(user => user.id === userId)
  }

  return {
    // exposes a function that can be used anywhere around the app to get a user given a userId
    getUserById,
  }
})
```

It's similar to using pinia with a setup function (see https://pinia.vuejs.org/core-concepts/#setup-stores), except we don't do anything fancy with the return value.

Elsewhere this service might be used like this:

```js
const { getUserById } = useUserService()

// assume our "activity" has a participants array, which is an array of user ids
// we can turn those into user objects
const participants = activity.participants.map(getUserById)

// in reality our activity might be a ref, and to keep it reactive to changes in the underlying users, we define a computed value
const participants = computed(() => activity.value.participants.map(getUserById))
```

The services don't have to contain any server data, or use queries, that is only one pattern.

Patterns for services:
- always return refs if returning state from a service, to allow destructuring
- functions that get something should start with `get` (e.g. `getIsLoggedIn` would be a function you call to get the value)
- computed/ref values should not have `get` prefix (e.g. `isLoggedIn` would be a computed/ref to a boolean value)

## Rich state

Previously we used vuex getters to combine state from various places to form _rich_ data, that had it's related data embedded into it.
These were called `enrichers`.

That led to various tricky issues:
- it caused a lot of uneeded calculations, if one item in a list changed, they would all have to be recalculated
- ... which in list rendering meant each component thought it was getting a fresh object, even if nothing had actually changed
- ... this caused _a lot_ of slowdown
- it was not always clear whether you were dealing with a plain object, or an enriched one

Previously, it was hard to access the _rich_ state any other way, but with the composable paradigm, we can!

The new way is to use _helpers_ to calculate what you need close to where you are going to render it.
The helpers are define in composable functions, so can access whatever other state they need to do their job.

Helpers are last in the chain of state, so nothing higher up should use them, only components, or other helpers. That chain being:
- queries - _cannot refer to any of the things below_
- services - _can refer to queries and other services_
- helpers - _can refer to queries, services and other helpers_
- components - _can refer to any of the things above_

Sometimes it might not be clear whether to define something in a service, or in a helper.
Services are about holding important state strongly relating to that module, and as little as as possible.
A helper should not hold state, and is more about useful tools for helping rendering stuff that can be reused across components.

All data (e.g. an `activity`, an `offer`, a `user`) should be in its plain form in all places now,
so no surprises. If the field is not part of the server API response, it's not in the object.

_Note: it's a work in progress... (as much else in this document)_

## Changing state

### Mutations

Mutations are for when you want to modify server state.
They are provided by vue-query and keep track of the status of the request, and any errors that occurred.

They are usually quite simple, and can be loaded quite close to where they are called.
No more passing events miles up the chain, and drilling props miles down again.

### State held in a service

For some state held inside a service, you can either:
- return a function that will modify the state (preferred)
- return a ref that can directly be modified

Example:

```js
export const useDoorService = defineService(() => {
  const isOpen = ref(false)

  function open () {
    isOpen.value = true
  }

  function close () {
    isOpen.value = false
  }

  return {
    // a readonly copy of the state of the door
    isOpen: readonly(isOpen),

    // methods to open/close the door
    open,
    close,
  }
})
```

Which could be used:

```html
<template>
  <div v-if="isOpen">
    door is open
    <button @click="close()">close</button>
  </div>
  <div v-else>
    door is closed
    <button @click="open()">open</button>
  </div>
</template>
<script setup>
const {
  isOpen,
  open,
  close,
} = useDoorService()
</script>
```
