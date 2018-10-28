# Frontend structure

## Modules and directories

The Karrot frontend is composed of modules. Each module should follow this directory structure:


```
src/
  <module-name>/
    - routes.js                 # routes for this app
    - assets/                   # mostly for images used in this module
      - apple.png
    - api/                      # XHR communication, to backend and other services
      - pickup.js
      - pickup.spec.js          # unit test
      - ...
    - datastore/                # vuex namespaced modules and plugins
      - pickup.js
      - pickup.spec.js          # unit test 
      - ...
    - components/               # reusable components (atoms, molecules, organism)
      - PickupUser.vue
      - PickupUser.spec.js      # unit test
      - Pickups.story.js        # storybook story
      - ...
    - pages/                    # page templates and instances
      - PickupsManage.vue       # page connected with mapGetters and mapActions
      - PickupsManageUI.vue     # or with vuex-connect
      - ...
```

The modules `base` and `utils` stand out as they don't focus on one area.
`base` contains all bits that could be considered the core of Karrot, while `utils` are helpers that can be reused in other modules.
They should be kept as small as possible, so consider creating a new module before adding to them.
