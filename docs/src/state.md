# State

_Note: not all state is using these patterns yet, it's a work in progress..._

There are multiple aspects of state to manage in the frontend:
1. state within an individual component (e.g. is a dialog open or not)
2. state that lives on the server (e.g. upcoming activities)
3. state that might be used across the application (e.g. logged in user)

State can be one or more of those things at the same time.

## State within an individual component

Here we simply use what vue provides using the [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html), preferring `<script setup>` definitions if possible.

## State that lives on the server

The most interesting state is on the server, and for that we are using [vue-query](https://github.com/DamianOsipiuk/vue-query) (which is build on top of [TanStack Query](https://tanstack.com/query)).

Some state from the server is queried each time we need it (not quite true, as there is caching...):
- messages
- activities
- offers
- ... most other things

For this we define queries in `<module>/queries.js` as vue composable functions (e.g. `useActivitiesList`), which themselves use vue-query composables. They take arguments which will become the parameters to the query, if they are passed as a `ref`, the query will rerun when the parameters change. Here's a simplified example:

```js
// "groupId" is a value, or ref, for a group id
const groupId = ref(1)

// "activities" is a ref to a list of activities for group 1
const { activities } = useActivityList({ groupId })

groupId.value = 2

// the same "activities" ref will now contain a list of activities for group 2 (after loading is complete)
```

The query layer maps between the components and the `api/*` files (API layer).

### API Layer

The API layer is just a thin wrapper over the basic HTTP calls to add:
- convert paramters to/from JavaScript/json values (e.g. `Date` objects)
- convert between camelCase (frontend) and underscore_case (backend)
- friendly methods with parameters
- making the correct calls to axios, and giving you the interesting data back

### The query layer

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

    // must unref for the fetcher function, as API layer doesn't deal with refs
    ({ pageParam }) => activityAPI.list({
      group: unref(groupId),
      cursor: pageParam, // don't forget to make use of the pageParam if using a paginated query
    }),
    {
      // only enabled when any required paramters are available
      enabled: computed(() => Boolean(unref(groupId))),

      // being clear it's relying on websockets ...
      staleTime: Infinity, // rely on websocket updates

      // as it's an infinite query, also need to define these
      getNextPageParam: page => extractCursor(page.next) || undefined,

      // This one is optional, as mostly not used
      getPreviousPageParam: page => extractCursor(page.previous) || undefined,

      // Our backend returns the data in the "results" entry, so we can fish it out here
      // The vue-query cache holds pages + pageParam data for infinite query, and this ensures the page data is just results
      select: ({ pages, pageParams }) => ({
        // For queries that return related data, this is a good place to mix that into the objects
        // See feedback queries for an example of that
        pages: pages.map(page => page.results),
        pageParams,
      }),
    },
  )
  return {
    // be sure to pass the rest of the query through, as lots of handy stuff on it...
    ...query,

    // nicely named flattened data (via helper), otherwise data is held in pages
    activities: flattenPaginatedData(query),
  }
}

```

## State that might be used across the application

Some of the state, from the server or elsewhere, we want to always have available, as it's used in many locations, this is:
- currently logged in user
- status information about unread messages, notifications, etc...
- list of public group info
- list of users which are also in groups the logged in user is part of
- list of places
- ... maybe some more?

For these things we define a `Service`. A `Service` is also accessed as a composable function, but you will always get the same one each time it's called, this means it will hold onto the state for us.  This is useful as we can also derive state, and hold onto that too.

Inside the service, it uses the same kind of queries as we use for the state we query each time. Here's a simplfied example:

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
