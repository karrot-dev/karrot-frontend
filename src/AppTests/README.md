# AppTests

This are for doing tests of the WHOLE application (at least from `App` component), including the routing, layout, etc...

A few points:
- you can only have ONE test per file
  - in theory there could be more, but it's *really* hard to reset everything between them, I failed with wierd vue errors, maybe one day it JustWorks&trade;
- we only mock the backend for these, see `test/mockBackend` for more
- they are slower, but very comprehensive tests

## Tips

If the output diff is not showing you enough you can use:

```shell
DEBUG_PRINT_LIMIT=100000 yarn test src/AppTests/yourAppTest.spec.js
```
