# Forms

Forms and validation is quite a complex topic! This just covers a few topics for now.

Our approach for forms is to clone an _editing_ version of the data for use in the form. This allows us to:
- know if the value of the data has changed (`diff(source, edit)`)
- reset the form (`edit = source`)
- emit the diff of changes in a `@save` event (`emit(diff(source, edit))`) (works nicely with http `PATCH`)
- handle underlying changes in the source value as we wish

In many places we enrich the data with additional fields,
and we need to use the original data (available as `__unenriched`) to correctly only detect changes in the
underlying value, not the derived data.

## formMixin and statusMixin

This logic is encapsulated in `formMixin` and `statusMixin`, so you get these features with just:

```js
export default {
  mixins: [formMixin, statusMixin],
}
```

They require additional props to the component:

- `formMixin` requires `value`: the object you are editing, which must have an `__enriched` field
- `statusMixin` requires `status` from the meta module

## Request status and server validation errors

Request status and server validation errors are handled using the `meta` module.
We store meta for each combination of action and id (optional), the underlying state looks like this:

```js
{
  byAction: {
    create: {
      pending: false,
      validationErrors: {}
    }
  },
  byId: {
    323: {
      save: {
        pending: false,
        validationErrors: {
          name: ['must be unique']
        }
      }
    }
  }
}
```

There is only 1 meta getter which you use like this:

```js
// for an action without an id
getters['meta/status']('create')

// for an action with an id
getters['meta/status']('save', id)
```

It will always return a value, by default it will be:

```js
{
  pending: false,
  validationErrors: {}
}
```

There is one action, `clear`, which has the same signature:

```js
// for an action without an id
dispatch('meta/clear', ['create'])

// for an action with an id
dispatch('meta/clear',['save', id])
```

### Using meta in Vuex modules

#### Overview

```js
import { createMetaModule, withMeta } from '@/store/helpers'

export const modules = { meta: createMetaModule() }

export const actions = {

  // This wraps the actions so we catch pending status and validation errors
  ...withMeta({

    // If `entry` has an `id` field, we use that
    async save ({ commit }, entry) {
     // ... do stuff ...
    },

    // The argument is a number, we use that as the `id`
    async join ({ commit }, id) {
     // ... do stuff ...
    },

    // No argument, so it is stored by action name
    async list ({ commit }) {
      // ... do stuff ...
    },

  })
}
```

#### Getters

When you use it in a Vuex module there are two places to put it:
- in the `enrich` method, you can add meta by id for any interesting actions, your enrich method might like like this:

```js
import { metaStatusesWithId } from '@/store/helpers'

export const getters = {
  // ... other getters ...
  enrich: (state, getters) => entry => {
    return entry && {
      ...entry,
      // this will add `saveStatus`, `joinStatus`, and `leaveStatus`
      ...metaStatusesWithId(getters, ['save', 'join', 'leave'], entry.id),
      __unenriched: entry,
      // ... other enriched fields ...
    }
  }
}
```

- as it's own getter for actions without an id, which might look like this:

```js
import { metaStatuses } from '@/store/helpers'

export const getters = {
  // ... other getters ...
  // this will add a `createStatus` getter
  ...metaStatuses(['create']),
}
```

The convention is to name the fields `<actionName>Status`,
e.g. the status about a `save` action would be available as `saveStatus` or the `join` action as `joinStatus`
