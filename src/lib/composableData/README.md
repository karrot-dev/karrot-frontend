# compostable data (working name!)

This is a way of using the new compositional philosophy in vue to manage data.

### Show me, don't tell me!

OK! A simple example might look like this:

```js
const city = ref('Belgrade')
const { people } = usePeople({ city })
```

#### What's going on here then?

`ref` is a new vue thing to express a _reactive variable_ ([docs](https://composition-api.vuejs.org/api.html#ref)). You can access it's underlying value with `city.value` or `unref(city)`.

`usePeople` would be defined elsewhere in our code, built using some of the composable elements the libary defines. We'll come to that later. It accepts parameters that will be used when fetching the value. In this case the _city_, passed in as a ref, so it can notice changes.

`usePeople` returns various things, one of them is `people`, which is an array `ref` containing a list of _people_ objects.

#### But where would I put that code?

In the new `setup()` function inside a vue component ([docs](https://composition-api.vuejs.org/api.html#setup)), so, like this:

```vue
<template>
  <ul>
    <li v-for="person in people">
      {{ person.name }}
    </li>
  </ul>
</template>
<script>
export default {
  setup () {
    const city = ref('Belgrade')
    const { people } = usePeople({ city })
    return {
      people
    }
  }
}
</script>
```

Notice that although the `people` variable is still a ref (so need `people.value` or `unref(people)` to get to the array), in the template (and I think in the rest of the code too? check!) you don't need to do that, it is automatically available directly ([docs](https://composition-api.vuejs.org/api.html#ref)).

This is called _unwrapping_ and there are some subleties that might come up later, it's worth keeping an awareness of what is in your variable, a `ref`, a `reactive object`, a plain value... something else?

#### Hang on, what is a reactive object compared to a ref?

Yes! There are a couple of concepts you probably need to know to get into this, I will just direct you to the [composition API summary](https://composition-api.vuejs.org/#summary) and the [reactivity APIs](https://composition-api.vuejs.org/api.html#reactivity-apis) docs. I suggest to have a play around to get the feel for them.

#### So, onward! What was the usePerson thing again?

Oh yeah! Let's look at how the definition for that might look...

```js
import { useCollection } from './somewhere/as/yet/unknown'
import api from './whereever/you/define/your/api/functions'

export function usePeople ({ city }) {
  const { collection: people, update } = useCollection({ city }, fetcher)

  async function fetcher ({ city }, { isValid }) {
    if (city) {
      const people = await api.listPeopleForCity(city)
      if (isValid()) {
        update(people)
      }
    }
  }
  return {
    people
  }
}
```

Oh no, another abstraction! `useCollection` is actually the highest level (i.e. simplest to use) function provided by this library.

It can work with two arguments (there is a third we come to later).

The first argument is an object containing the parameters that are needed when fetching the data (e.g. via an HTTP API call). In this case our `city` ref. The values in the object can be plain values, refs, reactive objects, etc... the whole object could be passed as a reactive object too (though not implemented yet I think).

The second argument is a `fetcher function`. The library will call this when it wants some data. But it's up to you to define how to get that data. It might be one of the ideas I stole from [swrv](https://github.com/Kong/swrv). You might wonder when the library will decide it wants data, but we'll come to that later.

So, onto the **fetcher function**. It is passed two arguments:

The first argument is an object with the parameter values. Maybe you're wondering why we can't use them directly as we already have access to the `city` variable from above? What is different about these ones? Well, here they will always be _unwrapped_ to plain values. No thinking about `.value` or `unref()`. Arguably this actually makes it _more_ complicated to think about, so perhaps it should be changed, and not pass them... let's see. What do you think dear reader?

The second argument is a kind of utility object with various useful things in it (perhaps!), here we are making use of an `isValid` helper, that we can call to see if our API results are still valid (i.e. our API paramters have not subsequently changed during the request, thus invalidating our response data).

Our implementation of the fetcher can check if we have the `city` set, then request data from our hypothetical api, checks it's still valid, and calls our mysterious `update()` function (that came from the `useCollection()` call).

So, the `update()` function now. This takes an array of data, and updates the values in the collection! That's it.

The call to `useCollection()` also gave as a `collection` value (which we destructured into a `people` variable) that contains our array of people. Our `usePeople()` function then returns this `people` array for the application to use as above.

#### Phew!

Ok, that was nice, a lot of new concepts perhaps. And the mystery just deepened, what is this `useCollection()`?

Maybe take a breather and get a cup of tea, a little walk outside perhaps. Let's take this one step at a time!

### A jump into some more complete examples

So, if you looked at the stuff in [DESIGN.md](DESIGN.md) you'll see what I covered above barely scratches the surface of a data library. I don't have time right now to explain everything in the detail above, but will just paste some examples/concepts/ideas below about how it might work.

#### Activities

Here's a common a real one for karrot...

```vue
// ActivityList.vue

<template>
  <LoadingProgress :status="status">
    <ul>
      <li v-for="activity in upcomingActivities">
        <ActivityInfo :activity="activity"/>
      </li>
    </ul>
  </LoadingProgress>
</template>
<script>
export default {
  setup () {
    const { activities, status } = useCached(
      'groupActivities',
      () => {
        const { getUser } = useGlobalUsers()
        const { authUserId } = useAuthUser()
        const { currentGroupId } = useCurrentGroup()
        const { enrichActivity } = useEnrichedActivities({ authUserId, getUser })
        return useActivities({ groupId: currentGroupId }, enrichActivity)
      }
    )
    const { upcomingActivities } = useActivityFilters({ activities })
    return {
      upcomingActivities,
      status,
    }
  }
}
</script>
```

```vue
// ActivityInfo.vue

<template>
  <div>
    {{ activity.description }}
    <button v-if="activity.joined" @click="leave(activity.id)">leave</button>
    <button v-else @click="join(activity.id)">join</button>
    <SpinnyThing :status="[joinStatus, leaveStatus]">
  </div>
</template>
<script>
export default {
  setup () {
    const { join, leave, joinStatus, leaveStatus } = useActivityActions()
    return {
      join,
      joinStatus,
      leave,
      leaveStatus
    }
  }
}
</script>
```

Some points:
- it shows how `useCached()` just wraps `useActivities()`, requires care to _not_ to pass things from the outer scope that are not global...
- some `use*` things are global (global users, auth user, and current group) - so attached to the App instance, and then provide/injected into lower components
- some `use*` things are local (activities), but that might be used cached
- ... this distinction between local and global should be made clear somehow...
- these things that they return (e.g. `authUserId`, `currentGroupId`) are `refs` so can be watched and used as parameters in data fetchers such that they update accordingly
- the `use*` functions only take what they need as parameters, e.g. `useActivities` only takes the `groupId` parameter, it doesn't need to know about anything else
- there is a second argument in `useActivities()` to pass an **enrich function** into it, it's _just a function_, and it keeps knowledge of the related data away from the data fetching module
- seperate "modules" are there to create the enrichment function (as it needs to know the auth user id, and a way to get users from...)
- the `getUser()` function comes from a kind of "related data" module, that can fetch on demand, in a batched way
- the activity filters are seperated into YAM (yet another module), here they take a ref to a list of already enriched activities (as the filtering is often on enriched properties)
- the most verbose bit (`useActivities()`) could be put elsewhere to, and exported as `useCachedActivities()` so other components can use it, this is the spirit of the compositional approach!
- ... infact the whole thing could be extracted so that you just call `useActivityData()` or something and get all the stuff you need!
- the actions are kept separate from the data, and don't require any other related things
    - they give you the status objects directly (avoiding the convoluted route to getting status we have with vuex now)

#### Conversations

This is one of the most complicated bits of data we manage currently.

This uses lower level compositional functions (`useFetcher()`, `useCursorPagination()`), and doesn't make use of `useCollection()`, it might be it could (if pagination support were added to `useCollection()` directly), _or_ if not it's an example that the library allows more flexible compostional usage of the component parts (`useCollection()` uses `useFetcher()`, which we use directly here), for when it gets more complex, whilst keeping the usage of it quite simple in the component.

```vue
// GroupWall.vue

<template>
  <SomeWallThing :messages="messages" @more="fetchMore"/>
</template>
<script>
export default {
  setup () {
    const { currentGroupId } = useCurrentGroup()
    const {
      conversation,
      messages,
      status,
      fetchMore,
      fetchMoreStatus,
      canFetchMore,
    } = useConversation({ groupId: currentGroupId })
    return {
      conversation,
      messages,
      status,
      fetchMore,
      fetchMoreStatus,
      canFetchMore
    }
  }
}
</script>
```

This bit below is actually working code and can power the group wall with pretty much no changes to our existing components.

```js
// useConversations.js

export function useConversation (params) {
  permitCachedUsage()
  if (Object.keys(params).length !== 1) throw new Error('Please pass in exactly one param for finding conversation')

  const conversationRef = ref(null)
  const messagesRef = ref([])

  const conversationId = computed(() => {
    // Either use the param we passed in...
    if (params.conversationId) return unref(params.conversationId)
    // Or the id from the actual fetched conversation
    const conversation = unref(conversationRef)
    return conversation && conversation.id
  })

  function fetchConversation ({ groupId, conversationId }) {
    if (groupId) return groupsAPI.conversation(groupId)
    if (conversationId) return conversationsAPI.get(conversationId)
    throw new Error('No params for getting conversation!')
  }

  const { status: conversationStatus } = useFetcher(params, {
    async fetcher ({ conversationId, groupId }, { isValid }) {
      if (groupId || conversationId) {
        const result = await fetchConversation({ groupId, conversationId })
        if (isValid()) {
          conversationRef.value = result
        }
      }
    },
    onInvalidate () {
      conversationRef.value = null
    },
  })

  // nice idea but not so simple as we don't have the right pagination ref to then continue...
  // arguably we can't either... maybe better without cursor pagination, but timestamp based pagination?
  // onCacheUnmounted(() => {
  //   invalidatePagination()
  //   messagesRef.value.length = 10
  // })

  const { status } = useFetcher({ conversationId }, {
    async fetcher ({ conversationId }, { isValid }) {
      if (conversationId) {
        const { results, next } = await messagesAPI.list(conversationId)
        if (isValid()) {
          setCursor(next)
          updateMessages(results)
        }
      }
    },
    onInvalidate () {
      messagesRef.value = []
      invalidatePagination()
    },
  })

  const {
    moreStatus,
    fetchMore,
    canFetchMore,
    setCursor,
    invalidatePagination,
  } = useCursorPagination({
    async fetcher (cursor, { isValid }) {
      const { results, next } = await messagesAPI.listMore(cursor)
      if (isValid()) {
        setCursor(next)
        updateMessages(results)
      }
    },
  })

  function updateMessages (newMessages) {
    messagesRef.value = insertSorted(messagesRef.value, newMessages)
  }

  const { on } = useEvents()

  on('conversations:conversation', updatedConversation => {
    const conversation = unref(conversationRef)
    if (conversation.id === updatedConversation.id) {
      conversationRef.value = updatedConversation
    }
  })

  on('conversations:message', message => {
    const conversation = unref(conversationRef)
    if (message.conversation === conversation.id && (!message.thread || message.thread === message.id)) {
      // Only main thread messages... I guess we'd have a useThread for the threads...?
      updateMessages([message])
    }
  })

  return {
    conversation: conversationRef,
    conversationStatus,
    messages: messagesRef,
    status,
    fetchMore,
    fetchMoreStatus: moreStatus,
    canFetchMore,
  }
}

```
