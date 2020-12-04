# composable data design document

This is a more abstract document to reflect on the design goals of the library. The [README](README.md) has the more walkthrough kind of approach for an actual user.

## Rationale for changes

We currently use vuex with a bunch of modules. We've used a mix of approaches for getting the data into components:
- vuex-connect at the "page" level, and props-down, events-up philosophy
- mapGetters/mapActions into the components themselves (when adding a vuex-connect wrapper seems a bit much)
- ... probably a little bit of usage of this.$store, although not much

Inside the modules we used a few patterns:
- enriching objects in the getters with related objects and calculated properties
- storing id -> object mappings to allow effecient getById
- using "function getters" to get individual items
- we wrap the actions with a layer that can extract status and various kinds of error states, to be exposed via getters
- minimising use of Vue.set in loops to batch updates (replace whole object instead)
- "maybeFetchSomething" actions, which check if something is already in the store, otherwise fetch
- an "initialState" function, that can be used to reset on logout
- various watchers to trigger actions to fetch related data when something changes (e.g. when changing group, fetch info again for new group)
- router plugin so we can define router actions to be called during routing
- triggering toasts and routing inside actions
- ... probably some more

There are various complications arriving from our current setup:
- the data layer is one of the hardest bits for new devs to understand
- hard to reason about the logic flow between vuex modules + watchers, and aaaaah... quite interconnected in hard to understand ways
- we kind of gave up on adding new frontend tests, partly because we can't use the store modules in isolation, and mocking them ALL would be overwhelming
- a feeling we recalculate data too much (e.g. one property in one object changes, and multiple list getters are re-run)
- a feeling we end up with some performance related issues due to our patterns
- our system for extracing status/errors is quite hard to use because the actions and getters are seperated
- not so happy using strings to define everything (actions/getters), would prefer imports and functions
- too much data-bureaucracy when more local data would be fine, but don't want multiple approaches for local vs global really
- ... probably some more stuff too

My feeling has been that vuex on it's own only covers a very small scope really, and our patterns of use that we layer on top of it have reached their limit, but vuex makes it quite hard to add higher level abstractions.

## Aspects to consider

Having explored our real-world usage of data, I came up with this aspects that any data management solution should at least consider, if not address itself. So easy to make a library that works for simple usage but gives up when the shit gets real!

- pagination
    - server pagination, using whatever scheme (limit/offset, before/after, cursors)
    - local pagination, to avoid rendering massive lists of fetched data if not displayed
    - (I include infinite scroll in "pagination" too)
- websocket updates
- filters
    - server filters, need to make new request
    - local filters, just filter the data we already have
- sorting
- pending/loading state
- validation errors
- network/server errors
- caching
- offline handling
- fetching dependent data
- enriching
  - with computed properties (only uses data already in the object)
  - with related data (has to refer to data stored elsewhere)
- server-side rendering (SSR)
- clearing data (e.g. on logout)
- refreshing data when coming back online, or back to the tab
- refreshing related data after performing an action
- loading data needed for routing logic
- injecting initial data into app
- ease of debugging
- optimistic updates
- performing UI/routing stuff when actions happen (e.g. toast, redirect, or close editing interface)
- orchestrating complex interactions of various bits of data (e.g. on login)
- handling single items that may or may not be part of a data collection

## Concept

- align with the new compositional philosophy from vue
- store reactive objects in the datastore, with computed properties (whatever can be "unwrapped" by vue)
    - minimise recalculating lists of data when related stuff changes
- make enrichment "first class", but pluggable, pass in function to the data library
- keep data fetching distinct from enrichment and local filtering
- push data management to compositional functions used within the components directly
    - local by default, cached by choice, global by necessity
    - use the same constructs whether local/cache/global
        - local connected to that local component only
        - cached connected to independently managed vue instance
        - global connected to root App instance, and use provide/inject used to make available in lower components
    - data modules should always be usable standalone, without direct references to global/cached data, always explicitly pass in dependent references
- reactive status (pending/errors/validation) objects that can be used flexibly
- create abstractions, so basic data behaviours of refreshing/clearing/pagination/etc can be handled by common code quite transparently
    - ... but also those made up composable elements themselves, so you can use it more flexibly if needed
    - ... but trying to keep all the weird complex vue knowledge I'm learning hidden from the higher level API where possible!
- consider writing as independent library
    - but probably a good idea to develop it inside the repo first, to get it to a usable/stable state without too much npm dancing...
- docs first!
    - our existing data layer has been one of the hardest things for people to learn, I guess we assumed because we use the standard vuex we don't need to document it ourselves. Vuex is actually simple enough, it's all these added complexities around it (that it does not address itself)
- websocket updates per data module, as close to API fetching code as possible
- try and engage vue community for input, feedback, maybe even collaboration and use...
- don't deal with offline stuff, leave that for service worker layer
- try and use incorporate upcoming vue patterns, e.g. error boundaries (error captured hook), suspense?
    - maybe switching some parts of the status object (validation errors? server errors?) to error boundaries + hooks
    - maybe have a <LoadingProgress> that uses some suspense stuff? or other way, to save having to many explicit status objects around...
- add multi-get API to backend, and fetch more related data on demand (batched... and with special stores to handle this)
- perhaps keep "list" data seperate from "related data"?
- maybe start implementing more backend endpoints that return their related data in the API response, but then instead of handling it directly, reuse the mechanism we already have for websocket updates
- still some unresolve things, maybe more specific to karrot:
    - how to handle complex thread logic (e.g. when it changes during a request...)
    - how to handle single data items that may or may not also be in a related collection
    - where to put all the "after login" logic
    - whether we can use this stuff easily in route handlers (is there a vue instance it can attach to?)
    - where to put routing stuff triggered in actions too?
    - is this whole thing even a good idea, or just a massive maintenance burden?
    - didn't yet handle consider the persistedstate (localstorage) bit... but we don't put so much stuff in there, I think there will be a simple way
    - how to handle full user info vs partial (user info) stuff?
