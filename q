[33mcommit 7584a075b9b4dcd2d98331163fab0dd53b201714[m[33m ([m[1;36mHEAD -> [m[1;32mclear-entries[m[33m)[m
Author: djahnie <djahnie@disroot.org>
Date:   Mon Aug 20 17:13:45 2018 +0200

    clear applications from state after leaving groupGallery

[33mcommit 1831610517ee3d7247c33df53999da8405f6eb42[m[33m ([m[1;31morigin/master[m[33m, [m[1;31morigin/HEAD[m[33m, [m[1;32mmaster[m[33m)[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Aug 18 11:45:16 2018 +0200

    fix test

[33mcommit 51e2d97858d33cee8bdcbcb5cbbb738f90a5aad3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Aug 18 11:30:11 2018 +0200

    try to load current group when entering profile page

[33mcommit bd86fe584218a8a8550458be6824b8cbed5d2289[m
Author: Janina Abels <djahnie@disroot.org>
Date:   Thu Aug 16 22:15:53 2018 +0200

    exchange info and warning colors (#1081)
    
    * exchange info and warning colors
    
    * update storyshots

[33mcommit a6ec208c0052814f2d886ec9ed4dbb4beda51397[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 7 20:48:11 2018 +0200

    Properly transpile quasar and reconnecting-websocket
    
    Closes #1080

[33mcommit 7471ece751e5eb90df16c0abdaaba062d0eeb7ed[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 7 11:59:52 2018 +0200

    prevent joinGroupAfterSignup for non-open groups

[33mcommit 778ac5030423ac00e8ffd3053b41491f39fc4704[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 7 11:57:42 2018 +0200

    move translation help to top

[33mcommit 3aa0065e20270eb4ee2931e0eee6b6bcd27429c3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 7 11:39:52 2018 +0200

    update locales

[33mcommit 02b47603e77c598f0080a834757f52fb03786ca8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Aug 6 19:44:41 2018 +0200

    fix group map overlay button on chrome

[33mcommit 8ec15450c55fbc49d9722f1202f2fb1cb811d3b9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Aug 6 19:03:43 2018 +0200

    update contributor list

[33mcommit 618e84d4159bebc2bc8c3c94ddcfd2835fa750de[m
Author: Janina Abels <djahnie@disroot.org>
Date:   Mon Aug 6 18:25:15 2018 +0200

    Add group applications (#1063)
    
    Related to #894

[33mcommit f72d9e8d6440665b21f8033ff5d51cd8eefa50dc[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Aug 4 11:24:14 2018 +0200

    Rework build env (#1078)
    
    * move env-utils into config.js
    
    * clean up env globals
    
    everything is now directly defined inside webpack.config.js, except for the shared backend and proxy configuration
    
    Introducing `__ENV` global to replace `process.env` (because the are not the same)
    
    RAVEN_CONFIG was moved into Circleci
    
    * fix logging out in app
    
    * improve updateAvailable
    
    inline GIT_SHA1
    add delay to toast
    do not show in dev
    
    * bind vue to window.vueRoot in development
    
    * include appEnv in hardSource configHash, disable hardSource in production
    
    It didn't generate correct output when switching BACKEND for cordova
    
    * update dependencies
    
    * add back symlink
    
    * include statics in build
    
    * fix command
    
    * really fix command
    
    * update snapshots

[33mcommit 88afe1ced05cbe8cafce6c3bb67236642dbb097b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 3 23:40:23 2018 +0200

    improve markRead behavior
    
    main change is to mark as read when the user has scrolled down

[33mcommit 5ef9b94d151e11298c0bb76b51e120c50905ed6a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 3 12:40:12 2018 +0200

    close detail when opening groupsGallery

[33mcommit 1a946d373a8671ed3a3ed019d305e2ccfacfe76e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 3 12:18:07 2018 +0200

    prevent wall autofocus on mobile, rename to WallConversation

[33mcommit 252ed57b3aa2cd7e12651bcc47d442c5c600a3a4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 3 11:04:31 2018 +0200

    update locales

[33mcommit 453db2ea588bcdeb8103c1bfcae0015cf635edba[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Aug 2 00:32:42 2018 +0200

    Use relative asset paths for Cordova
    
    Closes #1076
    
    As cordova uses a different root path (usually something like
    file:///android_assets or similar on other devices), absolute asset
    paths are not found. We keep absolute paths for the web, but use
    relative paths for cordova.

[33mcommit 1f75335d2fce678349c6c3bfe010858037f3ce57[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Jul 30 22:36:20 2018 +0200

    Build webpack assets into /assets (#1075)
    
    * Serve all webpack hashed assets under /assets path
    
    * Fix url-loader paths for dev vs prod
    
    Not really sure why, just making stuff work... :/

[33mcommit 850961a030859f1d7b4b5c7a8890e51210fc8819[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 30 18:30:50 2018 +0200

    Fix checkbox rendering and clean up build config (#1074)
    
    * fix checkbox rendering and clean up build files even more
    
    process.env.THEME was missing, but quasar it depending on it
    
    * remove unneeded iconset import

[33mcommit 06c33138010e3d3bc77f0dc4a85869dd63382403[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Jul 30 15:31:02 2018 +0200

    New sidebar (#1071)
    
    * Remove commented out storybook config
    
    * A few tidy up things
    
    * Add sidebar, free map from it's box
    
    * Make sidenav boxes less intensely poo-y
    
    * Implement mobile sidebar
    
    * Update snapshots
    
    * Narrower desktop sidebar on smaller screens
    
    * Include map link on mobile menu
    
    * Remove mobile footer
    
    * Update storyshots
    
    * Change sidenav menu titles
    
    * Only show active stores by default
    
    * Use toggle to show/hide all stores
    
    * Add sidenav menu titles to i18n
    
    * Remove group navbar
    
    As everything is in the sidenav now
    
    * Removed unused style section
    
    * Rationalize sidenav names a bit
    
    * Simplify sidenav, remove store navbar
    
    * Add locale select and community feed to m sidenav
    
    * Unify mobile/desktop menus more
    
    * Move mobile sidenav file, pass groupId params
    
    * Pass groupId into more routes
    
    * Minor changes after review
    
    * Remove unused import
    
    * Add changelog entry

[33mcommit bb42a4cca5f26266558dbcba978c006dc834c730[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Jul 30 15:30:19 2018 +0200

    Add hello-developer console.log thing (#1073)

[33mcommit 85538cd261b91595a14c15b4598d68d94f4440a9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 29 18:48:54 2018 +0200

    add changelog

[33mcommit 973da27d59bd2c2335b3e9d6587206d182a42227[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 29 16:36:01 2018 +0200

    allow internal links and highlight external links
    
    handle emails and phone number links as well

[33mcommit 01d8118324d6e565f53d537d20725182b520d8e2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 29 15:16:49 2018 +0200

    make footer links open in new tab

[33mcommit a6725bbcc3b1d3c95f3288d6694c2744dd20b97f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 29 11:55:06 2018 +0200

    improve communityFeed on mobile
    
    fix image source url in cordova app
    improve layout for small screens

[33mcommit 4f4b4d89bf75fdd16039cecf0b0b4db208b371b4[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Jul 29 00:18:23 2018 +0200

    Fix building storybook

[33mcommit 4e021ceaf76fb94b6b98eeeed716d311761328c3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Jul 28 18:22:00 2018 +0200

    Upgrade to webpack 4, babel 7, etc.. (#1069)
    
    * WIP: switching all the stuff
    
    * More fiddling about
    
    * Tests work!!
    
    * Cleanup
    
    * More cleanup
    
    * Fiddle with options
    
    * Update storyshots
    
    * Remove deprecated css options
    
    * Use router in test mounts
    
    * Update storyshots
    
    * Get quasar tree shaking working
    
    * Use compression for local server
    
    * Minor fiddle with service worker script
    
    * Set minChunks
    
    * Remove nonsense file
    
    * Add back linter to webpack config
    
    * Removed unused webpack config
    
    * A bit more cleanup and webpack cache thing
    
    * More webpack fiddling
    
    * Fiddle fiddle fiddle
    
    * Make build script clean dist and build all
    
    * Clean before cordova scripts
    
    * Cleanup dependencies
    
    * Fixup storybook
    
    * Update some netlify configuration
    
    * Always use strings for netlify env

[33mcommit 7064aca435b3b83c6f25127093280775808b8c5b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 27 19:05:00 2018 +0200

    set some min-height for textareas

[33mcommit e300b25de799e983908b8450cb6c723f8e6626fa[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 27 19:03:39 2018 +0200

    Add origin header for ws requests
    
    New channels2 backend is unhappy otherwise

[33mcommit 1a4fd1cb89caf3fab077363d9b7b50ea434910db[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 27 18:51:13 2018 +0200

    update snapshots

[33mcommit e5663be5703059448a6a3b6a01bc47470f82d96f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 27 18:50:16 2018 +0200

    update quasar and fix some style
    
    unfortunately, min-rows on textarea does not exist anymore (probably since some time already), but setting "rows" also does not work...

[33mcommit 2f081a416b75437966f3b5d9a1a5d731e0d14269[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 27 18:25:22 2018 +0200

    add missing router to test defaults

[33mcommit 70b0b1041c6ecc00755c06ab1772bfeb8299872d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 27 18:24:52 2018 +0200

    fix footer in dev deployment

[33mcommit 88ccafd56c29dc3db2efc57b0df7cb461d8f1a33[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 27 14:49:39 2018 +0200

    add tx push helper

[33mcommit 0d83e03b12c7ef25f13d7be1af9d0faaa897f284[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 27 14:47:08 2018 +0200

    update french locale

[33mcommit 386fd186063aa42a8973e3e16f5f172b15dc8146[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 27 13:56:47 2018 +0200

    Remove another comment

[33mcommit 99fbebed717546e5bb5e71ad5c5ec315acc65319[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 27 13:55:34 2018 +0200

    Remove commented out code

[33mcommit 7ce57d9754e666cc137590b0f44de4f5dcb8cd15[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 27 13:51:33 2018 +0200

    Add roadmap.md generator and updated roadmap

[33mcommit e9347ed04bde6de986a714cf8a27c4a041234c01[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Jul 26 18:05:32 2018 +0200

    Fix chat sidebar width

[33mcommit edffef5dd4f541f7c959e0b7949f44b171fad920[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 25 22:04:11 2018 +0200

    big snapshot change after quasar upgrade

[33mcommit fc39c09ae65fd1e8739e3dfc074229d426feb0a4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 25 21:52:24 2018 +0200

    upgrade circleci node image

[33mcommit eafda14f3e9ca15278692492c5d59b0a80908413[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 25 20:15:53 2018 +0200

    update locales

[33mcommit a064b1f99a729597e50e4861bab6f89133c092f6[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jul 25 19:58:31 2018 +0200

    Add notifications about new topics in community.foodsaving.world (#1067)

[33mcommit 98dcd643ab820e77b56de0a198cf8de3fdcc5914[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 25 19:42:44 2018 +0200

    upgrade dependencies

[33mcommit c20b7fc4fbb63e724389cf0013b39fb3ad8bcfb5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 25 16:56:56 2018 +0200

    update dependencies

[33mcommit b44e8935f9d46561099b213e434dd846726629a5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 25 13:44:13 2018 +0200

    upgrade uglifyjs-webpack-plugin

[33mcommit 4a374b86c140a844a25e57bdfc470e74ae89bbf2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jul 24 13:08:30 2018 +0200

    fix store websocket update
    
    would query by whole group object instead of just the id

[33mcommit 2d0f64d0439360a18302a57d4c10faced86113b7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jul 24 12:48:21 2018 +0200

    Switch to new django_filters range syntax

[33mcommit 128e73595998f011d0fc571b8a24392fcd962a41[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 21 18:30:01 2018 +0200

    allow logout without serviceWorker support
    
    Can happen on old devices or in private browsing mode

[33mcommit 4c84bbbf9f9284be28a249637afb99fb715f0121[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 21 00:18:40 2018 +0200

    fix test

[33mcommit c1bae91e4c1158eb02ea77641fdf8f7d21bf7707[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 20 23:56:23 2018 +0200

    mark messages as read when opening thread

[33mcommit 784a64bc9b457a793eb6167bd796d0ca2b8fcf3e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 20 23:55:46 2018 +0200

    highlight thread if user has unread messages

[33mcommit fbd324b8299736435aa6c495899d1d4eafc12360[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 20 23:05:57 2018 +0200

    update locales

[33mcommit 4e9a21bb38ffa345828479927794278fab3b5f7b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 20 20:41:17 2018 +0200

    update storyshots

[33mcommit b5f3829f51cd16295d3028d7467682fa2f7bd9a3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 20 20:40:21 2018 +0200

    mobile wall improvements

[33mcommit 8043b69465fb4ab3bb4e3f4a2c0f55e6a3b4a867[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 20 19:50:38 2018 +0200

    shrink unread message bar

[33mcommit e95faa933db06e7c9f241faf798bee4c1103d462[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 20 19:17:13 2018 +0200

    fix unread status

[33mcommit fc4387d57f0f80c636bccedac09e979e87509e40[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 20 19:01:14 2018 +0200

    clear send errors

[33mcommit 978fd7949a58d6037ce71483a4451becf5bf6d28[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 20 18:29:50 2018 +0200

    add some changelog entries

[33mcommit e48c565d1c0a0c126fe5ca9a20f9354a6ea8d668[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Jul 20 18:23:30 2018 +0200

    Conversation Threads (#1065)
    
    * refactor chatconversation
    
    * VWIP threaded messages
    
    * try to catch up with Nick
    
    * prevent markdown preview in sidebar
    
    * refactor pagination
    
    * handle pagination and scrolling
    
    * fix thread message unread status
    
    * hide some buttons
    
    * add mobile view
    
    * clearing and refreshing
    
    * add thread muting
    
    * improve design
    
    * fix tests
    
    * remove unused code
    
    * fix pluralization
    
    * remove unused properties
    
    * remove unused styles

[33mcommit 80e658f563f6d9e53293b8db2cfe45c27d8f3cb7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Jul 18 18:50:22 2018 +0200

    Use shared config for serve script

[33mcommit 1561aa4f56e0d26d2f2483a723e966e8d9e9137f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 18 09:49:32 2018 +0200

    prevent markdown preview in sidebar

[33mcommit cfd012db06655fce69c4375b25849db21b9a04b8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jul 17 14:15:59 2018 +0200

    rename message key

[33mcommit 46bebb8218556b07eefbee5396c1382c9b5c09f0[m
Author: pogopaule <pogopaule@users.noreply.github.com>
Date:   Tue Jul 17 14:15:18 2018 +0200

    711 show distance between user and a store (#1020)
    
    * add route button to pickups view
    
    * add logic that generates route url
    
    * add locales for STOREDETAIL.ROUTE
    
    * use store's coordinates instead of its address
    
    If the user sets the stores location via the embedded map the store has
      coordinates but no address, but if the user sets the store's
      address it also has coordinates. So using coordinates is the
      safer option.
    
    * move route URL creation to function
    
    preparation to create os and mobile aware routes
    
    * open native apps for directions for android ans ios
    
    * don't use browser geolocation for mobiles
    
    the native navigation apps can access the current location easier
    
    * remove translations
    
    * refactor and simplify

[33mcommit a4ff80f2214535cb3a7c75d3a1e160240d0dab69[m[33m ([m[1;33mtag: v5.0.0[m[33m)[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 16 16:39:44 2018 +0200

    prepare Release 5, add pull request template

[33mcommit 882bacaca28d48d4d8484ec82c9a3a45782ef705[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Jul 16 16:29:19 2018 +0200

    Add routing tests (#1064)
    
    * An initial routing tests
    
    * Remove unused groups module mock
    
    * Fix uneeded changes

[33mcommit 038b9ee4e92bda769e56fdf429736d154f4349f1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 16 00:05:37 2018 +0200

    fix rendering of feedback with weight 0

[33mcommit c703f2ebfe4dd272bf8325e5fd7c80b1797a1cc3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 15 23:48:45 2018 +0200

    update locales

[33mcommit 530add78cda0036d856990187bdba30b4010caae[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 15 20:13:04 2018 +0200

    update storyshots

[33mcommit 13a5a6b2b2f51ab518fa0421b6696ed0dbbcb894[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 15 17:28:29 2018 +0200

    replace link to facebook group with discourse

[33mcommit a4421f43ed1f04607009eecb57e80b958bc64d5f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 15 17:19:09 2018 +0200

    add markdown input to wall

[33mcommit a5c566f8a756e3ddd4938d9e9c69ee7c5d3cdefc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 15 15:40:07 2018 +0200

    enable markdown support for feedback comment

[33mcommit c51d8272e83a64b35a74294dd015c21a09759c1b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 14 19:20:37 2018 +0200

    Add backend badges to frontend readme

[33mcommit a66252e91b358bac2bc4d6a543b3737799c4ae6d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 13 18:39:47 2018 +0200

    Fix to support case insensitive filesystems
    
    Otherwise when asked to require('./app') they cannot distinguish
    between app.js and App.vue

[33mcommit fa1b495f2de0373dcb54c6a6720315ae4def2506[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jul 10 12:41:58 2018 +0200

    hotfix: feedback and history didn't load sometimes

[33mcommit 2568553295d8b97be9bb1294c5519df8751168ea[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jul 10 12:20:35 2018 +0200

    lockfile updates

[33mcommit 97af92eca8b5366b5f06a90b977e0a05974b0355[m
Author: Janina Abels <djahnie@disroot.org>
Date:   Sun Jul 8 23:15:26 2018 +0200

    change phrasing in readme

[33mcommit abf4d0c1939d4878b1302653dbae80dad94dcbd8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 8 13:00:40 2018 +0200

    remove duplicate ideas

[33mcommit 02b65eb807ba23103b77722d53b413e8769738ff[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 8 12:40:08 2018 +0200

    make Readme screenshots look fancy

[33mcommit addb86d2b6ab85a214c1762856e4be648acd0323[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 8 11:49:03 2018 +0200

    more contributors per line

[33mcommit 1bcea68f237a567c9b08cb5c2a02e8b5217ca8e6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 8 06:58:41 2018 +0200

    rework readme

[33mcommit 6c5c35c0013f0805c916ee3d7883995505a452dd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 8 01:20:58 2018 +0200

    update dependencies

[33mcommit 3fed2677b01ece2f5cfa2e95ae8cc096f3868296[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 8 01:07:25 2018 +0200

    fix tests, move refresh-all into store

[33mcommit d404b52dcde803b50e02b605d3ecbe8ac710b683[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 8 00:13:38 2018 +0200

    add update notification for cordova app
    
    Quasar should be loaded before all dependent code, therefore we split the app into a separate js file.

[33mcommit 651819e6e152601d18d4d0b52dbcd3d57d286d69[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 7 15:27:02 2018 +0200

    send git sha to sentry
    
    if `release` is undefined, it doesn't get sent to sentry

[33mcommit 0954a29b3ac6780fd866911503b3b402e619310b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 7 13:14:12 2018 +0200

    update locales

[33mcommit b05327022119ec361b66e19c4ec4de12d9ba5f60[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 7 13:13:20 2018 +0200

    mark user active only every 10 minutes

[33mcommit 7991792890eab4428c5d0f3f0860eb23864d07c9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 7 13:07:29 2018 +0200

    add shortcut to join another group

[33mcommit 24d917119915d167a6244a0bb997637e9a74ee98[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jul 7 12:26:40 2018 +0200

    Fix and enhance store feedback statistics (#1061)
    
    * fix pagination in store feedback list
    
    * fix data loading race condition
    
    * fix and extend feedback statistics
    
    * fix tests

[33mcommit 3803fb916fff9e35b99f44541956e51dbd6f5152[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jul 4 21:31:18 2018 +0200

    PickupListItem: Fixed bug where empty slot was shown for full pickups (#1060)

[33mcommit 66e72f267f8821324e2cde8c8aa46dd14c7f8ae0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jul 3 21:29:14 2018 +0200

    update locales

[33mcommit 5ea81c39b95a542099c276c974b5e719e10a2671[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 30 13:17:49 2018 +0200

    allow data to be null
    
    prevents errors

[33mcommit 5db40f7c41e89c796ebbf7754bb5b84b572654f6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 30 13:09:17 2018 +0200

    fix open user conversation on mobile, fix redirect to #

[33mcommit 8bc4908322761372fed4ea5b2ec343af7c2b1e3b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 1 22:42:29 2018 +0200

    Update CHANGELOG.md

[33mcommit f39888418247c45b7e784546620de53941f24e59[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Jun 30 13:27:14 2018 +0200

    Add browser push notifications (#1057)
    
    * Add browser push notifications
    
    * Please the linting god
    
    * Pass FCM_SENDER_ID to build
    
    * Remove unneeded webpack config
    
    * Revert newline change
    
    * Make awful code better
    
    * Fixup FCM_SENDER_ID circleci config
    
    * Use consistent variable style
    
    * Actually read FCM_SENDER_ID from env
    
    * Obliterate extraneous apostrophe
    
    * Minor style changes
    
    * Reduce the number of tiny js files
    
    * Turn off performance mode

[33mcommit e48e858e234ec9ff21132dfe145bb9448f3dfaa3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Jun 30 13:20:25 2018 +0200

    Reduce the number of tiny js files (#1059)

[33mcommit 1cc223e375c13fec8a54f819d806c56d73ea4e4e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 29 21:15:34 2018 +0200

    update locales

[33mcommit d7463aea7d428d8cf4318cd220e154be37614487[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 29 20:54:53 2018 +0200

    fix CI

[33mcommit f495f1ca7904877810ea53f6ac98b059ad291278[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 29 14:35:35 2018 +0200

    Fix UnsupportedBrowser warning in app, use built-in quasar feature
    
    Closes #1023

[33mcommit 3f0e3a9cb13767e20addc8a1e3f2f3c269181af8[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Jun 28 19:26:54 2018 +0200

    minimize CI time for non-master branches (#1056)

[33mcommit 48175cad6cd0dd8c4baa4804ee25301840f8735e[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Jun 28 19:26:40 2018 +0200

    Conversation improvements and other fixes (#1055)
    
    * make sure detail drawer stays open when it has a conversation
    
    * improve detail toolbar
    
    * clear conversations on logout
    
    * fix some bugs
    
    * fix big feedback set weight button in chrome
    
    * prevent validation flicker
    
    * detail ui fixes

[33mcommit 2ef4271e03e8f3f9e41fe97197945bfdedd63dd8[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Jun 28 19:26:24 2018 +0200

    Add sorting and search to user list (#1053)
    
    Closes https://github.com/yunity/karrot-frontend/issues/1028

[33mcommit a22f9dddc12fb49058cf07e2541af16263b7e2b3[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Jun 28 18:59:42 2018 +0200

    show failed email deliveries (#1051)

[33mcommit 8bfd5bda20bd6c35b73054c1733ddec485708163[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Jun 28 14:15:12 2018 +0200

    Add user conversations (#1054)
    
    * remove conversations.createdAt
    
    * sort by ID instead of date
    
    * add user conversation in sidebar
    
    * add mobile support
    
    * prevent loading of conversation with self
    
    * switch back to createdAt comparison because there's no need to change
    
    and we don't know for sure if IDs are monotonically increasing
    
    * always redirect on self conversation, use state for id checks

[33mcommit 3157606b9edad35e854513755bd5c01f7776ec09[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 27 20:37:36 2018 +0200

    fix button

[33mcommit c1f71bf04daf27bbb28f7b641cc2ff35df5d11ec[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jun 27 19:20:49 2018 +0200

    Improve group map (#1052)
    
    * WIP: click on map to add store
    
    * add map controls to fullscreen map
    
    Closes https://github.com/yunity/karrot-frontend/issues/902
    
    * collect marker definitions in one place
    
    * show groups on groupmap
    
    * remove old maker icon before creating a new one
    
    fixes the bug of having shadow on top of shadow
    
    * make createStore a context menu
    
    * add back button
    
    * fix tests

[33mcommit 095ffdbd381515b3670ee82872427dd187aeb668[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 27 19:11:06 2018 +0200

    fix feedback behavior without weight given

[33mcommit 8475c8efb138c2993ddbf5d2d795b2db140ed52a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Jun 27 15:35:55 2018 +0100

    Data loading tweaks (#1049)
    
    Data loading tweaks

[33mcommit 42a111461ecfc0c0130ac5859f4085d9675c59e9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 26 15:12:15 2018 +0200

    make non-submit splash icons white
    
    secondary color doesn't play well with primary background

[33mcommit 7d7381814faab4f55e65c2b1224e07c7f944c278[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 26 15:06:11 2018 +0200

    use different marker icon in gallery map for not-joined groups

[33mcommit 280364f9eb55a7f426ac39aa1b0c48516980c538[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 26 15:03:04 2018 +0200

    Avoid leaflet error of "loading infinite tiles"
    
    It was a spurious error and I didn't understand the mechanics well enough, but it seems like the `center` value becomes undefined during some transitions.
    
    This change seems to help, so I'll go for it.

[33mcommit 02cb0bb01e46d4815a1267a2c1229ec16ff690af[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 26 12:02:27 2018 +0200

    prevent routeError if no groupId is present

[33mcommit bbc7a9409271687e1fbf3bb59af04f09a3a31287[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 25 19:43:45 2018 +0200

    reduce size of marker shadow

[33mcommit 82d028ebb09480e8ef734ff926b63ac9334e7058[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 25 18:58:09 2018 +0200

    enable jump to email section

[33mcommit 9ed2fdc2ed85112df5c46ff53def9bfd6ba19be2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 25 19:15:48 2018 +0200

    Revert "enable jump to email section"
    
    This reverts commit 1d69f6211aa13e2b6777b16d323a12f103b7f070.

[33mcommit 9625cf350314543e235dbc8eba9c1ebda54d0afb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 25 19:14:33 2018 +0200

    Revert "show failed email deliveries"
    
    This reverts commit 10ebaac3b838d4aa40ca7c380dda90c3142484cf.

[33mcommit 10ebaac3b838d4aa40ca7c380dda90c3142484cf[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 25 19:10:17 2018 +0200

    show failed email deliveries

[33mcommit 1d69f6211aa13e2b6777b16d323a12f103b7f070[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 25 18:58:09 2018 +0200

    enable jump to email section

[33mcommit 2ad6c8428d5dcb7d4af1164dd2540e674fed0d2e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jun 24 09:18:41 2018 +0200

    prevent RandomArtRootSVG from being displayed

[33mcommit 9fc73e186c0134dd52eb4949e8a92b893812dc9a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 23 21:57:15 2018 +0200

    fix stray color definition

[33mcommit ec7828a673c8cfd84a76077fd14378824e092339[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 23 21:56:52 2018 +0200

    set minimal zoom level to prevent "earth-view"

[33mcommit 3bcb97b57bf95a5975a28124692fbc6c0515be1f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 23 21:56:02 2018 +0200

    always provide valid zoom level to Leaflet

[33mcommit d9f536ee75f838f049016755a3bcc644f684042b[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jun 23 20:48:14 2018 +0200

    Slightly unify color usage (#1048)
    
    * remove unused component
    
    * reduce footer size, improve style
    
    * implement custom leaflet marker icons
    
    The old ones only had a predefined set of colors which didn't match the Quasar colors.
    
    * replace unfitting usage of $positive with $secondary
    
    * unify green markers & icons
    
    * remove $tertiary where inappropriate
    
    * improve mobile bottom navbar
    
    * prevent empty space at bottom
    
    * update snapshots

[33mcommit 0fe64c7798946db29c37f4ecbb2415251505e66d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jun 22 23:53:49 2018 +0100

    Fix reaction tooltips

[33mcommit ae963b8485f7a3b55b498069ae63e1eeb9d42af3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jun 22 23:51:44 2018 +0100

    Fix RandomArt background when in above mode

[33mcommit 35c9c86fd95ccdcb13de4ea1cbf4686e6b1218d8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 22 19:44:58 2018 +0200

    fix e2e tests

[33mcommit f187079127cdb2e4ec1cb9ed8587d21de7d35903[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jun 22 16:59:53 2018 +0100

    Fix mobile keyboard detection 'til Quasar is fixed (#1045)
    
    See https://github.com/quasarframework/quasar/pull/2199

[33mcommit 6191cda1e4da6104e3b43e87fb6e4d9e6e887328[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jun 22 15:59:24 2018 +0100

    WIP: Performance improvements (#1042)
    
    Performance improvements

[33mcommit 2a15aa2379fd6e78d9eeff97c107861cb80a72e7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 22 15:54:36 2018 +0200

    wait until data is fetched before resolving routeEnter

[33mcommit ce8954c27f200303f841207adaaa9f42c15945e2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 22 15:12:18 2018 +0200

    keep mute_conversation url query
    
    This should fix muting of pickup conversations

[33mcommit 5acae9e46ab3c6dc17f7f3e9eeb888a5f9e1e51e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 22 14:59:14 2018 +0200

    slightly unify route property order

[33mcommit 18ee98e9a37f56f901142125319a1deb1a798815[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 22 14:57:07 2018 +0200

    fix missing space before SI unit

[33mcommit 48f35031152d7d187b474d037dba5b85932a9580[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 22 14:54:37 2018 +0200

    prevent annoying warning when changing routes

[33mcommit b0458c830de22bd54fe39babbd2ccb63e581d263[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 22 14:52:56 2018 +0200

    throw RouteRedirect instead of router.push

[33mcommit 1adf85130a1f7c21d05668c065e4095459339b4e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 22 14:36:29 2018 +0200

    fix routing bug
    
    reverse() caused side effects

[33mcommit b79e7f240af3e685836826977ec4e6dfadbc164e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jun 22 00:57:00 2018 +0100

    Add pickup conversations (#1037)
    
    * Initial work on pickup conversations
    
    * Fixup right drawer footer layout
    
    * Preserve scroll position in side conversation
    
    * Fixup scroll position when loading more messages
    
    * Set pickup detail sidebar state from store
    
    * Handle side conversation if user leaves pickup
    
    * Autofocus conversation compose, and other tweaks
    
    * Minor wording/spacing tweaks
    
    * Remove console.log statements
    
    * Make store pickup list have pickup conversations
    
    * Add read marking to side conversation
    
    * Remove erroneously committed file
    
    * Implement infinite scroll for side conversation
    
    * Add mobile pickup detail and rename a component
    
    * Add desktop route redirecting
    
    * Remove unneeded import
    
    * Handle case when conversation is not loaded yet
    
    * Redirect from pickup mobile pickup conversation
    
    * Pickup chat link/ui tweaks
    
    * Add pickup word into i18n
    
    * Fix pickup link handling
    
    * Add "Open Chat" to i18n
    
    * Use vuex-connect for Detail component
    
    * Update snapshots
    
    * Fix conversation tests
    
    * Fix conversation reaction reactivity
    
    * Fix to use correct event
    
    * Fix trailing spaces
    
    * Fix reactivty issue
    
    * Update storyshots
    
    * Add DetailUI tests
    
    * Use new test helpers
    
    * Fix most usages of Vue.nextTick in tests
    
    The remaining one breaks it for some reason I could not work out
    
    * add back fetchConversation, prevent marking of undefined conversation
    
    * fix editing
    
    * make pickup conversation a bit more chat-like
    
    plus, rename light-paragraph to text-weight-light - I missed this one when upgrading quasar
    
    * refactor notificationtoggle, enable in detailUI
    
    * clean up a bit
    
    * only mark read if there are unread messages

[33mcommit f4fb275867862b062e6a02b82a74b6dad296ef6a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 20 20:34:17 2018 +0200

    update snapshots

[33mcommit 96c32cb318379df6f11e3c1748af6e427e38bebf[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 20 19:03:55 2018 +0200

    clean up some global css

[33mcommit d4b03914cf43614d328479bdb04b547019d77d31[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 20 18:25:43 2018 +0200

    update snapshots

[33mcommit 738eca47faa5e566670a58c7eb5d1f821fb4a33a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 20 18:25:34 2018 +0200

    fix icon on group settings page

[33mcommit 92197bd30278675cdc70d937181279becc5e1137[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 20 18:25:10 2018 +0200

    add email verification warning to group settings

[33mcommit c8c5433b31fc18322b0aac387155f72e31f1c97b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 20 15:25:57 2018 +0200

    prevent built-in refresh pull of mobile chrome

[33mcommit e0e49f16fa30018f73c9027e5f4d774b2712843d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 20 15:20:38 2018 +0200

    update locales

[33mcommit 00ad8092aa362762d1873f0c70fa6ad8e75a0b7a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 20 15:17:21 2018 +0200

    enable Quasar I18n

[33mcommit 5e1515dc84e14dbf3159bf4ea4d1e4c476edcd45[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 20 14:05:00 2018 +0200

    add pull-to-refresh to group wall

[33mcommit 1dc8fa3aa3da9e7ef55ab7eb495c28a871b7fc46[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 19 20:11:44 2018 +0200

    Refresh more data when app wakes up
    
    New:
    - conversations and messages
    - currentGroup details
    - auth user details
    - feedback
    
    Fixed:
    - history (wouldn't refresh anything before)

[33mcommit 9975b072bfacb961d07a93b1e16af8804144e68f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 19 17:21:34 2018 +0200

    remove space before comma on user profile page

[33mcommit 242cf9bdb2a087dd2c857b3e54444fb6ecb6338e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 19 16:50:11 2018 +0200

    improve search
    
    - use "clearable" prop instead of extra close button
    - use integrated debounce
    - hide also if not empty
    - show group name below store (needs enriching store.group)
    - show "my groups" in results with special color
    - fix fontawesome icons

[33mcommit a83a1e35718e1b94870d82b9415b39056d4076b1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 19 16:09:28 2018 +0200

    fix some more fontawesome icons

[33mcommit d057a8262d068e7e5c59c2c92a78565d18245c17[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 19 15:04:05 2018 +0200

    redirect to groupPreview if user is not a member

[33mcommit dc1939ee85b80e611e4a0b73d7f6d4fdd4a16749[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 19 12:16:27 2018 +0200

    use :loading instead of :value for loader btn

[33mcommit 7875e8c0326f30c0416672178e4cafdffdfccd83[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 19 12:09:31 2018 +0200

    remove "more options" tooltip because it looks like a menu
    
    A new user was confused by it yesterday and the tooltip doesn't seem to add much information anyways.

[33mcommit 4a4d561ceb4bcd7d9f462e30158bf0275fb2ba6c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 19 12:04:04 2018 +0200

    prevent selection of '?' in deleted user picture

[33mcommit 1a5f5fac9e97ecd417d63fc8db4094add1670fbf[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 19 11:51:26 2018 +0200

    use throttle instead of debounce for warning

[33mcommit d0aea5a747b36fc59f85e1511ae43d74cc0ed34a[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jun 19 11:32:12 2018 +0200

    2018 06 fix and refactor (#1040)
    
    * resolve some sentry messages
    
    * ignore ResizeObserver loop limit error
    
    * refactor PickupList
    
    * resolve some more sentry errors
    
    * prevent some more undefined property access
    
    * Do not refresh data after verify if not logged in
    
    Fixes https://sentry.io/foodsaving-worldwide/karrot/issues/513031124
    
    * Add missing parameter while refreshing
    
    Fixes https://sentry.io/foodsaving-worldwide/karrot/issues/507018436

[33mcommit 82bf5dcc1547c0c56adf8c9bae44ff810c9316a0[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jun 17 22:23:36 2018 +0200

    Basic message editing (#1039)
    
    * basic editing
    
    * show if messages was updated

[33mcommit acecc33ac7c8b501c2f0abb4e09a226170b32004[m
Author: Ananya Agrawal <33188930+ananya-agrawal@users.noreply.github.com>
Date:   Sat Jun 16 17:30:43 2018 +0530

    Allow to give feedback without entering weight (#996)
    
    * weight defined as Null as default
    
    * updated storyshots
    
    * WIP: feedback form revamp
    
    * WIP: some stuff
    
    * fix warning

[33mcommit 5b1ebf6a4b9f1883a793d84f5259607515f6c2ef[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Jun 15 15:41:04 2018 +0200

    2018 06 deps upgrade (#1036)
    
    * WIP upgrade
    
    * use stubs from test-utils
    
    * delay infinite scroll retry if it can't load more
    
    * fix wrong usage of toast message
    
    * dep update
    
    * upgrade vue2-leaflet
    
    * downgrade clone-deep
    
    * upgrade android build image
    
    * upgrade cordova-android
    
    * update android instructions
    
    * use better gradle caching
    
    * restore cordova-android 6.4
    
    cordova-universal-links-plugin isn't compatible with cordova 7
    
    https://github.com/nordnet/cordova-universal-links-plugin/issues/133

[33mcommit fb73b7f170f7776bcd751375a6fbe1ce6ca0cc17[m
Author: mike-ap <michael.apicelli@gmail.com>
Date:   Sat Jun 9 14:20:53 2018 -0400

    add lang global attribute on locale change (#1034)
    
    * add lang global attribute on locale change
    
    * inline set language tag in store plugin

[33mcommit a624b97bbd96eacba0804c310c001f433ab89bf8[m
Author: Thiago Mendes <trmendes@users.noreply.github.com>
Date:   Mon Jun 4 18:27:54 2018 -0300

    Add support to BR Portuguese (#1031)
    
    * Translate Karrot Frontend to Brazilian Portuguese
    
    * Update locale-pt_BR.json
    
    fix typo
    Duplicated comma at the end of the line
    
    * locale: pt-BR
    
    Better messages
    Fix typo
    Fix missing {
    
    * translation: add support to brazilian portuguese
    
    * Use pt-br for compatibility with Django
    
    Also, offer pt locale for other users that understand Portuguese
    
    * Use bcp47 instead of ISO format
    
    Transifex uses ISO, Django uses bcp47
    
    * Mock all locale stuff for storyshots
    
    * Support country-specific locale detection

[33mcommit bbc3822baee13c6505eb03b138b3937bebcc77ea[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 4 12:56:02 2018 +0200

    update locales

[33mcommit e61452f70c3d6adf490e5b1d8d7ce13b886e8b68[m
Author: Aleksander Pentchev <alek.pentchev@gmail.com>
Date:   Mon Jun 4 12:42:58 2018 +0200

    #968 bug redirect on user settings save (#1032)
    
    * #968 Disable redirect on user settings save
    
    Dispatch an action without pushing a route.
    
    * #968 - refactor save method; added messages
    
    Dispatch backgroundSave with await
    Added Notify message from using Quasar
    Enclosed the messages in try/catch block to handle potential request errors.
    
    * #968 - refactor - replace Notify with Toasts
    
    Replaced Notidy Quasar component with Toasts abstraction.
    
    * Added translations for new messages.
    
    Added translations for messages: settings saved and an error occured.
    
    * User settings notifications are translatable
    
    Added reference to the i18n package to make notifications translatable.

[33mcommit b9abe1df8047b40addfef9233373ee2b532aad06[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon May 28 17:42:21 2018 +0200

    Revert "Translate Karrot Frontend to Brazilian Portuguese (#1019)" (#1030)
    
    This reverts commit 93137adefb901bc60590c190bc67b7981fba3559.

[33mcommit 93137adefb901bc60590c190bc67b7981fba3559[m
Author: Thiago Mendes <trmendes@users.noreply.github.com>
Date:   Mon May 28 12:36:15 2018 -0300

    Translate Karrot Frontend to Brazilian Portuguese (#1019)
    
    * Translate Karrot Frontend to Brazilian Portuguese
    
    * Update locale-pt_BR.json
    
    fix typo
    Duplicated comma at the end of the line

[33mcommit c7f278b519bb63f2565ce4bc8d77444992063338[m
Author: pogopaule <pogopaule@users.noreply.github.com>
Date:   Mon May 21 14:57:35 2018 +0200

    fix #863 add map to store page on mobile (#1017)

[33mcommit dbb3313b4a6d2fd1dc47010959f85c0b66fbf422[m
Author: pogopaule <pogopaule@users.noreply.github.com>
Date:   Sat May 12 11:38:15 2018 +0200

    980 icon of deleted user is clickable (#1016)
    
    * fix #980
    
    check if user id is present, don't rely solely on object check
    
    * extend storybook for ProfilePicture
    
    Add story where an empty user is passed to a ProfilePicture.
    This represents the case of a deleted user.
    
    * use alternative conditional structure
    
    Use if/if-else/else structure instead of if/if/if.
    This also removes empty comments in the DOM.
    
    * improve layout of a delete user's profile picture
    
    - center ? vertically and horizontal
    - set size of ? relative to size property
    
    * show profile picture in storybook
    
    if isLink is set to true (default) there is a vue error
    
    * update storybook spec
    
    changes introduced by:
    - layout update of delted user's profile picture
    - setting isLink to false in ProfilePicture storybook

[33mcommit 6a76a4a89edd2461198083476addb8f05c31aa9c[m
Author: neha <iec2015048@iiita.ac.in>
Date:   Wed May 9 18:25:12 2018 +0530

    email and password buttons disabled. (#1000)
    
    * email and password buttons disabled
    
    * edit so has function return boolean values
    
    * changes updated
    
    * snapshot updated
    
    * Button disabled if old and new passwords are same
    
    * syntax changed
    
    * check for unverifiedEmail

[33mcommit e23e7622a0cb11f5702adcfd3a6bc769fbc10275[m
Author: Peter K. Shultz <pshultz@umich.edu>
Date:   Wed May 9 08:37:16 2018 -0400

    Add alert for outdated browsers (#1005)
    
    * Attempted edit button
    
    * Modify components for adding outdated browser warning
    
    * Add browser-detect functionality for outdated browsers
    
    * Add specific browsers and version numbers
    
    * Remove unused dependencies
    
    * Revert "Attempted edit button"
    
    This reverts commit 68419c4cca987d1182b0499885f42a486099b71d.
    
    * Remove unused modal for pull request
    
    * Update package.json
    
    * Remove detectBrowser references; change from alert to HTML
    
    * Remove package-lock.json
    
    * Make link open in new window; add noopener
    
    * Add strings for translation support
    
    * refactor & improve warning
    
    - move into component
    - leave page in usable state even if browser is outdated
    
    * add warning if js is disabled
    
    * fix style

[33mcommit 4b994a1e02512967aac09a9b72f991c32b9e9427[m
Author: pogopaule <pogopaule@users.noreply.github.com>
Date:   Wed May 9 12:35:40 2018 +0200

    improve history layout for for pickups with many participants (#1014)
    
    * improve history layout for for pickups with many participants
    
    - introduce component HistoryProfilePictures
    - show ProfilePicture if # of participants is 1
    - show # of participants if it is > 1
    
    * update snapshots specs

[33mcommit 3b4f327874e229e8e78ed0773652b53b755a5c5e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed May 9 11:05:08 2018 +0200

    Add sparkpost docs (#1015)
    
    * Add sparkpost docs
    
    * Add link to inbound MX records and namecheap

[33mcommit 1a18069187fc3d3fe33b851ea15a257f48ab6a17[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 17 18:33:16 2018 +0200

    update German locale

[33mcommit 6718866a631aa1f10bdae78d9e9f0b6d006048da[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Tue Apr 17 16:54:58 2018 +0200

    Rename notifications to notifications.md (#1010)

[33mcommit 64b844cc3c78082e9f2f8950ceab4dae4f7dfdb2[m
Merge: 17bd7756 f4ee9a94
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Tue Apr 17 15:53:42 2018 +0200

    Merge pull request #1008 from yunity/document-notifications
    
    Document notifications

[33mcommit f4ee9a9456ae1543ab4af6d810c5974396cdc93f[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Tue Apr 17 15:47:34 2018 +0200

    Style changes to notifications.md

[33mcommit 17bd7756f6bbe406abc20e6a9e9e74fc027ffe5f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 17 15:46:20 2018 +0200

    update locales

[33mcommit 57bb79a5a684b5a02e9df445ac21aa9ea3ed36c0[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Apr 17 15:40:47 2018 +0200

    Improve Quasar & Fontawesome upgrade (#1009)
    
    Closes #1006
    
    - Use prefix explicitly
    - Fix some broken icons
    - use prefix in quasar `icon` attributes
    - Improve some design bits
    
    Note: some fontawesome icons have been improved since 5.0.1 (e.g. `fa-smile`), but quasar-extras hasn't been upgraded yet. Waiting for https://github.com/quasarframework/quasar-extras/pull/14 to be merged.
    
    * improve fontawesome upgrade v1
    
    Closes #1006
    
    * add prefix to all fontawesome icons
    
    * design fixes & snapshot updates
    
    * add test for group leave toast

[33mcommit e8173e76602250d5b012678762bde601ac4b3eac[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Tue Apr 17 14:01:15 2018 +0200

    Update mobile.md (#1002)

[33mcommit 4d2813d944284ed76db4f51fd79e4a61a6836f45[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Mon Apr 16 22:04:52 2018 +0200

    Notifications/Alerts revisited (#1004)
    
    * Restore design of alerts to current release version of karrot
    
    * Implement and demonstrate notifyMixin
    
    * Rename KAlert to KBanner
    
    * Replace notifyMixin by new store plugin toasts.js
    
    * Replace banners by toasts where appropriate
    
    * Remove unused code
    
    * Remove useless styling  (seems to have no effect)
    
    * Refactor toasts store

[33mcommit 3ca9b515fc49a62bc120993a78c841faf805a3ec[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Mon Apr 16 21:49:12 2018 +0200

    Minor changes to notifications.md

[33mcommit 03ad702043eb06175e8fda713aac91927ac2521f[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Mon Apr 16 21:41:47 2018 +0200

    Update SUMMARY.md

[33mcommit ebbb1ebe4603762273c245adaaf212b217885f71[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Mon Apr 16 21:40:07 2018 +0200

    Document toasts

[33mcommit 39888ccec93a1c890c272ff5444bd40ac73a405c[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Mon Apr 16 21:28:09 2018 +0200

    Document banners

[33mcommit 61200a6eba32ca0daafd845961d183b79e350f7f[m
Author: PhrydRhys <ky765@nyu.edu>
Date:   Mon Apr 16 13:44:40 2018 -0400

    Updated timespan of license to "2016-present" (#1007)

[33mcommit 42678a87805199984a5f1c6a2797a53d79666d51[m
Author: neha <iec2015048@iiita.ac.in>
Date:   Thu Apr 12 23:20:03 2018 +0530

    loader animation updated (#990)
    
    * loader animation updated
    
    * snapshots updated
    
    *  :value attribute removed
    
    * snapshots updated

[33mcommit da902f1d3bcf9e59e39ffb36b6e72ea0c1f4a5f4[m
Author: Uma Chandran <codebyuma@users.noreply.github.com>
Date:   Thu Apr 12 13:48:08 2018 -0400

    add show and hide to local-en and update component to use them (#1003)

[33mcommit 0362a9fbfb14c2799f229a2c4fe0c470517dee55[m
Author: Ananya Agrawal <33188930+ananya-agrawal@users.noreply.github.com>
Date:   Thu Apr 12 23:17:33 2018 +0530

    Upgrade font awesome to v5  (#961)
    
    * upgrades quasar-extra to the latest version
    
    * upgrades class names based on font awesome v5 upgrade
    
    * upgrades class names based on font awesome v5 upgrade
    
    * add snapshot test
    
    * adding snapshot
    
    * updrading icons to font awesome v5
    
    * profile page updated
    
    * changing class to update font awesome v5
    
    * fixed allignment
    
    * update snapshots
    
    * styling fixed
    
    * added snapshot
    
    * fixed icon
    
    * icon fixes
    
    * update storyshot

[33mcommit 3cff4e983389b5b8a0f965e5deb3abf513e93551[m
Author: neha <iec2015048@iiita.ac.in>
Date:   Wed Apr 4 16:23:45 2018 +0530

    email and password buttons disabled (#992)
    
    * email and password buttons disabled
    
    * edit so has function return boolean values
    
    * changes updated
    
    * snapshot updated

[33mcommit 753d2f5cd12fe507bc0169d4762c2c91b0f2dc00[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Sat Mar 31 20:58:54 2018 +0200

    Decouple auth store & user store from websocket (#991)
    
    * Decouple change-email from websocket
    
    * Decouple verify-email from websocket
    
    * Bugfix in user store

[33mcommit f8dfe7efe25b93736526b5e947e2b0b600ed4a12[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Sat Mar 31 20:57:20 2018 +0200

    Use new dialog style for request-account-delete dialog (#989)

[33mcommit 5f92509c17c1193b6cd289528724eb631ad5994e[m
Author: Janina Abels <djahnie@disroot.org>
Date:   Wed Mar 28 20:34:24 2018 +0200

    Update ROADMAP.md
    
    The next months might be pretty quiet wrt Karrot development...
    But this file may be adapted doocratically like all the others! :slightly_smiling_face:

[33mcommit e2b996d4f320d88e18a786a3d655d0f5bd648150[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Mar 28 12:51:52 2018 +0200

    add eslint-plugin-testcafe
    
    Closes #953

[33mcommit f6d8995a9dd286ff6693125e212536bdd975491e[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Mar 28 12:29:38 2018 +0200

    Upgrade to Quasar 0.15 (without new CLI) (#974)
    
    Closes #913
    
    I upgraded Quasar to the latest version. It needed many changes, but it works and looks almost the same as before :smile:
    
    I didn't upgrade to the new CLI and the new project structure yet, as this requires moving and rewriting lots of files. But we might do it in future.
    
    I didn't set up Quasar i18n, because we don't use any component that needs it: http://quasar-framework.org/components/internationalization.html
    
    
    * WIP quasar 0.15
    
    * more quasar upgrading
    
    * fix dialogs, use appVisibility plugin
    
    * use notify plugin
    
    * use native events for collapsible cards
    
    * use v-close-overlay instead of refs
    
    * use new dialog style
    
    * fix pickup edit
    
    * fix history detail toggle
    
    * fix loadingprogress bar
    
    * start fixing tests
    
    * fix test interactions
    
    * update snapshots
    
    * fix code style
    
    * fix design
    
    * hide give feedback button if no feedback can be given
    
    * fix drawer
    
    * fix tablet layout
    
    * update snapshots
    
    * fix gallery style
    
    * fix conversation compose style
    
    * fix test
    
    * update locales
    
    * update snapshots

[33mcommit af9d710104db48f9e200fa7f711a8a276da567f5[m
Author: Lukas Gebhard <freerunningapps@gmail.com>
Date:   Tue Mar 27 20:30:11 2018 +0200

    Use reworked auth API (#934)
    
    * Rework password reset flow
    
    * Adapt password-change to new API endpoint
    
    * Adapt mail-verification to new API endpoint
    
    * Build fix: Storybook
    
    * Fix email verification
    
    * Update email-verification test
    
    * Always display alerts at the bottom of the page; Show alert after password change
    
    * Fix alert positioning
    
    * Clear password fields after password change
    
    * Refactoring
    
    * Refactoring
    
    * Re-refactoring
    
    * Re-re-refactoring
    
    * Implement request-delete-account feature
    
    * Implement account deletion
    
    * Build fix
    
    * Update snapshots
    
    * Rework email change

[33mcommit aeb2e601cf33965c745ccdc0dd75529929f455d1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 27 19:38:00 2018 +0200

    fix style

[33mcommit 74626219031f5998fb42b343ec74aec5dd741fab[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 27 19:09:27 2018 +0200

    don't try saving locale if not logged in

[33mcommit 27e4cb77a9ce6615b86671424891083c8aa8cc9b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 27 15:23:43 2018 +0200

    remove commented code

[33mcommit f9b46307a09c5792d708956aac2f71a31e22ae5f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 27 14:55:56 2018 +0200

    update locales

[33mcommit a0cf32f76cef3656b3139069a51fee7a5a3be093[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 27 14:10:38 2018 +0200

    fix group filtering and preview logic

[33mcommit 63c97e0744afc7b190b26458327515418d73c444[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 27 13:30:31 2018 +0200

    don't try to join playground group if none exists

[33mcommit a5a19d84cb1ce9560f503bf24b3e01894ffbab6b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 27 12:34:51 2018 +0200

    hide giveFeedback if no done pickup

[33mcommit 99eae2d67afbe96d366d1ff0276df3ee12560164[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 27 12:01:12 2018 +0200

    fix redirect-to-profile bug

[33mcommit 539b06825bcf17d166e6893998c1ba035fa27481[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 27 11:48:43 2018 +0200

    don't fail when mark is already in progress

[33mcommit 67f2c6802e576c809e8d720888a3d22f6c688067[m
Author: Nick Costigan <nick.costigan@gmail.com>
Date:   Sat Mar 24 13:05:31 2018 -0400

    redirects to user profile after submitting changes on the settings page (#977)

[33mcommit 8c95f9090aa6db050dc6c7c71c1419afd04f113b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 19 20:03:14 2018 +0100

    upgrade packages

[33mcommit 5ca4b222bb3d3ca0babec03ca9b888817f82faba[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 19 18:44:17 2018 +0100

    prevent data loading issues

[33mcommit e5fa45dee293d90e0ba831adf33e708f62b905dd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 19 18:26:37 2018 +0100

    update locales

[33mcommit 32b33141533cc137e1c2be5cd480e4d7c55ac43f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 19 18:25:09 2018 +0100

    show mobile add reaction button always

[33mcommit ee5227c44aeec9fe771311eafd97418343e2db89[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 19 18:24:40 2018 +0100

    hide archivedstores button if no archived stores

[33mcommit c91b88f3a86042e51a0909df8924f3e80e93d605[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 19 11:08:11 2018 +0100

    remove unnecessary scrollbar

[33mcommit 78a871de2d945bfa2c50c34ee78b2cc905f4f31c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 22:01:50 2018 +0100

    use newer node image

[33mcommit 75621a85825b08f37edd305286ad7f2d98677248[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 21:51:44 2018 +0100

    hide playgroundgroup info on mobile

[33mcommit 039bac54d5f4239ba8ede934e85be3f0833b48a0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 21:31:13 2018 +0100

    list archived stores
    
    Closes #941

[33mcommit 4b84c52b0815fb525d22b769498e60d7858de847[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 20:43:18 2018 +0100

    add create-store button to mobile
    
    Closes #826

[33mcommit f8d7b74f408ad34831a2191801c29e9e71d8a840[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 20:37:30 2018 +0100

    fix message layout with long lines
    
    Closes #966

[33mcommit 24e286a5d58634a6c8766f98e372a188307e9ffa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 20:04:57 2018 +0100

    fix bug in feedback select
    
    Closes #907

[33mcommit 54836dbfb2f1bc61c4096a00f862cc39650990d8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 19:58:16 2018 +0100

    dont send on websocket if not open
    
    Closes #908

[33mcommit d1f7eec2886824cb30c8bd8d453c0c9bb195a5fe[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 19:46:15 2018 +0100

    increase fullscreen map button size

[33mcommit dddc7e177dd20381a6fa5c880d244c5ec318c798[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 19:39:22 2018 +0100

    align email symbol

[33mcommit a671197aa93e52f04f965bfc158437fa93ec15c1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 19:33:59 2018 +0100

    fix two bugs in feedback view
    
    - weight = 0 was rewritten to 'undefined'
    - undefined weight showed NaN in AmountBox (now shows ?)

[33mcommit f17b5e3bf7d1f4c7c09d13a65208bb1b8ac61237[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 19:02:29 2018 +0100

    add pointer to userphoto selector
    
    Closes #967

[33mcommit 99f3d3f8e54c2330523e210ff57121c22f26f164[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 18:47:48 2018 +0100

    add attribution to README
    
    mostly for twemoji because it's CC-BY, but the others deserve it too

[33mcommit d61b0bbbb2870d21a3232e674baf66d6fe5dc4c7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 18:41:27 2018 +0100

    replace canvas with jest-canvas-mock
    
    canvas needs a compilation step when downloading, which was problematic on some machines.

[33mcommit fb3403bb58cbd4a5c699446f9d7e720652b4fbf9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 17 18:03:13 2018 +0100

    update locales

[33mcommit aab50842206ae82c02684115b638d0cc4bde77a7[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Mar 17 17:58:03 2018 +0100

    Add playground group frontend and hide inactive groups (#960)
    
    * WIP: add playground group frontend
    
    * refine playground group
    
    - disable group name and password editing in frontend
    - add "group.isPlayground" property
    - make playground group name translatable
    - show hint when user is in playground group
    - make playground group card green
    - add a checkbox to signup form to automatically join playground group
    
    Design changes
    - increase minimum size of GroupGalleryCard
    - slightly change behaviour of group search
    
    Refactoring:
    - remove duplicate state ("previewOpened", "search")
    - move GroupPreview into GroupGalleryCardsLayout (from GroupGalleryCards)
    - use "group.isMember" instead of passing "currentGroupId"
    - move component and prop declarations to the top
    - fix stories and tests
    
    * Hide inactive groups

[33mcommit 1dec96da21408e7cb60538494fb1a105c879f8c0[m
Author: mrkvon <mrkvon@users.noreply.github.com>
Date:   Sat Mar 17 17:57:06 2018 +0100

    Add emoji reactions to messages (#926)
    
    First version with 5 selected reactions

[33mcommit df9bb01edab7704beba0389d209919ef2c46814d[m
Author: neha <iec2015048@iiita.ac.in>
Date:   Thu Mar 15 23:11:01 2018 +0530

    Search box fixed when no results found (#965)
    
    Fix search box

[33mcommit 2249b16abee114f53012908da1f8d5beb7d2167e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Mar 14 15:53:34 2018 +0100

    fix wrong invitations
    
    currentGroupId is not defined on startup (although it should be, beforeEnter awaits before it continues)
    
    I take the groupId from the url directly now, and throw an error if no group is passed.

[33mcommit 33b7120de74c356c7e23e0c055e5f9ae83ad4d54[m
Author: Brian Friederich <briantfriederich@gmail.com>
Date:   Tue Mar 13 05:06:51 2018 -0400

    fix: remove articles for mass nouns and fix conjugation of singular noun (#962)
    
    I removed the article a in front of “software” in 2 locations as it is
    a mass noun, and changed the conjugation of “to be” to the singular
    conjugation for the singular noun “information,” as discussed and
    approved in the group forum.  Thanks for the chance to collaborate!

[33mcommit 51536f4c5d47dbecb88d676d200daf26386aab5e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 11 18:21:17 2018 +0100

    only show inactive user list if not empty

[33mcommit 85334dbb0d920dd75ae5dfad8c850e65ae37815c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 11 16:44:15 2018 +0100

    revert unwanted lines

[33mcommit 223900dd2875bddabe8c3c3c136ae88c4b435b79[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 11 16:35:25 2018 +0100

    save cache after e2e test

[33mcommit 4e0ba0df02233119fab7d73895fedd456ce0d052[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 11 13:33:34 2018 +0100

    mark inactive users in member list (#957)

[33mcommit 07e45c67fd103983f12779878222978183a0c3b4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 10 19:58:42 2018 +0100

    fix language loading race condition

[33mcommit 4d87ddc63f4659f4f3342ff6b591f1a54de69c17[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 10 16:32:22 2018 +0100

    add Polish language

[33mcommit 38ad836d729f1c5d2809dbc93ff3f3ea97908c5e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 9 17:10:30 2018 +0100

    update locales

[33mcommit a8a3dc5b446881dba29348d53c2b6080e20f6f90[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 9 17:09:06 2018 +0100

    fix join group e2e test

[33mcommit b38af2ec7012294510cd35d19f054c1a92038fb0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 9 14:20:45 2018 +0100

    fiddle with profile page design

[33mcommit 9f7875ed2e11de20c5fadd73adf3a6e1c10ce732[m
Author: neha <iec2015048@iiita.ac.in>
Date:   Fri Mar 9 05:50:55 2018 +0530

    Edit button removed from user profile who is not logged in. (#951)
    
    Edit button removed from user profile who is not logged in.

[33mcommit 070def8e5c30ea7478fdf93f6bd6e07f081fe383[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Mar 8 17:35:25 2018 +0100

    Add pickup notification option (#954)

[33mcommit 6f28811b229046b0b2adb1ba8e981242623cbf03[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Mar 8 10:52:10 2018 +0100

    GroupGallery Map (#903)
    
    * Added map to GroupGallery
    
    * Added markers to groups, fixed position of zoom controls
    
    * Added mobile view
    
    * Remade everything since mobile became annoying, split into Map & Cards Components, mobile now working well
    
    * Fixed mobile space above footer, updated storybook
    
    * Added search to myGroups
    
    * Improved filtering for myGroups, added animations
    
    * Updated snapshots
    
    * If only single group is selected, navigation is now expanding
    
    * Map is now zooming on preview
    
    * Window now scrolling to top on preview
    
    * Moved GroupGalleryCards to their own component; close icon -> angle
    
    * Made cards wider on desktop; fixed alignment of alert
    
    * Made template logic expressions slightly better
    
    * Added tests for GroupGallery
    
    * Updated snapshots
    
    * fixed lint errors
    
    * fixed lint errors in helpers
    
    * fixed last storybook error

[33mcommit 7fc945b99652dac08f1a26cb877846dc978863ec[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Mar 7 17:14:36 2018 +0100

    Use dispatch instead of calling function (#948)

[33mcommit a4db83cfcc1848d493b87b5237d8544d63208c47[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Mar 7 16:37:19 2018 +0100

    Reload data on foreground or online event (#944)

[33mcommit b3a6a7693769d47550e90f9bc458bb022710126b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Mar 6 11:18:36 2018 +0100

    Fix agreement editing bugs (#939)
    
    * Fix agreement editing bugs
    
    * Minor fixups

[33mcommit b4d394969bd6651676b596659410ad1653e17f29[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 4 16:01:31 2018 +0100

    update locales

[33mcommit dd2ce66dfaf64eed76c1400eae49750e7086b454[m
Author: Janina Abels <djahnie@disroot.org>
Date:   Sat Mar 3 22:52:48 2018 +0100

    Add link to info page (#929)
    
    * add info page to footer
    
    * add info page to MobileSidenavUI
    
    * make sidenav sublabels translatable
    
    * make news lowercase
    
    * change karrot.world to karrot in blog description
    
    * update storyshots

[33mcommit 575fd9337b5c58d91dc74db4c86ece6cf7a5dcc4[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Mar 3 21:51:14 2018 +0100

    Add group settings page for notification options (#933)
    
    * Add group settings page for notification options
    
    * remove emittingcheckbox, remove console.log

[33mcommit 57234229061b614438616a7a5114543f681510c7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 3 17:12:36 2018 +0100

    pulse KarrotLogo on loading, make loading progress bar smaller

[33mcommit 3e0e65f4a54610239cd3b340b98fab8df36b7fec[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Mar 3 13:16:28 2018 +0100

    Show hint if the user can't receive notification emails (#930)
    
    * show hint if the user can't receive notifications
    
    * add hoverScale class
    
    * update snapshots

[33mcommit 72e8f75b3d8ad1cef48b06e6cf8f1f73804d1812[m
Merge: a7ef6844 94f6b7c7
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Mar 3 09:52:07 2018 +0100

    Merge pull request #931 from yunity/makeCodeblocksLighter
    
    Change bg color for clode blocks to lighter shade of grey

[33mcommit 94f6b7c77ead21eaf8eb3b206afbf3fba1c98f38[m[33m ([m[1;31morigin/makeCodeblocksLighter[m[33m, [m[1;32mmakeCodeblocksLighter[m[33m)[m
Author: djahnie <djahnie@disroot.org>
Date:   Fri Mar 2 19:08:19 2018 +0100

    change bg color for clode blocks to lighter shade of grey

[33mcommit a7ef6844182f5eb02e6be9911eba3afd2bbf6961[m
Author: Devipriya Sarkar <devipriyasarkar96@gmail.com>
Date:   Fri Mar 2 20:06:00 2018 +0530

    add mobile number field to relevant pages (#917)
    
    * add mobile number field to user profile page
    
    * add mobile number field to user settings page
    
    * add margins between field items
    
    * update snapshots
    
    * fix broken div

[33mcommit 96ac4b564e5c50bfceb0a772dd43b38a929ed84a[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Mar 2 15:26:10 2018 +0100

    improve conversation messsages (#918)
    
    support markdown, fix style

[33mcommit 17b841eb3ecb92af6726c7106a10018df387791d[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Mar 1 13:28:11 2018 +0100

    mark user as active in group when they visit a group-related page (#919)

[33mcommit f90a6ce81724606f3da4579bf0ccc967afbf347f[m
Author: Janina Abels <djahnie@disroot.org>
Date:   Wed Feb 28 15:35:01 2018 +0100

    Update README.md

[33mcommit 0cb7004aea650b59eae96ffe4e19e82f2f04b9f2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Feb 28 14:54:25 2018 +0100

    use newer image for e2e

[33mcommit acb29ae5e8d804569d1037e54cf78868f0e581e2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Feb 28 12:27:25 2018 +0100

    update locales

[33mcommit 5714eb3e571ff5814a350022eaef4287344d5084[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 28 11:40:07 2018 +0100

    Conversation notification settings (#906)
    
    * add toggle button
    
    * add notification mute handlers
    
    * add indicator when replied via e-mail
    
    * update snapshot

[33mcommit 6c8eb15b4d8f864ab8e5d1a19395e4a938fe10ab[m
Author: agarwalpooja <30632125+agarwalpooja@users.noreply.github.com>
Date:   Wed Feb 28 00:11:40 2018 +0530

    added edit button in profile page (#895)
    
    * added edit button in profile page
    
    * sinking
    
    * added green pencil button in the profile page
    
    * edit button design change
    
    * changed edit buttons position in profile page

[33mcommit f78cadbd0981acd747a0addb880b247408009f2f[m
Author: Xaph <jelena.brajnovic@gmail.com>
Date:   Tue Feb 27 19:22:50 2018 +0100

    bugfix for maps (#901)
    
    * bugfix for maps
    
    * remove Number.isNaN check

[33mcommit 0e05fe3bd562ba917d65efe2dd5b2b64d3edc62e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Feb 26 14:28:14 2018 +0100

    Group preview animaions (#896)
    
    * Added animation to GrouGallery
    
    * Added GroupPreview to Gallery (no need to click back & forth anymore)
    
    * Removed searchbar when preview is open
    
    * improvements to searchBar animation
    
    * updated snapshots
    
    * Removed unneccessary comment & console statement

[33mcommit c7cea41808622894c59f03272bb270462733d513[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 26 13:38:33 2018 +0100

    update snapshot

[33mcommit c3ecfb2c648ccee2f25b6087fe57095af80dcdcb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 26 13:37:23 2018 +0100

    update spanish translation

[33mcommit 2081bc406f3740ed4c40549a8940d26d185941d1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Feb 25 12:17:44 2018 +0100

    update snapshots

[33mcommit 422b7912dee101f1bfa9e1dea11b3e840b80d29e[m
Author: searchingfor <chris.michel33@gmail.com>
Date:   Sun Feb 25 06:16:07 2018 -0500

    Added searchbar with filter (#892)
    
    * Added searchbar with filter
    
    * Deleted comments, Fixed styling

[33mcommit 04e2ec8df8c32ba6d83259f48b49b6831e107564[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Feb 24 01:00:23 2018 +0100

    Attempt to improve sourcemaps in sentry

[33mcommit dd1a1d6463386fedced54e39a04b0fa2ba30b0f6[m
Author: Anjali Jain <aj2966@gmail.com>
Date:   Sat Feb 24 02:23:00 2018 +0530

    enabled ctrl+enter as submit for textareas (#879)
    
    * enabled ctrl+enter as submit
    
    * removed errors
    
    * review
    
    * rectify errors of send with maybeSave
    
    * redundant method removed
    
    * final set of changes

[33mcommit 3a59e8954a4d0c842ac8b64f0aab328154814f22[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Feb 23 03:53:14 2018 +0100

    Better python caching

[33mcommit 7bd0b28db2b30e07cac01cff756b9f9f2eee64d6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Feb 23 03:43:47 2018 +0100

    Switch to jest-junit

[33mcommit b98cb2da975e0f31ce3a1a23ec63414ab83b4b2f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Feb 23 03:39:32 2018 +0100

    Add missing quote

[33mcommit 28e72be92f8909d3b1baf6a5bfd3911622a43710[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Feb 23 03:36:55 2018 +0100

    Collect junit test reports

[33mcommit f15646d08ed1329010877f663eb337ea51ab0245[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 22 17:43:10 2018 +0100

    fix error when maxCollectors < collectors.length

[33mcommit 2dffc92d33019ea7d55287f21c7ef9b410642f37[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Feb 21 12:55:47 2018 +0100

    polyfill RequestAnimationFrame
    
    mostly needed on old mobile browsers, see sentry:
    https://sentry.io/foodsaving-worldwide/karrot/issues/414283132/
    https://sentry.io/foodsaving-worldwide/karrot/issues/404389063/
    https://sentry.io/foodsaving-worldwide/karrot/issues/404389061/

[33mcommit efe2688d535237300f8c1667744fed996e9c6bb5[m
Author: searchingfor <chris.michel33@gmail.com>
Date:   Thu Feb 22 07:13:54 2018 -0500

    Chrome Pickup Sort Fix (#888)
    
    * Sorts within the Pickups  component
    
    * Version 2
    
    * Version 3

[33mcommit f3428934152b8a9c891e40743cab276a61ab656a[m
Author: Xaph <jelena.brajnovic@gmail.com>
Date:   Wed Feb 21 22:44:33 2018 +0100

    Make fullscreen map available for desktop (#880)
    
    * WIP: Make fullscreen map available for desktop
    
    * sync current map position to url
    
    * rename props, replace router-link with click handler
    
    * update snapshots

[33mcommit 9d0011912f602695efb824b9343ca41d30debb75[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 16:34:16 2018 +0100

    Add cordova plugin to package.json

[33mcommit acd342ffffe89f98949c065b5b28c872e62faabe[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 15:36:17 2018 +0100

    Gitignore ul_web_hooks

[33mcommit 963f60f8b0bc64a083409ec552232d449652cef6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 15:35:04 2018 +0100

    Mention plugin in config

[33mcommit 854c44f5e86f26646783ad1a7e12f4634fbca1bf[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 15:28:52 2018 +0100

    Open karrot links with app

[33mcommit e43fd817321aa05bbf6104824ab7853a101eaa71[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 13:46:27 2018 +0100

    Pass git ref to deploy-android script

[33mcommit f4ebf8118c2141cb84943e8f3c83157600be6faa[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 13:35:16 2018 +0100

    Use APK path passed in

[33mcommit bf919a542d6e875098b33597f12136a4ef8ca470[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 13:26:57 2018 +0100

    Install rsync for android deployments

[33mcommit f23e18878ace5134d8b477cc8f001e86cb32d4bf[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 13:20:41 2018 +0100

    Ensure ~/.ssh dir exists

[33mcommit f068a77598677f4207b7eb811fc342633f54b586[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 13:19:43 2018 +0100

    Don't make e2e tests wait for android build

[33mcommit 3d6d93a25609cd59cffcf3ca558bf729a7b8f2ce[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 13:13:25 2018 +0100

    Only deploy dev android if tests pass

[33mcommit ed49e0a08d5ed7b90bc9f604768b31e0abc59f84[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 13:11:56 2018 +0100

    Fail deploy-android if no settings defined

[33mcommit 11f7d9605f5a719064c120bda0eab3b3114c8e6c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 13:09:19 2018 +0100

    Persist app dist folders independently

[33mcommit d78f698123af4ce7288a53faa4f60e137d0565f0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 13:09:01 2018 +0100

    Fix deployment for android master

[33mcommit dcb18bac01b01706e59fdc0e583ab8597ad7dd7a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 12:48:03 2018 +0100

    Fix circlci yaml

[33mcommit 2cfce4c918ac6e21941806c5e04be06de520c5a4[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 12:39:52 2018 +0100

    Fix circleci yaml indentation issue

[33mcommit 2c6f9b81629d13a12ea5542a8c0d0f8194698b85[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 12:27:24 2018 +0100

    FIxup android apk workspace path

[33mcommit 700ada86ddefc8ddcb56a6eb1dd150fdebe07464[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 12:21:20 2018 +0100

    Reorder ci pipeline, add android slack notify

[33mcommit d992249a3f2fa3da305c0f4eda4b52b423dbaf81[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 21 00:38:21 2018 +0100

    Install pip-tools not pip-sync

[33mcommit 2c425fb91eb10f4a7bf394fcbd2974488f72c5a9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 23:40:38 2018 +0100

    Install pip-sync

[33mcommit 4a776878dea999028aed7520fdf729a8e4afd70d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 23:32:14 2018 +0100

    More ci fiddling

[33mcommit 4c899d65c1dcf153712cf434a8e4b65edf3c7d7d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 23:22:10 2018 +0100

    Rejig circleci pipeline a bit

[33mcommit 32f3b1f4bbbe16eeb8d178c68c17179519b453a4[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 22:55:49 2018 +0100

    Set correct prod creds

[33mcommit 3031b06cfb9ef30cb45cef2e1268e7f37ed91e45[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 22:27:12 2018 +0100

    Use karrot docker images, cache python

[33mcommit 8f85e4a936174135c9913b0cb88630ed05a2f1a6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 21:48:26 2018 +0100

    More circleci fiddling

[33mcommit c734ad1ce4cfdfe9df5b3ee1dc468af65814be3b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 21:17:43 2018 +0100

    Create initial symlink
    
    Doooooooooooooooh

[33mcommit c2a358a8eeaa40472ad5554081b8820395960a23[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 21:10:46 2018 +0100

    Add more stupid ls commands

[33mcommit fe7f32b07142f8c240f4191702f50f7f813c9434[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 21:03:49 2018 +0100

    Use newer android api and use better debug command

[33mcommit cd76380456719458cf68e33c6b49b34dc9a28a91[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 20:55:49 2018 +0100

    More debug commands

[33mcommit 90b44cb74e2a075178f311669fe3b04a86c37c4f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 20:44:41 2018 +0100

    Use android docker image with pre-installed tools

[33mcommit c3dfab2f9f86a88ff7322a9fee6e9c1c7bf89e8f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 20:27:01 2018 +0100

    Add echo and ls debug commands

[33mcommit ed3378fd211360c7374aee4d97cc28bed3db8c27[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 20:04:22 2018 +0100

    Make build command build, not run

[33mcommit bdcbd6c399a73504358f7e15bb6e2953f4811245[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 20:03:15 2018 +0100

    Try and fix cordova build

[33mcommit 123d1a76db5221679dbc22fb37d1d2d27dcfb9d7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 19:31:26 2018 +0100

    Fixup circleci yaml indentation

[33mcommit 9181b6c44c9825f49fadbb64d86014c3401f7faa[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 19:24:21 2018 +0100

    Add dev logo and start of cordova prod build (#887)
    
    Add dev logo and start of cordova prod build

[33mcommit 3c13572b8ff666022e176cbe2dc78493400bca6f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Feb 20 13:35:18 2018 +0100

    Set changeOrigin depending on backend

[33mcommit d8ecb3bc34a19cc6cc6fd389477e0f0eec4f54e9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 19 21:44:42 2018 +0100

    update dependencies

[33mcommit 4a0bc72bc4a12056dfbb2693288c2ace959aed1c[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 19 21:16:38 2018 +0100

    Improve store status (#885)
    
    * refresh pickups after store status change
    
    * show hint if store is not cooperating

[33mcommit 0bfb6a7d86eb9949a5a9b9eca79009a8a1674d14[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 19 16:46:54 2018 +0100

    ignore build-docs failure

[33mcommit f5758499e06f503a50c20e5d09b4f1b77b077ee5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 19 16:31:32 2018 +0100

    update snapshots

[33mcommit 0bf59dee82cc194aa67a3e025e89e7e0a13beb1e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 19 16:30:22 2018 +0100

    Update German locale

[33mcommit f30f9ea448d08d4eab63847f18a2821f2c30ea96[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 19 16:26:58 2018 +0100

    add Gujarati locale
    
    Closes #883
    
    DateFns is set to Englisch because no fitting locale is available

[33mcommit 4dbd1226e4997dd63b66c60530e98f7859fd657e[m
Author: searchingfor <chris.michel33@gmail.com>
Date:   Sat Feb 17 13:23:33 2018 -0500

    Fix for #870 (#875)
    
    * Fix for #870
    
    * Fixed flickering

[33mcommit 5d8074449f5f3d9a83ad1ea3d5759d61af811f8f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Feb 17 17:24:40 2018 +0100

    update locales
    
    Closes #881

[33mcommit 0935a3d5dfff8a3a67700abf8823c66082a80f42[m
Author: searchingfor <chris.michel33@gmail.com>
Date:   Fri Feb 9 05:31:14 2018 -0500

    Back To Top Button (#867)
    
    Closes #867
    
    * First commit for the Back To Top Button
    
    * Second commit for the Back To Top Button
    
    * Third commit Back To Top Button

[33mcommit a40b921b001b2bc0e6ee4766af9074aacb3e5798[m
Author: LyraXaph <jelena.brajnovicv@gmail.com>
Date:   Wed Feb 7 23:49:00 2018 +0100

    Disable save photo button if photo wasn't changed
    
    enable save when photo removed
    
    snapshot update
    
    update snapshots

[33mcommit 59bb2becb9fe0421438164bfe4f1fff2be7a96fa[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 8 13:59:17 2018 +0100

    Receive invitation updates via websocket (#869)
    
    * initial version of invitation websocket update
    
    * refine UI
    
    * remove unneeded locale
    
    * convert invitation on receive
    
    * convert date on receive
    
    * unify convert methods
    
    * fix parseInt flaw
    
    * write test
    
    * add more tests

[33mcommit 9e29d31c1572f6247a2efad9a8de9f52a6917745[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Feb 6 14:34:08 2018 +0100

    Update CONTRIBUTE.md

[33mcommit d7945bbf86156520af28991372df5cf8c055d99a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Feb 4 15:28:47 2018 +0100

    fix vuelidate messages

[33mcommit 21f14ad5f5dba0c70012039995bc274dece566aa[m
Author: Paavini Nanda <paavininanda@gmail.com>
Date:   Sat Feb 3 23:11:26 2018 +0530

    Correct Email address is displayed upon verification (#859)

[33mcommit d8d1d48ec7e1c668bf2fcce26bf415577d78af25[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 1 20:09:42 2018 +0100

    fix message loading

[33mcommit 7f8822bc90bb5af8397282398311837895ba6a60[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Jan 31 18:47:50 2018 +0000

    Keep domain in image urls (#858)
    
    * Keep domain in image urls
    
    * Serve profile photos via proxy in development
    
    * Add DEV global to jest config
    
    * Handle case where there is no profile photo
    
    * Add basic ChangePhoto component tests

[33mcommit 9c4e2ac3ee9d6f82d6cbbd144fa3ad43b6152f75[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 30 00:43:38 2018 +0100

    fix incomplete hotfix

[33mcommit 445d13ed44f0ff55eb5a7c46e335247684fa7ac3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 30 00:36:46 2018 +0100

    update snapshots

[33mcommit 164a47f49382887341802e960a38e97633d9ad51[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 30 00:35:32 2018 +0100

    update locales

[33mcommit 14235060e290bd9ab9322dd21345bec5cd37d7ff[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 30 00:25:51 2018 +0100

    hotfix: resolve name clash
    
    I introduced a conflicting auth/update action. I resolved this by renaming the former update action to auth/save, in line with the other entry save methods.

[33mcommit 0be24bfa43e30753e1d943135ba0552044857547[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 30 00:13:35 2018 +0100

    update deps

[33mcommit f9de6eaed737b2402aaec65fd629d358f3a14c74[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 30 00:03:22 2018 +0100

    hotfix property lookup

[33mcommit 55a4470c7a24a30840a683adba3d20c50f104de3[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jan 29 23:55:01 2018 +0100

    Receive websocket data updates (#856)
    
    * WIP: more push
    
    * push feedback updates
    
    * user and history push updates
    
    * remove logging
    
    * update feedback possible pickups
    
    * fix some stuff
    
    * always keep pickups sorted
    
    * update snapshots
    
    * remove pickupSeriesHelper again
    
    * fix snapshots
    
    weird, after refreshing packages with yarn install, I get correct snapshots
    
    * add conversations test
    
    * add currentGroup update test
    
    * add more tests!
    
    * remove unneeded rootGetters

[33mcommit a39ba19b6728d2e727d186b784eedcb63c7a3ee3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Jan 27 17:57:45 2018 +0000

    Add android build step (#780)
    
    * Update package lock
    
    * Set android min sdk version
    
    * Reorder property
    
    Is done automatically by cordova...
    
    * Add android build step
    
    * Set android artifact destination
    
    * Add gradle cache, rsync apk to yuca
    
    * Fix ci yaml
    
    * Fix path to apk
    
    * Install rsync
    
    * Add back in other jobs

[33mcommit 1905d01c9b657e6431273a072426bf15bde5c0b2[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jan 27 14:11:22 2018 +0100

    Conversation improvements (#848)
    
    * support for presence
    
    closes #770
    
    * refactor parseCursor
    
    * implement basic unread notification
    
    * receive conversation updates
    
    * remove unneeded code
    
    * show presence in topbar
    
    * fix spelling
    
    * simplify conversation insert
    
    * update snapshots
    
    * fix storyshots
    
    * prevent conversation if old data arrives
    
    avoids flickering if conversation updates arrive out of order
    
    * improve event handler code

[33mcommit 7955ca3b06b6cf5824e7e5ce254c7951f6b97742[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jan 24 11:41:05 2018 +0100

    Add awesome active autonomy as code of conduct

[33mcommit 32c012fe3939733ed2ceac9c3dcf7627471ecef8[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jan 22 22:23:46 2018 +0100

    Small design improvements no. 6 (#850)
    
    * Improved search - +workaround for "second character" problem
    
    * GroupOptions Popover - open on left side
    
    * Improvements to Layout on big screens
    
    * Added slide transition to availablePickups and joinedPickups
    
    * Feedback: restyled
    
    * Removed unnecessary groupOptions
    
    * Removed History Detail, added more info to HistoryEntry
    
    * New History List: Improved Design
    
    * GroupNav: re-added option to desktop | Centered Layout on splashLayout
    
    * Readded History, changed URL when history item is clicked
    
    * Updated snapshots
    
    * History Entry -> Route agnostic || PickupFeedback: unscoped css wrapper
    
    * Moved editBox and slideToggle to their own styl files
    
    * updated storyshots
    
    * update snapshots

[33mcommit 02758d92daa949c85c5585c48cd7d03c5cbb8479[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 16 19:04:16 2018 +0100

    upgrade vue-test-utils

[33mcommit e95372a4a43af7afe7c41a2417e98c603c6240ff[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 16 19:03:00 2018 +0100

    update deps

[33mcommit c1674d93f991b61ea99444ff3545aca263e355fa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 16 18:53:27 2018 +0100

    update locales

[33mcommit de4bd16cbb401a053be62a4d7e7f671b86ed7cff[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jan 16 18:06:02 2018 +0100

    Fix cancel button and some design stuff (meersschautarnaud rework) (#849)
    
    * Made some small css improvements and fixed the cancel button
    
    * proper code for cancel button
    
    * revert to minimal change
    
    * add missing comma

[33mcommit 64333e50741c2bad6d15c4363d10d1b02d0541e3[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jan 16 17:31:48 2018 +0100

    Feedback improvements (#843)
    
    * add loader
    
    * show feedbacknotice in group feedback list
    
    * add feedback editing
    
    * update snapshots
    
    * improve buttons
    
    * update snapshot
    
    * required object type for editmixin

[33mcommit 1eba97ee91155e7411400e68c29172482bea28a1[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jan 14 12:42:51 2018 +0100

    Fix style issues (#844)
    
    * fix html style for multi-attribute elements in Adddress, Conversation and General
    
    * fix html style for multi-attribute elements in Group
    
    * fix html style for multi-attribute elements in GroupJoin
    
    * fix html style for multi-attribute elements in History
    
    * fix html style for multi-attribute elements in Layout
    
    * fix html style for multi-attribute elements in Login
    
    * fix mistakes made so far
    
    * fix html style for multi-attribute elements in Map
    
    * fix html style for multi-attribute elements in Pickups
    
    * fix html style for multi-attribute elements in Settings
    
    * fix html style for multi-attribute elements in Sidenav
    
    * fix html style for multi-attribute elements in Store
    
    * fix html style for multi-attribute elements in User and Wall
    
    * fix html style for multi-attribute elements in rest of src
    
    * fix html style for multi-attribute elements in src/pages
    
    * update snapshots
    
    * remove multi-attributes rule disabling line
    
    * start adding prop types
    
    * Add prop types until components/Group
    
    * Fix mistakes in prop types
    
    * App prop types until components/Pickups and fix errors
    
    * add latest changes
    
    * fix non-boolean types
    
    * remove eslint exceptions
    
    * add remaining types
    
    * fix some warnings

[33mcommit c7152378837fb163a5c3dc7fd1e966af577379cc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jan 13 19:05:16 2018 +0100

    fix photo chooser size on mobile, add placeholder

[33mcommit e6a62115bc9411798d59cd9733d4320b231c766d[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jan 13 16:22:16 2018 +0100

    Add user photos (#842)
    
    * enable photo upload
    
    * use profile picture
    
    * add profile picture to topbar
    
    * fix display bug
    
    * fix failing test
    
    * add canvas to avoid errors when testing vue-croppa
    
    * update storyshots
    
    * use photoUrls instead of photo

[33mcommit de3c7efd56ee79e8abcdd0466a3600d1199c8c4b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jan 12 23:49:18 2018 +0100

    add back missing historylist snapshot

[33mcommit c5fa01ae8c1403d64d4956fcfdddd84ec052b118[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jan 12 23:48:20 2018 +0100

    load groups before starting app

[33mcommit daef66e5e9d41a884f0f7147f90ad28dbe75266c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jan 12 23:41:28 2018 +0100

    fix HistoryList story

[33mcommit 6ea727178e4ceefe3c9571d0bfe8e31d0c279759[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jan 12 23:17:30 2018 +0100

    remove unneeded arrow

[33mcommit b8a258defa2aab7923a9a2576e3b9f7f47ce45c6[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Jan 12 23:08:52 2018 +0100

    add weight input (#840)
    
    * add weight input
    
    input box is still a bit misplaced...
    
    * Added max-vals to AmountBox & Viewer, improved style
    
    * Added grams and tons to amountBox
    
    * Updated snapshots
    
    * fix v-model behavior
    
    * simplify photosArray

[33mcommit 7fbaef037f7f810a78302ae3c1846c404de5dcdd[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Jan 12 23:08:31 2018 +0100

    WIP: Group Banners (#835)
    
    * Added random circle-banners to members and description
    
    * moved history to historyList, removed history page and made store & group specific pages
    
    * GroupMembers: removed unnecessary div
    
    * groupBanner cards: removed margin on mobile
    
    * GroupNavbar: Has GroupBanner as background now
    
    * GroupDescription: can now also show public description
    
    * Fixed linear gradient of description
    
    * Improved Invitations
    
    * Fixed pickups navbar
    
    * Added RandomArt to StoreNavbar
    
    * Made the opacity of GroupNav a variable
    
    * Invitations: Made header smaller
    
    * Removed overlay, made RandomArt-circles darker
    
    * Code cleanup, removed generic-padding from group pages, made headers smaller
    
    * HistoryList loader: now in the middle again
    
    * Added animation to hoverscale buttons
    
    * Added animation to KNotice
    
    * Made RandomArt-lines more pretty
    
    * updated snapshots
    
    * Added whitespace on MainLayout, removed red color on GroupInvitation Error
    
    * InvitationsForm: now White font

[33mcommit cb503c64a6ce1d22a489d3304e7317bd74bd503a[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Jan 11 22:15:32 2018 +0100

    fix feedback update (#841)
    
    Closes #838

[33mcommit 9e3a501df6aef91422b2499e15bc5cd1800833c3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jan 10 20:13:01 2018 +0100

    fix group editing
    
    Closes #836

[33mcommit 1a6fc2527dd387f8c1a727337b8cae26360362f9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jan 10 19:58:00 2018 +0100

    downgrade vue-test-utils
    
    update mockdata

[33mcommit bada25630e9ae337fa8969b75aebe5bce79910c5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jan 10 19:05:27 2018 +0100

    update german locale

[33mcommit 621bf0b69f001205fea789170d39474d8667ad61[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jan 10 18:58:50 2018 +0100

    dependency updates

[33mcommit 807af465a87614b55d08595ff72c40beebd3e2b3[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jan 10 18:37:57 2018 +0100

    Enable to set location by clicking on address picker map (#834)
    
    This was implemented in karrot before (angular version), it didn't make it into the quasar version so far.

[33mcommit f5a8559b1efa497883e6d5ef0052c4015aa1889d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jan 9 21:57:47 2018 +0100

    updates locales

[33mcommit 5a2049ca7f0e716e609b2b8fc0fc5789366426f1[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jan 8 22:58:59 2018 +0100

    Design Improvements no. 5 (#822)
    
    * Centered Sidenav + MainLayout again for now
    
    * Added empty feedbacklist notice
    Added button to give feedback on StoreFeedback
    Added message on amound of saved food to StoreFeedback
    
    * PickupManage: Removed margin on secondBannner-svg
    
    * Feedback: Changed "you took home", highlighted 'other pickups' button
    
    * AmountBox: Added fixed decimal
    
    * Added GroupGroupSidenav to PickupFeedback
    
    * PickupFeedback: new Layout for previous feedback list
    
    * FeedbackItem: Linkify name & store
    
    * add feedback pagination
    
    * remove duplicate empty note
    
    now in feedbacklist
    
    * Removed "other pickups" button from give-feedback
    
    * Desktop: Added feedback to GroupSidenav, removed PickupNavbar
    
    * PickupItem: removed multiline (unnecessary blank white line)
    
    * updated storyshots
    
    * removed console.log
    
    * Feedback Item: New Header Layout
    
    * Updated storyshots
    
    * Yet a different feedback-item layout
    
    * =Removed comma[C
    
    * Re-added multiline
    
    * Updated storyshots
    
    * Added multiline to feedback items

[33mcommit 1558c96dd951107e21d42f2520ff6522eec1550f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jan 8 12:34:37 2018 +0100

    hotfix: initial page load might fail if current group does not exist
    
    show group gallery instead

[33mcommit 4ee0c1e30b451c07d436f4e80736d3a8f58f14e0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jan 7 19:39:38 2018 +0100

    update snapshot

[33mcommit 636d722699bfe712094d02a5948ef4ed7f469e06[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jan 7 16:57:33 2018 +0100

    remove unused __unenriched property

[33mcommit 11e31464c0e1217f4515428985251d223f8ae241[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jan 7 16:55:07 2018 +0100

    Add more tooltips
    
    Closes #688

[33mcommit bf4040f49db42b961f3e0c51beffc2d3f4e565bf[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jan 6 16:37:13 2018 +0100

    improve group leave behavior (#830)
    
    Closes #643
    
    Make sure that data gets cleared when leavin group
    Don't throw errors during the leave process
    Remove unneeded & problematic redirect

[33mcommit 005980bcd8db8b12a525ec2842308acda456ffee[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jan 6 16:36:49 2018 +0100

    support custom recurrence rules (#828)

[33mcommit be0c7ab9ee406090d3b09a08906a887cfab7dd35[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jan 6 16:36:29 2018 +0100

     Consolidate locale config (#825)
    
    * Consolidate locale config
    
    Closes #776
    
    Move locale config into one file, making it easier to add more.
    
    * remove outdated docs

[33mcommit 06378f8d3cf845069c04f19b1d792025d9556d21[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jan 4 23:24:38 2018 +0100

    add home button to verify-mail
    
    Closes #805

[33mcommit 51d78c2e2beb8cf77f611665fa81d940cf66d431[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Jan 4 19:44:55 2018 +0100

    check old password when changing (#827)
    
    Closes #710
    Uses the new `/api/auth/change_password/` endpoint

[33mcommit 00bddff9a15bed5b6872c650db20a63634062d95[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jan 3 16:30:54 2018 +0100

    Refactor sidenav boxes (#823)
    
    * Refactor sidenav boxes
    
    Closes #819
    
    - Introduces `toggles` vuex helper
    - Use only actions as API to vuex module
    - Shorten some names when the meaning should be clear enough ('toggleBoxCollapsed' -> 'toggle' or 'toggleBox')
    - Remove unneeded `collapsible` prop (it was only half implemented, a
    click on the toolbar would still collapse the box)
    - Add some prop types
    
    * update snapshots

[33mcommit 5d3110a01b818f2c18d769e8f14c70cb5fdc79ff[m
Merge: 0ab9bf8d 0b7ff927
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jan 3 12:00:51 2018 +0100

    Merge pull request #818 from yunity/storePictures
    
    (Random) store banners

[33mcommit 0b7ff927e22c7e54745fc1ff5315d4b3959af3dc[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jan 3 11:39:41 2018 +0100

    ProfilePicture: Fixed linkification race condition on join/leave pickup
    Small code changes

[33mcommit 2e6d919db853c2d6f2282c2d3e820e22863cf6a2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jan 2 09:36:32 2018 +0100

    updated storyshots

[33mcommit 7656fd93d4440681ecab4dedb2ec2e9c0a1f04ca[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jan 2 09:34:42 2018 +0100

    StorePickups removed unnecessary span

[33mcommit 7eddb45fc89910b21b260e21107964e7f6da0645[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jan 2 09:28:03 2018 +0100

    StoreLayout: Moved style to class

[33mcommit ea74db7b2c714d3d9a8c6fb07e1fff0ef0e74928[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jan 2 09:21:29 2018 +0100

    RandomBanner & RandomPicture -> RandomArt
    More components use ProfilePicture now (instead of directly using RandomPicture

[33mcommit cc9ececb4e19417f74f75ab2ff49939cf084b98d[m
Merge: 56630178 0ab9bf8d
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jan 1 16:10:50 2018 +0100

    Merge branch 'master' into storePictures

[33mcommit 0ab9bf8d63321f7e67315fd44cd9206fe68c86f4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 31 20:44:04 2017 +0100

    Feedback UI (#803)
    
    * Added first draft of feedback page
    
    * Added FeedbackList and FeedbackItem
    
    * AmountBox: Added working scale
    FeedbackItem: Added infos
    
    * PickupFeedback: Prettyfied creation form
    
    * Added feedback date picker
    
    * fix lint errors, update snapshots
    
    * Added translations
    
    * Added feedback notice
    
    * Added feedback page for stores
    Added margin to  KNotice
    
    * update snapshot
    
    * first working version
    
    * use paginated results for pickups and feedback
    
    * improve bits and bobs
    
    * fix filtering
    
    * add headline
    
    * make jest code coverate less verbose
    
    * implement storyshots independently of storybook
    
    prevents some unwanted side  effects that cause spurious warnings when running the tests, e.g. "Cannot find element: #root"
    
    * rewrite map story into render functions
    
    * fix tests and stories

[33mcommit 7d0589b6a2e91f260fbc6384294dbf36b9650d06[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 31 20:43:31 2017 +0100

    Small Design Improvements no. 4 (#814)
    
    * Added word break to email on profile
    
    * Added input field to pickupMemberCount
    
    * Removed Green (Edit-)Buttons on mobile (took up too much space, are redundant)
    
    * Moved settings page items to cards
    
    * Added "no store description" note
    
    * Removed KBox (wasn't used)
    
    * Conversation Message: Flipped text and date
    
    * CSS cleanup no. 1
    
    * Forms: moved edit style to app.mat.styl; buttons are now floating right
    
    * fixed tests, updated storyshots
    
    * Mail: text is now ellipsed, added mailto
    
    * PickupItem: Unlimited slots for maxCollectors = null
    
    * Added "unlimited" placeholder to input field
    
    * Updated storyshots
    
    * refactor hasUnlimitedPlaces

[33mcommit d66355ec9cbc0eb97a73083493e186fbd391c85b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 31 00:56:35 2017 +0100

    Collapsible SidenavBoxes (#815)
    
    * Made Sidenav collapsible
    
    * Moved status to store
    
    * Improved MainLayout on small desktop screens
    
    * Changed Wall arrows to angles
    
    * Clicking on background now also toggles box
    
    * store sidenavBoxes: removed meta info
    
    * updated snapshots

[33mcommit 56630178d7499715f23f588e8b678180a251aea4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 30 15:37:19 2017 +0100

    Code cleanup

[33mcommit 2176ad940badf9d961b40fa914becec329a43723[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 30 15:34:48 2017 +0100

    Added possibility to add text to banner

[33mcommit 14a2f0baeea1e133efe4a1e0408a3eac700c01b6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 30 12:04:50 2017 +0100

    Added hoverScale to plus buttons on PickupManage
    Updated storyshots

[33mcommit 417a980c6fd188bace2bf564dec30d11089c96b6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 30 12:00:03 2017 +0100

    Added second banner to pickupManage

[33mcommit d91592cae90e57541cca13a69feef032bdac4015[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 30 11:41:37 2017 +0100

    Height Improvements

[33mcommit 7f3b9df8f598119108c211a3a11558d25d9b3857[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 30 11:19:51 2017 +0100

    StorePickups: Action buttons now hover over randomBanner

[33mcommit 09b6af24ff713b7d41bfdd517204d4eb7e84e740[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 30 01:56:21 2017 +0100

    Added banner to all store pages

[33mcommit 833d2a3a4946fd0973d85badd18c19065c31ef8a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 30 00:54:37 2017 +0100

    Added Banner to storePickup

[33mcommit 34d222ee9a59f798a1b4c2a30d1ab20f8bcd5e56[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 29 12:12:41 2017 +0100

    more pretty 404-page (#813)
    
    * Added rolling fruit to 404
    
    * Used fa-icons and green background for buttons

[33mcommit 8f9ecc80d032df96596a2c74d9752bc544125f02[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Dec 28 16:09:56 2017 +0100

    Small design changes (#812)
    
    * Changed icons of pickup manage page
    
    * GroupPickups: Only display store card if there are no pickups
    
    * StorePickups: Prettyfied empty pickuplist message
    
    * UserList: Less margins
    
    * Changed mange-page icon to calendar
    
    * Added members to GroupOptions on mobile
    
    * update snapshot

[33mcommit fa67b9cac924784cb479a58319c1bfae6b1047fa[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Dec 28 11:42:36 2017 +0100

    Some design changes (#807)
    
    * highlight buttons
    
    * refactor sideboxes
    
    * add tooltips
    
    * add one more button
    
    * move sorting to stores module
    
    * remove unneeded class
    
    * remove padding from sidenav boxes
    
    * highlight store create button if no store exists
    
    * add shortcut to create pickups
    
    * enrich mock data with store ui options
    
    * update snapshots
    
    * fix sorting
    
    * Store Pickups: Action buttons not one lined
    
    * PickupManage: Updated buttons for consistency
    
    * Fixed width of sidenav icons
    
    * hide plus button when already open
    
    * update snapshots
    
    * fix bug when sorting archived stores
    
    * use fa-shopping-basket as general pickup icon
    
    * StorePickups: Added margin between FAB

[33mcommit c761d529484f6babd6d8171ee6892954ef8b6896[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 26 20:39:37 2017 +0100

    silence webpack-dev-middleware after upgrade

[33mcommit 4dc7aa178b714005ea7518b09d87aa69d886d028[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 26 19:51:54 2017 +0100

    undo fontawesome upgrade

[33mcommit 03000b7984d0fa0b4bf64eff278b517bb69300ee[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 26 19:23:21 2017 +0100

    Updates (#811)
    
    * updates packages
    
    * update translations
    
    * stupid side effect

[33mcommit c416d804d193d60ca8a77c883a173d4906a7caeb[m[33m ([m[1;33mtag: v4.0.0[m[33m)[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 26 19:19:50 2017 +0100

    release v4 (#810)
    
    * release v4
    
    * update roadmap

[33mcommit bdcd7017188b14171d24435f3df4fa11c4f79d8a[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 26 19:14:40 2017 +0100

    show available pickups (#808)

[33mcommit c95c976e9c97fcd6f4b483dfd111b12d7d745e57[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 26 19:11:31 2017 +0100

    Improve validation errors (#806)
    
    - only show vuelidate errors when the form has been 'touched'
    - add checklist to docs
    - add server-side validation errors in ConversationCompose, GroupPreviewUI
    - improve ProfileEdit, VerifyMail, Signup
    - fix InvitationForm, Login, PasswordReset
    
    * fix login validation error
    
    * fix validation error display on splash pages
    
    * show validation error in GroupPreviewUI
    
    * add nonfielderror to profileedit
    
    * show validation errors in compose input
    
    * refactor validation error in verifymail
    
    * improve validation error handling in pickup edit forms
    
    * fix always-on error in invitation form
    
    * show client-side validation only if 'touched'
    
    * improve error display in invitation form
    
    * add docs
    
    * update snapshots
    
    * fix syntax highlighting in docs
    
    * use ad-free vuejs theme

[33mcommit a7b6de23220ee2d96d7db0c9a6c8ae89ad1ff230[m
Author: Janina Abels <djahnie@disroot.org>
Date:   Fri Dec 22 20:56:29 2017 +0100

    Fix style issues (#804)
    
    * fix html style for multi-attribute elements in Adddress, Conversation and General
    
    * fix html style for multi-attribute elements in Group
    
    * fix html style for multi-attribute elements in GroupJoin
    
    * fix html style for multi-attribute elements in History
    
    * fix html style for multi-attribute elements in Layout
    
    * fix html style for multi-attribute elements in Login
    
    * fix mistakes made so far
    
    * fix html style for multi-attribute elements in Map
    
    * fix html style for multi-attribute elements in Pickups
    
    * fix html style for multi-attribute elements in Settings
    
    * fix html style for multi-attribute elements in Sidenav
    
    * fix html style for multi-attribute elements in Store
    
    * fix html style for multi-attribute elements in User and Wall
    
    * fix html style for multi-attribute elements in rest of src
    
    * fix html style for multi-attribute elements in src/pages
    
    * update snapshots
    
    * remove multi-attributes rule disabling line

[33mcommit 201b2bb29373a0f2d42399a569a7558f0374ea6a[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Dec 20 12:06:44 2017 +0100

    add storyshots (#801)
    
    * add storyshots
    
    Storyshots are snapshot tests derived from storybook stories: https://github.com/storybooks/storybook/tree/master/addons/storyshots
    I adapted the code to our VueJS codebase and it works quite nicely so far!
    
    Some considerations:
    - there's only one snapshot file for all stories, it would be nicer to have one file per story
    - stories and component tests could share more code, inspiration is https://github.com/mthuret/storybook-addon-specifications
    - a Math.random mock was necessary to snapshot AmountPicker reliably, it would be nice to reset it after usage to avoid side effects
    - '@/' alias imports for images cause errors in jest, because `moduleNameMapper` does not replace them with the `fileMock` anymore. The `@` alias might be completely unneeded, as webpack already looks in `src/` for imports by default (was disabled in our storybook config before)
    - require.context does not work in jest, so I used the `glob` package
    - snapshots are not super nice, they contain lots of comments (possibly rendering errors!?)

[33mcommit c8c7590dea9e7f37d672306ebda6871f54c7c588[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 17 16:18:20 2017 +0100

    Refactor all modules & more stuff (#800)
    
    - all modules use fcm-style
    - all modules use meta module if needed
    - rename `sidenav` module to `map`
    - moved localeOptions out of locale module (similar to store status, don't keep static data in vuex)
    - add validation error checks to `profileEdit`
    - add more helpers to `meta` getter
    - add more shortcuts to `statusMixin`
    - slightly extends docs
    - added some tests
    - fixed storybook
    - made some unscoped styles into scoped ones (GroupMap, UserMapPreview, RouteError, VerificationWarning)
    - more deletions than additions
    - simplify module import in `store/index.js` (namespacing not needed anymore)
    - fix groupMap for mobile
    - fix `about` usage (lots of sentry errors)
    
    * refactor i18n module
    
    * refactor invitations module
    
    * refactor loadingprogress module
    
    * refactor pickups module
    
    * refactor pickupSeries module
    
    * refactor route module
    
    * refactor routeError module
    
    * refactor search module
    
    * refactor sidenav module
    
    * refactor stores module
    
    * refactor users module
    
    * refactor verifymail module
    
    * fix loader in groupedit form
    
    * add validation error check to profileEdit form
    
    * remove unneeded locale
    
    * improve meta getter and statusMixin
    
    * fix storybook
    
    * more scoped styles
    
    * simplify index.js
    
    * undo scoping changes for splashlayout
    
    * fix verification warning
    
    * fix groupmap
    
    * avoid errors if about data is not loaded yet

[33mcommit bde612d53251f182716e72585e1e1d6fa33420ea[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Dec 11 23:26:35 2017 +0100

    update chinese locale

[33mcommit 02e4101626efa48e27f86d646cfa5207345bcc02[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Dec 11 13:44:20 2017 +0100

    Refactor history module (#799)
    
    * refactor history module
    
    * fix storybook

[33mcommit 92e76a4da7e201455eab2b8c3bddcd6e432d4c47[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 8 11:27:40 2017 +0100

    updates

[33mcommit ae13590c9045dfaac21b2da24650f40b3bb0cf1c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 2 20:23:56 2017 +0100

    updates

[33mcommit 90d652282f890224482e18f442585f3e9a31cf33[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 27 17:51:24 2017 +0100

    update packages

[33mcommit e0e34d720a270c190c939c8dff442c7ec845120a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 27 17:49:28 2017 +0100

    Revert "WIP: refactor history module"
    
    This reverts commit 83d65c9fa55340a620cda94f80d89f18542b3e89.

[33mcommit d6592406052f6e0b20dbc6c053cbc687c0ab6c5d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 27 17:47:22 2017 +0100

    update locales

[33mcommit 83d65c9fa55340a620cda94f80d89f18542b3e89[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 27 17:44:16 2017 +0100

    WIP: refactor history module

[33mcommit f283eb92e75165fb78b1dbf0f198f33052f5d968[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Nov 27 10:47:27 2017 +0100

    Refactor groups module (#795)
    
    Closes #794
    
    I wanted to do this for quite a while already, so I went through it quite thoroughly.
    
    - Split up groups module into three new ones, make them _fcm-style_
      - `groups` now has everything related to public information, plus join, leave, edit, create
      - `currentGroup` has all the bits relevant to the currently selected group
      - `timezones` handles the timezones needed for group editing
    - Rename all occurences of _active_ group to _current_
    - Clarify GroupGallery and GroupPreview components
      - all components that belong to the gallery are now prefixed with `GroupGallery`
      - the group info page is now called `GroupPreview`
    - Reduce number of attributes per line in some templates
    - Add some types for props
    - Return `undefined` from getter when group or currentGroup does not exist
    
    I made some unrelated changes to the search code as well, to improve code style and reduce the delay.
    
    * refactor timezones module
    
    * rename activeGroup to currentGroup
    
    * remove currentGroup stuff from groups module
    
    * rename groupInfo
    
    * slightly improve search code
    
    * rename to GroupGallery
    
    * rename to currentGroups/value
    
    * rename to groups/mine
    
    * fix broken stuff

[33mcommit 022767ed34e249d530fe22a0497c47d02448f97d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Nov 26 23:26:41 2017 +0000

    Add default props to everything

[33mcommit 9acb519ffaf780a8ef781b3e808c187a9c3fccbf[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Nov 26 15:53:19 2017 +0000

    Add eslint vue plugin (#793)
    
    * Add eslint vue plugin with essential config
    
    * Linting fixes
    
    * Switch to vue/strongly-recommended with exceptions
    
    * Autofix vue linting
    
    * additional style fixes

[33mcommit 2c5e86f463995b85716fc8e26218ba206010a66e[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Nov 26 16:40:23 2017 +0100

    Refactor conversations (#790)
    
    
        rewrite conversations module in fcm-style and withMeta
        split Conversations components from Wall
        rename WallInput to ConversationCompose
        rename WallMessage to ConversationMessage

[33mcommit b135ab5d8d045e6054c2dfee8e3af26b9235a2c3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 26 16:14:12 2017 +0100

    hotfix: load group info if not present
    
    Closes #792

[33mcommit 5f541207003b6051c709cbc5d8fee8ba93d1df66[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Nov 24 18:46:11 2017 +0100

    Refactor some modules to lean 'fcm' style (#789)
    
    * simplify about module
    
    * simplify agreements module
    
    * simplify alerts module
    
    * simplify auth module
    
    * simplify breadcrumbs module

[33mcommit 1d733f91254814343f4ed0d65d3e823d41b018ce[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 24 17:40:42 2017 +0100

    move selectGroup out of meta

[33mcommit bfe01f8a62ee6422e6c2ed8a915351fcae45c57d[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Nov 24 17:39:47 2017 +0100

    Add hooks to trigger actions on route enter and leave (#783)
    
    * first try at improving data resolving
    
    * get rid of onError
    
    * add await
    
    * refactor groupId loading
    
    * refactor storeid loading
    
    * refactor userid getter
    
    * refactor historyid loading
    
    * refactor clearing of auth pages
    
    * refactor some lifecycle hooks
    
    * refactor pickupManage loading
    
    * add some nice tests
    
    * remove space
    
    * fix and add tests
    
    * add docs
    
    * fix user loading and tests
    
    * improve test style
    
    ```
    meta: {
          beforeEnter: 'groups/selectGroupInfo', // triggers vuex action, passing route params as argument
          afterLeave: 'groups/clearGroupInfo', // triggers vuex action
    }
    ```

[33mcommit 1cb9c5ea04c58ba0588723e8f17579c9e7b13e2a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 23 15:41:59 2017 +0100

    Revert "add back missing lastByDay property"
    
    This reverts commit 9b479ab90289789dc6e976947e598ba442bc97a1.
    Introduces other bugs, so will revert it.

[33mcommit 5d87376eeaedd9be9ca593fab549d91b5a007e28[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 23 14:17:13 2017 +0100

    only do objectDiff if both values are defined

[33mcommit 0b057fe4e4f446fc4b6032ed55e6ec7f8411a3ae[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 23 14:12:27 2017 +0100

    make isNew forgiving if value is not loaded yet

[33mcommit 9b479ab90289789dc6e976947e598ba442bc97a1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 23 14:09:32 2017 +0100

    add back missing lastByDay property
    
    might have triggered https://github.com/yunity/karrot-backend/issues/448

[33mcommit 4f9684c2a24f329a56373c000c742dd65f3d3a64[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 23 13:54:52 2017 +0100

    Hotfix: rename from this.source to this.value
    
    Closes #784

[33mcommit 415dd6d5f6f5b8e05577645b3b29d90e5da51abb[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Nov 23 10:42:23 2017 +0100

    Improve code style of GroupEdit, StoreEdit and AgreementForm (editMixin, statusMixin) (#781)
    
    * apply editMixin to AgreementForm
    
    * apply editMixin to StoreEdit
    
    * apply editMixin to groupEdit
    
    * fix jstz import
    
    * try to fix editMixin
    
    * switch back to old-style editmixin
    
    * move default values back to storeEdit
    
    * implement meta in stores module
    
    * remove restore action
    
    * fix some stuff
    
    * handle validation errors in groupEdit
    
    * improve validation error handling in storeEdit
    
    * fix style
    
    * rename to maybeSave

[33mcommit f091321e570b3d29fb2bb79e4a20c7c83a8aca52[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Nov 23 10:37:44 2017 +0100

    switch to new API (#782)
    
    * switch to new API
    
    * remove deprecated code
    
    * move service methods to auth

[33mcommit 0164858b2ca20d002aa2964143c75d6f171371ff[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Nov 20 18:44:20 2017 +0100

    Small improvements no. 3 (#769)
    
    * Redid HistoryEntry - fixes #765
    
    * PickupEdit: disable past dates #764
    
    * PickupSeriesEdit: Improved buttons - still not too happy though
    
    * Store History, pickupManage, edit: removed titles
    
    * Added back button to KBreadcrumbs
    
    * KBreadcrumb: Fixed angle-icons
    
    * Removed unused style in historyEntry
    
    * Changed KBreadcrumb test to match new layout
    
    * HistoryPayloads: Added some translation + links + formating
    
    * fix indentation
    
    * improve mobile view

[33mcommit 42da77ab6e2f1635f07f1f6ea5495baaf2780c30[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 19 21:16:48 2017 +0100

    update deps and locales

[33mcommit 670b63b1149b1745f3517d9a25457fb3f68874c0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Nov 19 00:30:42 2017 +0000

    Add dev keystore

[33mcommit 1118b90e3b0ed28f4acb0dc68c682ed6b2631dce[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Nov 19 00:24:57 2017 +0000

    Don't .gitignore google services

[33mcommit 9692e2859752431bc5cda1169b948abf8520e02e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Nov 18 23:42:03 2017 +0000

    Fix typo

[33mcommit 39a1289a8f80f6fdccc8c04bbc617fdbccca5928[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Nov 18 22:58:24 2017 +0000

    Add build docs/keystore/config

[33mcommit 2f5a1f4bd5754f895efa4f218d1a7dd8712525ee[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Nov 18 17:21:33 2017 +0000

    Clear subscription tokens before updating

[33mcommit 48048971d7b809929505e8afa74b61371fc0c018[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Nov 18 17:16:05 2017 +0000

    Full page reload if token is invalid

[33mcommit 3bf6a2896a3f6f9f03423a73e097a460ea4d4086[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Nov 18 13:35:39 2017 +0000

    Accept cordovas newline change

[33mcommit 323c92d02c8d5a3d201acc3a1ab1c8be626f22e7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 22:05:41 2017 +0000

    Throw error if using getToken() outside cordova

[33mcommit 41e3358dc141bbdfb93f9a068827d2ce0a4fdc05[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 22:03:46 2017 +0000

    Don't specify cordova as dependency

[33mcommit 0f072300b43773d23ccbaecccd8ffc9be76965a6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 22:03:23 2017 +0000

    Remove invalid script

[33mcommit cb0074701cb513e3e35147e29f249bcc5cc2889e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 14:47:28 2017 +0000

    Send auth token using websocket protocols

[33mcommit 94aed55fa5b66aedca41f21273088b4cf4253bd0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 14:46:05 2017 +0000

    Update cordova config, add logo

[33mcommit 862d516d36a51d287da59483a4f70c765c772805[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 14:45:43 2017 +0000

    Add fcm docs

[33mcommit bfd4a37825b2196d19439a9de35ad38e343565d5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 02:09:44 2017 +0000

    Define global CORDOVA=false to fix tests

[33mcommit b411c66e0577bcc4805534bae93662ff90332e17[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 02:03:00 2017 +0000

    Make cordova stuff work nicer :)

[33mcommit 825df517a9ff148db06e19153987bd58a743fa8f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 02:01:41 2017 +0000

    Add initial mobile/android docs

[33mcommit e0e6d701a53682936098882d7a7f1f93aa4a7714[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Nov 17 02:01:17 2017 +0000

    Switch back to html template

[33mcommit ab95fd16ba4f8af012053ac54d9fb8b56cebad8d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Nov 16 13:11:42 2017 +0000

    Reorder .gitignore

[33mcommit 423b4295e41fa35acae4774c87a574047e36c090[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 27 21:17:27 2017 +0200

    Add initial cordova stuff
    
    Not fully working yet but quite a bit :)

[33mcommit 5ec8f86b5989951f652dcc90efb2e2a95b104b75[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Nov 18 20:31:05 2017 +0100

    Add redirects and tests (#773)
    
    * add groups routeError tests
    
    * add redirect for invalid user id
    
    * fetch user if not in list
    
    * add redirect for invalid store id
    
    * add user get service
    
    * better group redirects
    
    * fix tests
    
    * add hasValidationErrors property
    
    * switch back to 'new Error' style
    
    * fix tests

[33mcommit 44261dc2abd43cb5c12fa2599c957f4be8acba45[m[33m ([m[1;31morigin/ping-websocket-backend[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Nov 18 14:32:21 2017 +0000

    Ping websocket backend every 10s

[33mcommit 6cd4b8cc5eb0d3fc6cd877326ea0af47250aa207[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Nov 18 13:20:24 2017 +0000

    Fix pickup join/leave on group pickups page

[33mcommit 5626d2ac29aeaf580a27f42de5eae29ae7fa9fd8[m
Author: Tim Novis <tim.novis@me.com>
Date:   Sat Nov 18 10:44:59 2017 +0000

    Issue #764: Changes for review

[33mcommit 047a2b4bd2c52e1ab63c345c5ee7a7975c67e11d[m
Author: Tim Novis <tim.novis@me.com>
Date:   Sat Nov 18 00:36:32 2017 +0000

    Issue #764: Fixes

[33mcommit 6136276d779c33caaca72268bb52d16ad160e772[m
Author: Tim Novis <tim.novis@me.com>
Date:   Fri Nov 17 23:44:05 2017 +0000

    Issue #764: Limit min date for one-time pickups to today

[33mcommit f2f9d91d2b11608d749606fc9034ec7f761d03ea[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Nov 18 11:48:40 2017 +0100

    apply outside changes to edited values (#775)
    
    ...instead of replacing them
    
    Closes #771
    Prevents flickering of values while sending. Somehow it also fixes the spinner on q-button after sending.

[33mcommit fc4f5b9958fb31d9cbc16fdecf70e8753e4cf1ce[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Nov 18 10:16:45 2017 +0000

    Add locales to intl polyfill (#767)
    
    * Use webpack to handle intl and intl locales
    
    * Declare date-fn locale imports statically
    
    Allows webpack to only bundle the needed files and reduces the
    build output from ~190 files to ~60
    
    * Upload yarn lockfile

[33mcommit 77e61f901371261291f363e0aa8dde58bb6ec4b0[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Nov 17 18:37:38 2017 +0100

    refactor profileedit (#758)
    
    * refactor profileedit
    
    * try to fix the test
    
    * fix join-after-signup
    
    * remove __unenrichted from editMixin
    
    * remove ticks

[33mcommit 928d96a80de356b7ad2770e62911645e1e019fdb[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Nov 17 18:24:32 2017 +0100

    Small design improvements no. 2 (#768)
    
    * topbar: desktop-only -> v-if
    
    * Removed border radius
    
    * wallMessage: break long words like '------------------------------'
    
    * search: fixed route to stores, auto-close search after use
    
    * HistoryDetail: Added breadcrumb, Fixed icon with, changed design
    
    * MobileSidenav: localeSelect now has same color as other links & is moved to bottom
    
    * WallInput: lowered minrows to 2
    
    * HistoryDetail: changed colors to tertiary
    
    * GroupEdit: removed cancel button (was not doing anything before), removed headlines, improved icon-width
    
    * Removed generic-padding from settings page
    
    * Members is now on q-card (to have same margin as other pages)

[33mcommit e5fa40edd754018bd90441e97733f35df9c23063[m
Author: djahnie <djahnie@disroot.org>
Date:   Thu Nov 16 20:06:05 2017 +0100

    add new file

[33mcommit ab369a413ea7b204a90ac6962302cda77c3bdd0c[m
Author: djahnie <djahnie@disroot.org>
Date:   Thu Nov 16 19:26:00 2017 +0100

    add pickups button for mobile

[33mcommit a0b8c87aae83d40c25545b23ab47085356f321a6[m
Author: djahnie <djahnie@disroot.org>
Date:   Thu Nov 16 18:40:45 2017 +0100

    create group pickups

[33mcommit 531c0a11bb1c1ffc978077deaa2d7cccc881a28f[m
Author: djahnie <djahnie@disroot.org>
Date:   Thu Nov 16 18:07:59 2017 +0100

    move manage-button out of pickupList

[33mcommit 9b82efd73e4d7b3397ea615198c11d202cbd6f87[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 16 20:02:13 2017 +0100

    fix join-after-signup

[33mcommit 7fb20e52d8f7bd65e7613056130d66289a7992f2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 15 18:56:58 2017 +0100

    add localeSelect to mobile sidenav
    
    otherwise there's no possibility to change it on mobile.

[33mcommit c836255be6139b01d34b814d084c2c4982355223[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 15 17:35:03 2017 +0100

    make store name in wall clickable
    
    Closes #738

[33mcommit 1a5aa0d73706d4f8712eacc23d5ef0c53951512b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 15 17:30:26 2017 +0100

    add weekday to store pickuplist

[33mcommit c6c7fd24b7f192f7419d20abe5033a398bab3aa0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 15 17:18:52 2017 +0100

    add short day name to wall pickups
    
    Closes #756

[33mcommit 7d3ff4f06108b613abf25f6118d8fd2b6263e27e[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Nov 15 13:02:47 2017 +0100

    Refactor auth (login, changeEmail, changePassword) to use meta module (#755)
    
    * simplify auth module
    
    * apply statusMixin to login, changeEmail|Password forms
    
    * apply anyError scheme
    
    * add clearLoginStatus wrapper
    
    Internal meta API shouldn't leak out to the components
    
    * add back localeSelect test
    
    * improve test

[33mcommit db5b5936e347510d981eb7a508d4e96394498ec8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 15 11:10:40 2017 +0100

    remove unneeded karrot-docker file
    
    I committed it before by accident

[33mcommit 76dc0e1a5689c04d737d8b82b4837dfa8b65145e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 15 11:08:43 2017 +0100

    redirect with query param

[33mcommit 14ab1b08b9c2684266eb0153fcdadb6cd3a9df07[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Nov 14 22:28:21 2017 +0000

    Polyfill Intl via service if needed (#752)
    
    * Polyfill Intl via service if needed
    
    Fixes #748
    
    * Add build docs link to summary

[33mcommit c5970d0d1b9cef1dda9fa59f0ea2aa52b9834ffc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 14 22:14:11 2017 +0100

    add spinner while loading

[33mcommit 1603d68ccf311f73b9e48fa412d1c24d54368f56[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 14 21:34:25 2017 +0100

    rename formMixin to editMixin

[33mcommit 881a7c0f1168bd376f70f1a583528766232092a8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 14 21:33:49 2017 +0100

    split up formMixin and statusMixin

[33mcommit ab3a3625dc23b06be77ab76187f5cf21ed940fe8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 14 21:27:13 2017 +0100

    adapt related files

[33mcommit 4102a6a15201ce3407e807164815005071e71bd9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 14 21:26:49 2017 +0100

    use statusMixin for invitationsForm

[33mcommit 7b6d4eb598a2152dff2e24f03a56a5e0d02fce98[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 14 21:26:15 2017 +0100

    apply withMeta

[33mcommit fa7ca12fa4a30eb0d612605d48b67266d1a40557[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Nov 14 19:51:15 2017 +0000

    Detect if keyboard is open and hide mobile nav (#753)
    
    * Detect if keyboard is open and hide mobile nav
    
    Fixes #731
    
    * Switch size calculation method
    
    * Assume size change >150px is keyboard
    
    * Disable devtools warning during tests
    
    * Renamed keyboard plugin and added tests

[33mcommit ed9af251993ed4d9b5988bde0fa5b75e9341f168[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 17:07:08 2017 +0100

    UI only limit to 500 characters

[33mcommit 9deeb817a0f7a78e192278103707dbe9921df762[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 17:00:36 2017 +0100

    fix textarea autogrow
    
    only render pickupEdit when it's shown
    my guess is that QResizeObservable (used in q-input textarea) doesn't work when it's hidden.
    Ideally, q-collapsible would do v-if instead of v-show.

[33mcommit caadaf1f00d2a183f6be26d7326b01da48b60e23[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 16:58:53 2017 +0100

    allow multiline (without limits)

[33mcommit f78fb4e46919b98e9f4c517ae48cfa2c42f549b6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 16:58:32 2017 +0100

    remove grow limit of textarea

[33mcommit dcd475dba286d65f6bf5c81d5dccfec04f711005[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 14 18:56:57 2017 +0100

    remove settings test
    
    it's mostly a wrapper now

[33mcommit f37caca3972d5dc66cc8041052bda987724d85f7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 14 18:25:14 2017 +0100

    hotfix: add missing dispatch

[33mcommit 48451d0376f383b90fbdb0442449950cc98abd5d[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 14 18:10:46 2017 +0100

    add route error page (#727)
    
    Instead of redirecting to /notfound, keep the same route and switch the router view with the error page.
    Can show custom messages (and perhaps more complex components via slot), controlled by vuex.
    
    Part of #638
    
    * add route error page
    
    * translate in template

[33mcommit ebac1534679d4a528f48d0298a6d3b257ac20424[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 14 17:56:53 2017 +0100

    Remove language select from settings
    
    #669

[33mcommit 3ffc8ec8bd78490563ba129cc921dd6da7551955[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Nov 14 12:54:07 2017 +0000

    Rationalize vuex requests (#722)
    
    * introduce helper for request states
    
    * use action with callback instead of createRequestAction
    
    avoid namespacing issues when handing through store instances
    
    * use destructuring
    
    * use is(Validation|Request)Error functions
    
    * use initialState to clear all
    
    * try out for pickup join/leave
    
    * Add test for creating vuex meta modules
    
    To enable safer refactoring
    
    * Clear request state incase of other error
    
    * Fix object spacing
    
    * WIP: trying out another concept for it...
    
    Still a bit messy, some commented out stuff, not implemented in
    many places properly.
    
    * Use new meta status for pickups/groups
    
    Pickup series is left out for now...
    
    * Set productionTip=false during tests
    
    * Make unhandled promises more annoying in tests
    
    Before there was just a log message, not entirely sure what we
    get now, but should complain louder
    
    * Update yarn lockfile
    
    * Add initial docs about forms/meta
    
    * Remove commented out line
    
    * Fix a few form docs errors
    
    * Remove commented out line
    
    * Remove outdated docs in comment
    
    * Remove commented out code
    
    * Return result when mocking an action
    
    * Toast for all response errors except validation
    
    Not actually sure if they are all server errors actually, but
    they are at least response errors, and nothing else will do
    anything about them so we should show a toast
    
    * Use new vuex meta for pickup series edit
    
    * Add trailing comma
    
    * Create formMixin use in PickupEdit
    
    * Use formMixin for pickup series edit
    
    * Fix pickup series edit test
    
    * Add initial docs for formMixin
    
    * Return action result or false if validation error
    
    * Check for validation errors

[33mcommit e7c4e8b36b2a32f9c7097b22a42e472cdc4d7b02[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Nov 14 09:18:20 2017 +0000

    Trigger route param actions before route
    
    Fixes #750

[33mcommit 9f4859a39a3e5acbf9b4c545fdd0061e25b1c117[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 20:53:19 2017 +0100

    update german

[33mcommit f2303d5711abf3d2ac3bfe82ed0a735ffaef4fdb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 20:45:50 2017 +0100

    update locales

[33mcommit f3f52d1d484fc0aa522d940d5b2c2ba2bd62e9d8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 20:06:34 2017 +0100

    make v-if more forgiving

[33mcommit a75d6a3f16eed3a7972a88c9182e42a8162d8c25[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 19:45:03 2017 +0100

    make timezone validation more lenient
    
    Closes #744
    at least according to https://github.com/monterail/vuelidate/issues/176#issuecomment-325928167

[33mcommit 13577295b6ca50e0cc55e84e1f57b54e90a104d1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 13:28:48 2017 +0100

    fix sidenav opener
    
    Closes #735

[33mcommit 4afe3e4d4f487d082e47878975f3ee89f77c4f01[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 17:39:25 2017 +0100

    hotfix store pickup list
    
    selectGroup needs to run before selectStore, otherwise the pickup filter gets cleared
    
    Closes #746

[33mcommit 969f2efeb03cf8ac95fe8050eec38df0d8e2fac3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 15:08:30 2017 +0100

    set email only if user is loaded

[33mcommit c340c41fceef0a04174dc01f01994f4e673955f5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 15:07:09 2017 +0100

    check if roles are loaded

[33mcommit a9f5a8c4c091dd8663dccb0091f08a1f9907710a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 13 14:54:52 2017 +0100

    fix historydetail UI
    
    closes #736

[33mcommit a8c5265f68d7fa6dda0b4bce308eb1dd041396ff[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Mon Nov 13 13:03:11 2017 +0100

    store status (#681)
    
    * storeStatus: store edit dropdown & getter for all statuses
    
    * storeStatus: add colored icon to SidenavStores
    
    * storeStatus: moved logic to vuex-store
    
    * statusObj: sort by status & hide archived stores
    
    * storeStatus: added status to StoreCreate
    
    * storeStatus: colorized markers
    
    * storeStatus: hide archived stores
    
    * storeStatus: don't show pickups for archied store
    
    * storeStatus: confirm dialog for store deletion
    
    * icons for store navigation
    
    * icons for group navigation
    
    * added wall to group navigation
    
    * Add missing imports, fixup html
    
    * Fixup tests, and i18n, and other stuff
    
    * Show store status on mobile, reuse StoresList
    
    * More consistently named StoreList var

[33mcommit fe74cf5b9914eaa8d110cd950c72f657e2c41dbb[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Nov 13 13:01:03 2017 +0100

    Add metadata to index.html (#734)
    
    * make tags self-closing
    
    * add preliminary metadata
    
    * undo self-closingness

[33mcommit 7338226449ef64d72ba713a8f80bf3e4d4902556[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Nov 13 09:35:05 2017 +0000

    Import missing components

[33mcommit 960eca80627eb3323106cabfc8186b888d95dee9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Nov 13 09:32:11 2017 +0000

    Fix for browsers without navigator.languages

[33mcommit 8514b3fca1a0b19da95ee2b151c564219f310f17[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Nov 13 09:29:18 2017 +0000

    Don't fetch entire user list on auth/user update

[33mcommit 0011f6d4c08e2b5992e8329b5a60291c72144bf9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Nov 13 09:13:23 2017 +0000

    Simplify dateFns locale data handling + add map
    
    Previously cached it internally, but the import() gets cached
    anyway.

[33mcommit 9b527375ecc09547dde3943594a8384d49c0a152[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Nov 13 09:08:42 2017 +0000

    Prevent switching back to english whilst loading

[33mcommit 038a8e4fd7d409d7eb7049d8c047ab75bb666422[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Nov 13 09:05:33 2017 +0000

    Fix zh locale

[33mcommit 819fe53cd8dab8e0c31bf8173eef1f487da72bd1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Nov 13 08:44:25 2017 +0000

    Make date as words reactive (#733)
    
    * Make DateAsWords reactive to locale change
    
    The main part was using new Vue() to create a reactive object
    
    * Rename to lower camelcase
    
    * Make DateAsWords reactive to now
    
    We update every 10s, if there are a lot of things on the page
    then at some point it could be ineffecient, but should be fine
    for now
    
    * Fixup date related tests
    
    * Switch to traditional chinese from simplified

[33mcommit d97336a7515a9e535ba3f31ee5f11ddf177eae19[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Nov 12 18:15:35 2017 +0100

    Improve wall ui (#723)
    
    * make wall message look more like messages
    
    * embed wallinput into q-list
    
    * fix ctrl+enter send
    
    * remove unneeded element
    
    * fix separator
    
    * remove message icon
    
    * use whitespace better
    
    * unify wallinput with wallmessage

[33mcommit e748d501d6fe657310690226727626cbc4b38ede[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 12 17:10:55 2017 +0100

    upgrade deps

[33mcommit 378be09a10d66af76504c948fac40b7b71f965a5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 12 17:05:27 2017 +0100

    prevent full-page submit
    
    Closes #724

[33mcommit 9c3347b0943d6918536f687ff19aea5d9a24ea40[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Nov 12 13:59:56 2017 +0100

    add slightly improved history detail view (#719)
    
    * add back better history detail view
    
    * WIP: try route guards for vuex-connect
    
    says "this is undefined", but it's exactly the code from the vuex-connect readme.
    It's getting late and battery is getting empty, so will stop here
    
    * more one-liner getters
    
    * clarify fetchById
    
    * fix route update handling
    
    * remove unneeded connect.js file

[33mcommit bdd7326c8edcc4dbbd017b994278a0223fe9d0a6[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Nov 12 11:07:50 2017 +0100

    Add end-to-end tests with real backend (#718)
    
    * add real e2e tests
    
    * fix submit in chromium
    
    * add test for signup flow
    
    * set up ci
    
    * use different image for e2e
    
    * try using docker-compose
    
    * avoid permission denied
    
    * actually load docker config
    
    * run docker-compose in background
    
    * Revert "run docker-compose in background"
    
    This reverts commit 6cdbb79279d3aad32487cef00fb77986f74f49d7.
    
    * Revert "actually load docker config"
    
    This reverts commit 197424354f7d30ff10514449eaa3696152040ca6.
    
    * Revert "avoid permission denied"
    
    This reverts commit 85731f2e05febf5516a7eac25ffab59b53071882.
    
    * Revert "try using docker-compose"
    
    This reverts commit c6d41a3003014290ffa6fbb940624c515a63c1f6.
    
    * use node image
    
    * use some alpine image
    
    * use different image
    
    * use another virtualenv approach
    
    * try another virtualenv command
    
    * install another virtualenv package
    
    * use python3
    
    * upgrade pip
    
    * use utf8 for click
    
    * install python3-dev in image
    
    * set PG_HOST
    
    * add redis
    
    * add better connection test
    
    * run on saucelabs
    
    * remove test skip
    
    * test on two browsers
    
    * refine browser conf
    
    * speed up circleci
    
    * try fixing yaml
    
    * fix yaml?
    
    * fix more yaml errors
    
    * persist e2e workspace
    
    * need to duplicate python3 install for now
    
    * forgot to activate virtualenv
    
    * exit with error if test fails
    
    * fix test
    
    * use env/bin/
    
    * use only node image for e2e setup
    
    * add documentation to wget commands
    
    * add comment to list-all-browsers command
    
    * use await in testcafe.js
    
    * remove debug message
    
    * run after approval

[33mcommit cd6170ab096c0ad319a863f61cab1869649e3b4b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Nov 11 15:12:43 2017 +0100

    Disable pickup delete if pickup isn't empty
    
    I tried to add a tooltip to explain why, but it didn't show on disabled buttons
    Closes #721

[33mcommit c6e9f7546b5173b607cd2f6a515d5f32de3d226b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 19:18:07 2017 +0100

    allow removal of pickup in series

[33mcommit 4ad18489c7e69f9f87f362b02abb58aba28ba7e9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 19:17:05 2017 +0100

    add remaining strings to pickupFeedback
    
    it's unused right now, but will come for sure

[33mcommit f288d346e9ecdc77bb53eaa60f375e051aa28c36[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 19:10:19 2017 +0100

    improve translation of pickupedit/manage

[33mcommit 93a1be3c4d2f832e6ab7963f7dba218c146147a0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 18:40:09 2017 +0100

    use self-closing <i> tag

[33mcommit a68d33690344adbdba5ad4c6a736c762d877995f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 18:37:12 2017 +0100

    remove button.submit

[33mcommit 39907da7d8f251ec1e24fb0a05dd171faa01d9c0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 18:35:20 2017 +0100

    use "more options" as subtitle for vertical dots

[33mcommit 42bcc962fb307215cf88e5b3642855f8f1806f9f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Nov 11 14:43:04 2017 +0100

    use email parameter to prefill signup form on invitation accept

[33mcommit 82fd29f361c517cbe44836b044d2fdda1c01cba7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 20:03:32 2017 +0100

    move to karrot.world

[33mcommit 08d33ca0bc752f055ace4f13e58871e99c04faa2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 10:25:06 2017 +0100

    remove hover from wall

[33mcommit 90fb801ecd53ac0619f04615bc63d44165725f2b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 10:20:00 2017 +0100

    upgrade deps

[33mcommit 76f3572af7531215a10e69cf7e9b5c715a02d4e4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 10 10:18:52 2017 +0100

    update deps

[33mcommit fcc2457062f73c458ccaf3ab343a06bb672aff54[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 7 11:57:56 2017 +0100

    Remove maxHeight from textarea input
    
    Closes #702

[33mcommit 10a3169e0c88d3b0927b1326a5e6a4f723b054c3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 7 15:59:11 2017 +0100

    update German locale

[33mcommit f1edb84ee08d83d22f8afbdb9ddcb7794922e78b[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 7 11:30:33 2017 +0100

    add changeEmail component (#712)
    
    * add changeEmail component
    
    I moved the verificationWarning closer to changeEmail in settings
    
    Closes #698
    
    * show verified e-mail during change

[33mcommit 8ed99fdd4142fc7a2e6de9f0096a89e5a4e35c44[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 7 11:17:45 2017 +0100

    Disable Sidenav on tablets if logged out (#714)
    
    * Disable Sidenav on tablets if logged out
    
    Closes #708
    
    * use v-if instead of left-breakpoint

[33mcommit a80bf9efb4975c38b5c7027713fda69cedc1c384[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 7 11:08:04 2017 +0100

    add date to history on mobile (#716)
    
    Closes #706
    
    * Include date as words on mobile history view

[33mcommit 24d6c8f003cd79499a6d76da04f43a0b5c96c33f[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 7 09:05:48 2017 +0100

    use jstimezonedetect on group create (#707)
    
    Closes #704

[33mcommit d2ebb31bcc39f520052e6d8eb286a716e233f434[m
Author: Lukas Gebhard <lukas.gebhard@gmx.de>
Date:   Mon Nov 6 20:43:45 2017 +0100

    Backend Beginner's Guide: Language and style improvements

[33mcommit 009103ffc55b68327475b511629884f76922e3ea[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 6 15:24:22 2017 +0100

    use new /api/auth/user/ api

[33mcommit a986d6b32db34c17764dd47db2023e2e62dff8d3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 6 09:44:31 2017 +0100

    don't trigger related loading actions if not member of group
    
    prevents currentGroup to be saved to backend

[33mcommit 501cf95179815ed5894bcbf8281dc734d1aae7d3[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Nov 6 09:34:00 2017 +0100

    Convert and update locales (#705)
    
    * finally convert angular spelling to vue-i18n
    
    * get updated locales from transifex
    
    * remove angularToVueI18n hotfix
    
    * add czech, even if not translated very much

[33mcommit f3578e420f8ecc95303cc9bc9f637e134b6cd03c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 6 09:17:07 2017 +0100

    add localeSelect also to loggedIn topbar
    
    makes it easier to discover & test

[33mcommit 4d0411f53bef912df250d95db1193529e51f2123[m
Author: Rene <HarryMillerMail@googlemail.com>
Date:   Sun Nov 5 15:59:56 2017 +0100

    Display wall/history dates as distances in words (#697)
    
    * #311-today-tommorrow fixed
    
    * #311 load locale date-fns on-demand, tooltip
    
    * #311 add data-fns with yarn
    
    * #311 use jest.fn() instead of .genMockFunction()
    
    * #311 tool tip compare only date / CircleCi failed

[33mcommit 318d6b6af80ee641d726f485a73f2a9d75252e4c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 5 15:55:03 2017 +0100

    remove duplicate fa class

[33mcommit 443946518b6de697b429757baecdfe94208261d6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 5 15:26:14 2017 +0100

    load cabin sketch from node_modules
    
    Closes #701

[33mcommit 9931cbe13b6c855332a76f23ee02919871b275fc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 5 15:21:35 2017 +0100

    fix back button on notfound redirect

[33mcommit 9dab68cac58a774aeee440c020197712fa61b179[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Nov 5 11:21:56 2017 +0100

    i18n cleanup, first round (#699)
    
    * use single quotes for translation markers
    
    * use form namespace
    
    * translate 404 page
    
    * cleanup locale file, first pass
    
    * add script to discover potentially unused messages
    
    * rename form to validation
    
    * set shebang
    
    * make hacky script more pleasing

[33mcommit 5fb004deaa5772d039ea9b9a3eca11c7dd73385a[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Nov 5 11:01:10 2017 +0100

    Add mobile options menu (#695)
    
    * add groupoptions to mobile
    
    * add storeoptions to mobile
    
    * show group navbar on all group pages
    
    * replace mobile|desktop-only with $q.platform.is.mobile
    
    * hide sidenav on mobile again
    
    * hide tab underline if on unrelated route

[33mcommit 760ab23032f5ad0e8bf3b2d5e8281035a330ceb3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 2 17:31:55 2017 +0100

    add warning before joining a group
    
    Closes #675
    
    Could be a dialog, but I found it fiddly because the button didn't stop spinning after cancelling the dialog

[33mcommit efbe859f4effc652c6abae6b530909c099b11a5c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 2 08:27:31 2017 +0100

    add backend introduction

[33mcommit a7d5286f012875f98680afe335505818f45d733b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 5 08:04:33 2017 +0100

    upgrade deps

[33mcommit f2bd6a0c47ba38398e22651f0a425f04fadb08fa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 5 08:02:40 2017 +0100

    update deps

[33mcommit 1927b0d8dec983ea87b305c917987a00b72002d3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Nov 4 22:08:38 2017 +0100

    Remove vuejs theme as it includes ads
    
    Maybe we can make our own theme in the future using some of the
    stuff from the vuejs one

[33mcommit 0cedc322e5b0a10e4b4fe6ee67f847e84964e7a3[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Nov 3 13:16:39 2017 +0100

    Tabs -> changed some styling

[33mcommit dd3eea549424abef7ab31e5b69129ea833f38b88[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 2 20:19:02 2017 +0100

    apply markdowninput field

[33mcommit b63d7e7362f9a14af85afed0e9569748d0d36b9b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 2 20:16:53 2017 +0100

    add markdown input wrapper

[33mcommit d3d54be298f52a2a190ab9410cfa7cc37af48e3c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Nov 3 11:44:35 2017 +0100

    Small design improvements (#689)
    
    * Empty pickups: Hide on default
    
    * Fixed wall-messages margin
    
    * topbar: Removed carrot on mobile
    topbar: Fixed fontsize on mobile
    
    * Fixed footer margin
    
    * fixed footer email link
    
    * UserProfile: Map is not overlapping history anymore

[33mcommit 2446abc80a1dacde7aace50341566bc7dfe84beb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 2 16:50:23 2017 +0100

    save currentGroup to backend
    
    Closes #667

[33mcommit 854a58eaaadf2e2c87f086308d7ad7cb51703c52[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Tue Oct 31 16:00:13 2017 +0100

    manual HistoryList wrapper (fixes #678)

[33mcommit 4934d4e40cb22c88351427feec436ac053a75510[m
Merge: 3962b99f 6d1312ac
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 15:47:16 2017 +0100

    Merge pull request #686 from yunity/add-translations
    
    Add translations

[33mcommit 6d1312ac92c359dcbfc25830d47660fbe65885ec[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 15:44:56 2017 +0100

    Put github note in link text

[33mcommit f671222b9f082dbfefb2419851972464eb9e4c10[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 15:42:34 2017 +0100

    Correctly refer to $t

[33mcommit 3962b99fedbdc4dc0b95cd602e5dbab29bf1ca62[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 31 15:27:36 2017 +0100

    fix fullscreen map

[33mcommit c0f83f80ccf9b29fe51a6dc52441c328c67956e8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 31 15:20:13 2017 +0100

    highlight links in alerts

[33mcommit 20687a30af4e2a5ce49e27c7bcf17c8211fe6a40[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 31 15:16:56 2017 +0100

    use interpolation for login message

[33mcommit 408b00c12b21d8894367946b305ab5447eaf2421[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 31 15:12:06 2017 +0100

    add historyList back to storybook

[33mcommit d2f47ec4e44ec3b9233e440b1a70a750d9f4842c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 31 15:11:49 2017 +0100

    remove old unused historyList component

[33mcommit 1e6d01990ac6d0ff54dd416bc4a9a0a6f4e5f392[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 31 14:50:24 2017 +0100

    pluralize num_members

[33mcommit 3cca83f946fcd40b6f23e5ba57e969d5f0d67f70[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 31 14:45:31 2017 +0100

    add missing messages

[33mcommit 07e8fdbc3b21ab9f5e66b4dd76ddb9e5bc1c40b1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 31 14:36:01 2017 +0100

    add script to produce foo locales

[33mcommit 30ac6530260bbaa475c3da958df121a6c1fcbc86[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 13:32:05 2017 +0100

    Fix edit link and remove stupid sharing icons

[33mcommit 1c69f2d9dcb2c574897445318c6f3ee484e42ce1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 13:17:25 2017 +0100

    Build docs before deploy

[33mcommit def7ea661444a4ee7700cf386d5c56cbda1fc452[m
Merge: a9bc53c1 713de264
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 13:15:52 2017 +0100

    Merge pull request #684 from yunity/add-dev-docs
    
    Add docs

[33mcommit 713de264950bae223456124e4506f5d6f9960244[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 13:13:02 2017 +0100

    Add docs link to slack message

[33mcommit a0b6dc92aed8a71d5411b42e6f5702e71427b086[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 13:04:57 2017 +0100

    Add build-docs build job

[33mcommit eb754b1e85d2e3c50cd98ed7f633f7889152e34e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 13:03:06 2017 +0100

    Build/deploy docs

[33mcommit aadc8350576b8c5406e4ca2b0925d5d3d511778e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 31 12:56:52 2017 +0100

    Add initial karrot docs

[33mcommit a9bc53c12b264a43d2b36f00a9f7cee75e912bf6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 30 20:01:10 2017 +0100

    don't try to join group if already member

[33mcommit 44ee87943d385f30ca598a5c62098981d2fee661[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 22:37:00 2017 +0100

    switch to not-yet-enabled groupsInfo API

[33mcommit 513cb95c0121777688e2d5254d85b31abca3f87a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 17:07:45 2017 +0100

    Fix test

[33mcommit c27cfcb3c9ce038fb7c8df78f6b368f03522cfdd[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 16:45:56 2017 +0100

    Load store list when available groups change
    
    with @tiltec and @djahnie
    
    (and @NerdyProjects is also next to me, although he didn't
    participate in this particular change, but I'm sure he was doing
    something useful, a couple of other people with github usernames
    were also in the room but they were further away and even less
    connected)

[33mcommit 87f0f53cfb9665ad41c56afe1646135d03aa6296[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 16:07:32 2017 +0100

    Update deploy script dev url

[33mcommit 6850450e5410e1aae02339a0f1db0d5259ad9de3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 15:51:15 2017 +0100

    Some more updates!

[33mcommit c0399d953277be7a1d797034fef2aab38aa1cd58[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 14:51:18 2017 +0100

    First round of roadmap updates
    
    Should more-or-less reflect reality, but need to collect some more stuff into it now...

[33mcommit 7b978be479b082519ae0f27bd4ff74459ff1b102[m
Merge: 04ecda45 bfa4b036
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 13:29:44 2017 +0100

    Merge pull request #660 from yunity/group-agreements
    
    Initial group agreement management UI

[33mcommit bfa4b0363c8cfc06412cffad91f7244a4dfc8d45[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 11:03:47 2017 +0100

    Don't show minor edit checkbox for new agreements

[33mcommit 2610a1cff5bbbc5e004454925be68912ff8996b0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 10:51:56 2017 +0100

    Simpler route to agreement

[33mcommit 480253136f807474d7beba2b3412af469356f107[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 10:48:35 2017 +0100

    Remove length validation, clarify tooltip
    
    Need to add validation messages, but also want to do it in a new
    way perhaps...

[33mcommit c786c800b54b4a466bbdacc7eca451d6eea9668f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 10:37:30 2017 +0100

    Refine agreement management
    
    Can now do major/minor edits :)

[33mcommit 088e23b4e278836a1ee6892d2fc0c006bf8db425[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 30 08:31:48 2017 +0100

    Minor group edit timezone changes

[33mcommit b7fca85f66340f97845a1b970bec1b233447d469[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 29 23:04:31 2017 +0100

    WIP: A bit more progress...
    
    Fixed previous error (I needed to watch for prop change).
    I think it pretty much works now. Perhaps need to add agreement
    deletion (would just set the group activeAgreement to null)

[33mcommit 1220206db3b69d9fd19bd45504f8d239ebb259f9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 29 22:51:44 2017 +0100

    WIP: Allowing creation of group agreement
    
    Sort of kind of works, except when creating an agreement we try
    and update the group to use that, but it doens't seem to actually
    set it even though the PATCH request works :/
    
    Ahhhhhhh, it's activeAgreement I need to set.......

[33mcommit 458f0cc1789ec806f568a1827098e85874c36763[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 29 21:08:22 2017 +0100

    Fix test, add membership info

[33mcommit 52f307c0ed6597ca572e4e9d77c7408faa412e06[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 29 19:03:44 2017 +0100

    Fix tests for to include agreements store

[33mcommit 33e61ec681d8a8e7e3c0a70ffb86bcae90a86813[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 29 17:31:17 2017 +0100

    Prompt users to agree to agreement if needed

[33mcommit f4877ec14181e4af9b9ceafbe401629d43e0c0e3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 29 12:51:04 2017 +0100

    Add agreements api

[33mcommit 04ecda4598f5037638c0e99f06287916a2270f0b[m
Merge: a72af92c dc47b7db
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 29 23:08:31 2017 +0100

    Merge pull request #664 from yunity/handle-stores-without-location
    
    Fix GroupMap if store or group have no location

[33mcommit dc47b7db999d84e55a95c2aea5782bfa7f4a7d3d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 22:56:07 2017 +0100

    remove withLocation getter

[33mcommit a72af92c188ca3bb232e1e9fa7742a508628aaae[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 21:59:14 2017 +0100

    add back roadmap file
    
    Closes #661

[33mcommit 2f08fdc8a9a3e7aee159bd51a13619b3d26afbec[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 20:14:07 2017 +0100

    fix map if store or group have no location set
    
    - if in group mode and no markers are available and group location is not set, show button "set group location"
    - if only group location is available, show low zoom on group location
    - if in store mode and store location is not available, show button "set store location"
    
    Closes #602

[33mcommit 6e52f2b0716b00db43d8f35f41d86e7bf1242e26[m
Merge: d403737a ac553008
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 29 20:13:29 2017 +0100

    Merge pull request #662 from yunity/move-getter
    
    move groups/activeUsers getter to users module

[33mcommit ac55300879932e9fda1742dab4d580fa7326df7b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 18:58:32 2017 +0100

    test if activeGroup.members exists

[33mcommit 6d09dfac6874dcecaa830c64ff38d976541fb073[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 18:45:39 2017 +0100

    move groups/activeUsers getter to users module

[33mcommit d403737a8945a34d7f5df194581e92ba3674e7e8[m
Merge: b5925772 8abff160
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 29 17:59:10 2017 +0100

    Merge pull request #659 from yunity/handle-wrongjoin-password
    
    return to groupInfo if group password is wrong

[33mcommit 8abff160827155cf55de04ccd38db5b6ed802e61[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 17:51:05 2017 +0100

    return to groupInfo if group password is wrong
    
    Closes #644

[33mcommit b5925772a857872669186d4a8fb3834e20f5d9f6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 16:35:46 2017 +0100

    return empty list if timezones haven't been loaded

[33mcommit fad441131f6d2b7985867ab126460db277f920eb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 16:33:36 2017 +0100

    check if source is String before rendering Markdown
    
    Closes #652

[33mcommit d1fab0c944d54aeed431ffd01a1b3154bfa76980[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 16:04:30 2017 +0100

    remove .vue extensions in imports
    
    Closes #626

[33mcommit b9eee9cf65763e0beb7939502dc7c6244b35c51d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 15:37:04 2017 +0100

    fix router-link hover color
    
    Closes #637

[33mcommit 0c9dc0fe59cac1082dc3eade3c20567917524369[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 29 15:17:53 2017 +0100

    allow more than two lines in wall messages
    
    Closes #646

[33mcommit a23b6d8250bf3270fd170a5007dc6e5a1334e653[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 20:00:54 2017 +0200

    Enable ie support

[33mcommit c9d4473eebf72f9510308e3d282b671311475ffb[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 17:06:59 2017 +0200

    Update docs

[33mcommit 65457953cee975091f19e18d5fe29381cb3e316f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 17:46:00 2017 +0200

    Add circleci link to slack message

[33mcommit 6d5d0f0e8923ec778c4da319144974f8ad3a28ad[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 17:35:56 2017 +0200

    Add newline in slack message

[33mcommit abb577f7764b42a8ab9436f7f5924f16df62ef09[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 17:32:29 2017 +0200

    Add deploy emojis

[33mcommit e5c08686690f2d70e6a46a4c81b40d90dff7af4d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 17:27:57 2017 +0200

    Fix bash appending

[33mcommit 78975209a12d96819bb92feeffa5ac3144639009[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 17:21:13 2017 +0200

    Fixup deploy script for dev/release distinction
    
    Mostly about the webhook

[33mcommit 58b38669d076965a8a48ecc852485b3ad3bcc86f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 16:58:41 2017 +0200

    Add .env file support

[33mcommit 468cfcb6f2b1fcabc53586ea48708a8cfa73e6bb[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 16:44:34 2017 +0200

    ADd --runInBand back in, removed in error

[33mcommit fe92d7dbd48568240e050c99116a219373d28f3a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 16:41:42 2017 +0200

    A bit more circleci reordering

[33mcommit cebfa05b9b42cc279584f60f8ba750b35b1d2966[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 16:40:32 2017 +0200

    CircleCI fiddling, and renaming

[33mcommit 29120a4214fbfb4b8431bf9d373c9096e7aefe2b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 16:34:39 2017 +0200

    Don't require storybook build

[33mcommit bea55305a51ab04a6182d55f6009f4e7598864aa[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 16:33:54 2017 +0200

    Fix yaml indentation error

[33mcommit f09df593cce51273808e258d0f18325969a21432[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 16:32:23 2017 +0200

    Move approval stage to after test/etc

[33mcommit 07a8f79d7977648e01d2bfd22833606edd9c141c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 16:28:28 2017 +0200

    Remove not-working tag deploy, add manual approval

[33mcommit ecdfb95ddd0169b39fd28560d85a32434e10d532[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 16:26:43 2017 +0200

    Remove circleci tag configuration
    
    Does not seem to work :/ Will revert to branch deployment for
    release

[33mcommit 0ebf1294603a6d1c3580300b790b148df24c1db5[m[33m ([m[1;33mtag: quasar-v0.0.7[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 14:09:40 2017 +0200

    More circleci config fiddling

[33mcommit 31ec1ca37e81389a9cdf4bb3cb9d9d0f1a597e98[m[33m ([m[1;33mtag: quasar-v0.0.6[m[33m, [m[1;33mtag: quasar-v0.0.5[m[33m, [m[1;33mtag: quasar-v0.0.4[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 13:48:23 2017 +0200

    Add tag filter to more jobs

[33mcommit 472b6fb03c7104d720de0f84cd8caf1f173164d5[m[33m ([m[1;33mtag: quasar-v0.0.3[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 13:42:18 2017 +0200

    Update dev branch in deploy script

[33mcommit 81a461beceaa2a8eb053ee5a493fed03be2b1d0f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 13:37:54 2017 +0200

    Upgrade jest/babel-jest

[33mcommit c00f345e970dd7baa2e9d858e0a95dc11b8e93dd[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 13:35:32 2017 +0200

    Add runInBand to option to jest
    
    Causes it to run in one process instead of spawning multiple
    Might help us with our test failures at the expense of runtime
    But we don't have so many yet...

[33mcommit 8cee1e3a2dcbab12b0b52c800478d71bbecbb1a9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 13:22:02 2017 +0200

    Circleci tag filter fiddling

[33mcommit e053f9bd0eb5dbf87c9b23e98b1a8de184bee047[m[33m ([m[1;33mtag: quasar-v0.0.2[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 13:18:56 2017 +0200

    Fix circleci config

[33mcommit 4401f1fb776319342b623026edbbaf1bc32b897f[m[33m ([m[1;33mtag: quasar-v0.0.1[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 13:16:32 2017 +0200

    Setup tag deploys
    
    Should deploy tags such as "quasar-v1.0.0" to app.foodsaving.world

[33mcommit ce3bc1a670bb1264e09ace967f20851660ec34b2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 13:04:22 2017 +0200

    Deploy master to karrot-dev

[33mcommit 152cecd6eeeb873792f641cf123863ce2073c0fc[m
Merge: c99e8e27 266ddafe
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 12:49:57 2017 +0200

    Switch to quasar

[33mcommit c99e8e27d538c3cae4a68fdd2ab33c9ef074f53b[m[33m ([m[1;31morigin/quasar[m[33m)[m
Merge: 0956975b 84f5864a
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Oct 28 12:43:58 2017 +0200

    Merge branch 'quasar' of github.com:yunity/karrot-frontend into quasar

[33mcommit 0956975b0ef6876a3d9e55e73bbfdf5960031945[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Oct 28 12:43:36 2017 +0200

    UserProfile: user object is never falsy

[33mcommit 84f5864a8ee21dac58ffd1a1e3099c5acdd1e234[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 28 12:40:34 2017 +0200

    Revert "show loading bar for each route transition"
    
    This reverts commit c3a09e3d3d4e79aed4fe5c7703590b6cd0da1a9a.

[33mcommit 886c6432267968e54ddbd5fb531ea23e72ccf26d[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Oct 28 12:00:51 2017 +0200

    store: removed tabs on desktop

[33mcommit 1741b15a87f48a498532bef2bb426081df0d357f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 11:48:54 2017 +0200

    Enable production source maps

[33mcommit 6356b2684f86d2593a3e70f76894f1ba095b7580[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Oct 28 11:43:43 2017 +0200

    history: further fix for loading spinner

[33mcommit e43acd65a422e081511641c6ece65ec350f7d2cd[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Oct 28 11:39:11 2017 +0200

    seperated user profile

[33mcommit c3a09e3d3d4e79aed4fe5c7703590b6cd0da1a9a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 28 11:30:11 2017 +0200

    show loading bar for each route transition

[33mcommit 944505d6fceaa3287b517832b30247678051e357[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 28 11:28:07 2017 +0200

    close popover after click
    
    need to use the native click event on router-links

[33mcommit 8c00dfb5059365dfb1407d49005bc44d14fb1f17[m
Merge: 86ed27a6 e1744e13
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Oct 28 11:23:24 2017 +0200

    Merge branch 'quasar' of github.com:yunity/karrot-frontend into quasar

[33mcommit 86ed27a6fe3388d6d0fe6401d8a09b66af3e22b3[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Oct 28 11:22:56 2017 +0200

    history: better fix for #650

[33mcommit e1744e131733e5a2a040a935bf68e59c9ea957bb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 28 11:17:48 2017 +0200

    fix tests

[33mcommit 492fe18bd347b2c4b221d6a6ed6aa3f18463ae08[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 28 11:08:14 2017 +0200

    remove unneeded store API methods

[33mcommit 0c21c4f95db486116d6ad9b6bd626a7461d67c9d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 28 11:07:52 2017 +0200

    fetch all stores after login, for history translations

[33mcommit 70ad461e15e43c98eb0ee15941da98ea252002ce[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Oct 28 11:05:21 2017 +0200

    history: should fix #650

[33mcommit 9b778e7cdd579a19806101f3827205fe4b1e6986[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 10:44:44 2017 +0200

    Fix user list refresh on group changes
    
    Now looks at the member list inside each group to do it
    properly

[33mcommit 252d9bb22364e230be8cec0520fcd1e57f9dff0d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 10:05:30 2017 +0200

    Add raven config
    
    Will be used in staging/production with the same code
    can override by setting RAVEN_CONFIG env var during build
    
    Closes #641

[33mcommit 0b91a78501d7fc4fd240f6922e8105b949254a21[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 09:52:06 2017 +0200

    Remove bullseye thing from group map
    
    Fixes #640

[33mcommit b3cf269fbae0a9598389632eaf365ec13f82ae03[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Oct 28 09:45:21 2017 +0200

    Update users list when groups change

[33mcommit 4754e7528f3ee5ffeebc3610234429294ed5331a[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Oct 28 00:32:32 2017 +0200

    RandomPicture: white text color

[33mcommit eff99409a71dfbc657f56c55b8b6f1d0aa4f78f9[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 23:31:23 2017 +0200

    KTopbar: fixes closing of dropdown menu

[33mcommit 267feb0168e033e4ac3c9c3290e882a9cb77929f[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 23:22:24 2017 +0200

    history: warnings fixed

[33mcommit 93e2ee0482ce543ffda342758b2c37eefb7301c1[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 23:13:30 2017 +0200

    KTopbar: added user name

[33mcommit 2336fa9a2eb3f93035e031755f29a5eb4b020d3a[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 22:07:53 2017 +0200

    rearrange sidenav elements

[33mcommit 573675b1732c2cfb1f32c66a6346988a1e94dfd4[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 22:02:57 2017 +0200

    history: use new component on store page

[33mcommit 1d712001f4b5bad1066bc1fec739138c19ead4cc[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 21:59:45 2017 +0200

    history: use new component on group page

[33mcommit cf43256cf61fdeef20478bd7cbe010df03aec38a[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 21:59:05 2017 +0200

    history: added swtich for odd/even stripes

[33mcommit 645110497ca0b233d9e968c8418ec2b9128deece[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 21:51:01 2017 +0200

    wall: move out QCard from history

[33mcommit adc86b2b71d83bcd60b5269199f64b731b93b4a0[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 21:32:50 2017 +0200

    history: fix loading

[33mcommit f7119f1c63a65058747530bd657208edf4a55a4b[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 21:25:17 2017 +0200

    history: use new component at profile page

[33mcommit 948aa0c737bd96e62e4151d475eeba696dbeebb7[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 21:24:27 2017 +0200

    history: store changes

[33mcommit ff62899e850a566422daeb905aa3f3c52c1aa8e5[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 21:18:39 2017 +0200

    history: created new component

[33mcommit c461648535363d84b631b50663665e3b64d4ca09[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 27 21:13:18 2017 +0200

    add underline to links in markdown

[33mcommit 09594f5420318efa5e7fd2f85aec294e6f87cf01[m[33m ([m[1;31morigin/quasar-release[m[33m)[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 27 18:41:39 2017 +0200

    show different prompt on first wall message

[33mcommit 1562149dbdc8110a2a6d4999477b64c7260fd184[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Mon Oct 23 14:34:07 2017 +0200

    Wall improvements

[33mcommit 266ddafe744728ecd08dd8e20edb0d04fd0e3548[m[33m ([m[1;33mtag: v3.1.3[m[33m, [m[1;33mtag: old-angular[m[33m)[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 27 15:42:14 2017 +0200

    fix lint

[33mcommit b745399d91be0fd55c818baf567ec1f61a078037[m[33m ([m[1;33mtag: v3.1.2[m[33m)[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 27 15:36:48 2017 +0200

    show new version hint

[33mcommit 6a54e0f6bb4427173cfd7969ce0356bbc091f9b9[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 27 15:16:04 2017 +0200

    profile: cleanup

[33mcommit b973ab6e2eb734d37e88e25ea73d3e0ad809ccc1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 27 10:15:23 2017 +0200

    remove jest in storybook

[33mcommit e1c4d50ec8f8a0fd59c55361a90dcbb40f8c1c7c[m
Merge: 84394db5 ba7aaedb
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 27 00:58:07 2017 +0200

    Merge pull request #633 from yunity/add-netlify-proxying
    
    Add netlify proxying

[33mcommit ba7aaedb49fbe2a24027d92e57313cebe64b3463[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 27 00:42:36 2017 +0200

    Getting closer...

[33mcommit 896b31eb0bf7c93f7cbb6c7be426ebfb5ee36862[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 27 00:39:49 2017 +0200

    More attempts

[33mcommit 51ed9ce6c60ac9fcf452db26162d66e58f457a56[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 27 00:35:38 2017 +0200

    Try guessing random changes...

[33mcommit 046c63d9b3ee2267140cfd2712f7dd3e4c60cb6d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 27 00:30:01 2017 +0200

    Remove trailing slash

[33mcommit 9dd4db06bb2ce4e89530e94f12f13d1f0ec36ff2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 27 00:26:55 2017 +0200

    Use netlify.toml config

[33mcommit 6356501622f36c133abaefdf47b4771596014382[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 27 00:22:03 2017 +0200

    Add netlify api proxy config

[33mcommit 84394db52de73fb16c2cd35ecc6f89bf2ef541db[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 20:08:35 2017 +0200

    enable spinning button for wallinput

[33mcommit 7b96f62ff45d26cf05fc27e3855876b0c0f2002b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 19:56:36 2017 +0200

    add spinning buttons

[33mcommit 22a0340d9677e160ce035e85b0b9b97f9452451e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 19:53:53 2017 +0200

    fix stories

[33mcommit 0f646a139f917478b791726af5817e50478f98da[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 19:46:38 2017 +0200

    fix test

[33mcommit 96f3fc85f0086cb2e469fa4c90fcebad234cf0a2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 19:43:05 2017 +0200

    add spinner submit button to pickup edit

[33mcommit 5b8fb14dd2ae02f9254115b818419fbc119914cb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 19:26:43 2017 +0200

    wrap pickupedit in form

[33mcommit 1c7edd56ef7f110b205977a727633b5664bc9783[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 19:19:41 2017 +0200

    commit outside of try...catch

[33mcommit 4cb59dc3a2c1ed224beb172491c676a634e29e3e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 19:13:45 2017 +0200

    don't show error after sending invitation

[33mcommit ef6ae6d02f87ad369b3a5d435ae881f379314484[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 18:57:19 2017 +0200

    rename serverError to requestError

[33mcommit 4a15351654d5446578191d8af4ab68a7e3ec3270[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 18:56:09 2017 +0200

    rename invites -> invitations

[33mcommit e198c2743df5f9c196b8075299f00efc3eb88bf7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 18:53:22 2017 +0200

    handle timezone serverError

[33mcommit 79c05eff69b9ea22861755a7f080411e172cf655[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 18:50:07 2017 +0200

    handle serverError in invitations

[33mcommit ab33e7b06b9eacce0f6e1361044ae3568ce9ae79[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 18:44:07 2017 +0200

    add serverError handling to passwordreset

[33mcommit 3e687f6fccdc49ab3ea301d0fb3682ffc53b0276[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 18:38:29 2017 +0200

    handle signup api error

[33mcommit ebd4848b6519560223e576152b85f1111b7baf51[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 18:09:32 2017 +0200

    fix tests

[33mcommit d28469905b7585091301930a53554f6b6a1b2c4b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 18:07:05 2017 +0200

    add serverError handling to groupedit

[33mcommit 68475dd43a55fff0148439701e5166fe717c8964[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 17:30:27 2017 +0200

    add server error handling to pickup series edit

[33mcommit d4efed7d10cf380017d639f43e5d22442cb20f37[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 17:06:33 2017 +0200

    fix typo

[33mcommit d1c28f921b1360b547ff2f13d39980c8471251da[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 01:11:48 2017 +0200

    add breadcrumbs for editcreate pages

[33mcommit 936cb3a236e2dfd7623779886a47ed41ec3492a9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 01:06:55 2017 +0200

    fix test

[33mcommit 9ab7cef868d281294aea062976d155e6c4a3c37a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 01:04:33 2017 +0200

    add title to group create

[33mcommit f7f66a55b0314b85ab8217d2893b27346150586b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 01:04:15 2017 +0200

    fix missing qcard import

[33mcommit 42a4ad11df284b6c3cb209785bf99113253ae8af[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 00:59:08 2017 +0200

    move title into storeEdit
    
    the CreateUI was getting too much for me..

[33mcommit 653f1af5607e31338443d193650adaaf4e97bf21[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 00:47:19 2017 +0200

    introduce onlyHandleAPIError helper (HOT! NEW!)

[33mcommit 13db01de084cae6db4695d5dd28e8579c6b30833[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 00:46:42 2017 +0200

    add prop another time #2

[33mcommit a2d162be1b3dbc2af06ac52f43aa0fbe0a43691c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 00:46:25 2017 +0200

    add prop another time...

[33mcommit 32738b0ab8f09b83613b53ed15328d3307d707d1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 00:08:58 2017 +0200

    move servererror getter into store

[33mcommit 1dfca94a297583f752670d89d8266892209f1911[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 26 00:08:30 2017 +0200

    move nonfielderrors to form bottom

[33mcommit 44cb1eed292beca16d539f3da2aa55b50b312e74[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 25 23:37:52 2017 +0200

    add story autodiscovery

[33mcommit 5251fe078441c1592fbeaf660787c57671181509[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 25 23:26:37 2017 +0200

    fix warnings in test

[33mcommit 00adb39b23e5a7ea3189089138ba3345776948bd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 25 22:40:58 2017 +0200

    fix i18n test

[33mcommit b5a279f4e18391db1141ffb44adf6567bca5ff52[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 25 22:32:34 2017 +0200

    remove unused store wall

[33mcommit 19e4e9c4c3e9e9b369075e9b71c620de13de5840[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 25 21:10:23 2017 +0200

    sort and refine localeselect

[33mcommit 3671652f5ffd31a5f268574dfed795f6e9836018[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 25 21:10:05 2017 +0200

    update deps

[33mcommit 5cdd3e28f378b56b29dfda8efd5f93dfb7cc70e8[m
Merge: 96406e61 94b26db1
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Oct 25 16:28:42 2017 +0200

    Merge pull request #629 from yunity/verificationWarning
    
    added verification warning

[33mcommit 96406e6169257135bf19a7ff2e21d42170262129[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 23 20:57:10 2017 +0200

    Improve store validation error rendering

[33mcommit 3b7c259664ea8a3bbde59b6e7bb6a3c9d5679f0d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 23 20:01:21 2017 +0200

    Add title/card for store create page

[33mcommit 821c78d8089495922ccd7d2ce1e299a67e6895a5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 23 19:28:54 2017 +0200

    Don't required old password for change
    
    Backend does not support it anyway...

[33mcommit 6fdab260d842ba3d7957288cc34919f910d60fb8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 23 12:51:54 2017 +0200

    fix wall fetchMoreMessages test

[33mcommit 0b74974cc4a302f759087821d2e668af4bbce7b7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 23 12:36:45 2017 +0200

    fix test

[33mcommit dc375b35862bf796bb6b0fd5c03ec84150503297[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 23 12:29:35 2017 +0200

    add api error handling to pickupedit

[33mcommit e0182f506696772107d789fe019acb1eccad7fba[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 23 11:29:25 2017 +0200

    allow removing location

[33mcommit cb823fbe1f5c4f9c519ffd2b83328b85af012ccb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 23 10:14:19 2017 +0200

    fix double submit

[33mcommit 85d9fc2f40937c5ccb3c60e4cc342fcd1a3d762f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 23 10:55:47 2017 +0200

    Empty/Joined Pickups: Fixed 'avoid prop mutation'-warning

[33mcommit 41813f59549563f5738fd38b71893bcb8e8c18d5[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 23 10:45:50 2017 +0200

    Wall: Added infinite scroll to wall messages

[33mcommit 94b26db1652cc874d09810dfd6e3ea32295d5ff7[m
Author: user <user@t440s.fritz.box>
Date:   Mon Oct 23 09:54:05 2017 +0200

    added verification warning & resend functionality

[33mcommit c693b8c0df84f27e1df7502ddede7e155ca3136d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 23 09:52:10 2017 +0200

    Added address to user-profile, updated todo-list box

[33mcommit 748b56a39f01ad861d543f69bbff7139afa8ff2c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 23 01:01:05 2017 +0200

    Made History Modal look a little bit more pretty

[33mcommit 10b4defa560cc34a224f6d384c2b5a4eb0f9ff6e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 23 00:23:25 2017 +0200

    Wall Notices: Improved <hr>

[33mcommit df9bd8f45cf71394f342f0808c4cb5d0c6fa99fb[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 23 00:10:03 2017 +0200

    Made EmptyPickups and JoinedPickups fold in

[33mcommit a0838b3a1ae781389d7c5ea9962398627e3e245c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 23:17:38 2017 +0200

    Fixed more storeLayout padding
    PickupManage: Put Headers on Cards

[33mcommit 6b10dd176a79f89115bd71e01affa8feee1af9a8[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 16:53:06 2017 +0200

    HistoryList Style Improvements

[33mcommit f152597551c0127afb1c16b0630798688cef4d01[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 16:39:56 2017 +0200

    PickupItem / Sidenav: Improved padding

[33mcommit 44a0bad1d22d01d362e2edd84fae95247ffa62e7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 16:16:07 2017 +0200

    Removed wrong indentation

[33mcommit 17afc1f5800403429a116fec9305920a8d5f5b0c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 22 12:25:05 2017 +0200

    send Accept-Language header for all requests

[33mcommit ccbe1ac3b9cefd0b463f6b0e6a91d1c120adee2a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 02:45:11 2017 +0200

    Styled signup warning

[33mcommit d39c85a857cdc13bbf550452d83b18900d81e043[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 02:37:51 2017 +0200

    Improved Wall style

[33mcommit 5b4c7dd7b93cfcc996fa5fb877cc0a162cd05c4d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 02:29:46 2017 +0200

    Store: Removed redundant headers, fixed margins

[33mcommit 0ca976cfd0f2515896b98a059689e8987a991854[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 02:15:35 2017 +0200

    Improved Store Description

[33mcommit ae733135c096f8d3ac119548e07f5d4b6c9fc23b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 02:04:24 2017 +0200

    Locale-en: removed another space

[33mcommit 5e88725d2d123a257ec26a0e67f87c45e69f5720[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 02:03:38 2017 +0200

    Removed spave from pick up

[33mcommit 36c2ed717d8b259c41d55176eeceee3f381978ad[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 02:01:10 2017 +0200

    Improved splash Layout design

[33mcommit 64ad059bdf57bca225bcda09307070a3eebd1419[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 22 01:26:38 2017 +0200

    GroupPreviewGallery: Added translation for logout-message, styled

[33mcommit b985a8988384686c097d81d918f1b780792392b9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 22 02:07:55 2017 +0200

    add localeselect to logged out topbar

[33mcommit b8e6b5a4a864df819ecc29e9b62cbf89281d88c6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 23:29:16 2017 +0200

    add beta warning on signup

[33mcommit 9975c51c79099b258cf33e4933ffe46f4380586d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 23:21:41 2017 +0200

    remove unneeded to do

[33mcommit a5171e1f501508d26b9c783c2d716a0ebb03328f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 23:18:17 2017 +0200

    upgrade packages

[33mcommit 2bb99f03ee43d69c7127cb0abed2d30f053674f8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 22:59:07 2017 +0200

    update packages

[33mcommit da063ebc4558bd38e19c6ae875f5072c9e4ab8e1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 22:39:47 2017 +0200

    fix wall test

[33mcommit fb70d3f1cc0d337c1f5ea0dfd847da5cbde38bbd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 21:50:13 2017 +0200

    refactor search store a bit

[33mcommit 23556ff40b8e28db11b22016009a370236135f78[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 21:47:29 2017 +0200

    move search logic into store

[33mcommit 0215829907379d70180a89849ebb7ea1c803b41e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 20:41:50 2017 +0200

    enable search storie

[33mcommit f78a1dbdfec03e81b2c8a5c3b150a31123958c99[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 20:30:18 2017 +0200

    clean up topbar code

[33mcommit c4eeb5808417bb4825ebbcff23d7eedc95f6e05d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 20:21:53 2017 +0200

    improve loading more wall messages

[33mcommit c49e04b15a0803f30c0d82d63cfd00bf73c11f8b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 20:00:56 2017 +0200

    translate axios errors

[33mcommit 17163394183ed5ee98431c55a9a29ba90bd04939[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 19:16:19 2017 +0200

    redirect if user is not member of group

[33mcommit b9e81582524573606fb89922dcbb4057818bd0fc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 18:40:12 2017 +0200

    shuffle edit forms around

[33mcommit f551816118984a75e5dec4fc350750a6ad4b2247[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 18:34:10 2017 +0200

    allow enter form submit

[33mcommit 27681dcab59571aca27ad93f630815e432f68142[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 18:09:03 2017 +0200

    show upcoming joined pickups in wall

[33mcommit eb361be61809fec29e2ced83f528b28f572f86dc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 17:58:51 2017 +0200

    fix indentation

[33mcommit 623a132e575eabb37e03ad5c5be3f4d49d7d5139[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 17:57:13 2017 +0200

    remove unneeded import

[33mcommit aa265caca0206c5b7cb2974fc3ac0c0dc9c3351d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 17:56:24 2017 +0200

    prefer @ imports

[33mcommit 2beb0aaf86b1403bada3f51aac580caf8bc0b239[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 17:52:22 2017 +0200

    always use v-bind shorthand

[33mcommit c8fee48e5f63c4a6a8351f434e2927cd306a67ac[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 17:48:43 2017 +0200

    fix indentation

[33mcommit 37d986ac9c4ee666a4a827bca0131039c56cfa1b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 17:44:01 2017 +0200

    add group create page

[33mcommit fcbcb8eb9489e271a23d511225f89ee272b78a38[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 16:56:01 2017 +0200

    rename isFetching to isWaiting

[33mcommit 9f5ab0a53c18aa5b016981819097bca87036c95d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 16:51:45 2017 +0200

    fix most existing stories

[33mcommit 74ba3d16b4dc3820865b4e6eebc32cb73bd3a9bb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 16:10:41 2017 +0200

    fix sidenav stores story

[33mcommit d352f31c0a9547ba154b27f038785f36eeb1b07c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 16:08:53 2017 +0200

    fix broken sidenavGroup story

[33mcommit c9f20985fd628e79cf3d41e03659032c366acaee[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 15:56:02 2017 +0200

    move pickupusers into pickup folder

[33mcommit 7e4a56c8f0717eac5808abf5c254a9637bc787d0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 15:49:12 2017 +0200

    fix broken setLocale after login

[33mcommit 50418bb49f3cb8ee2c45db7fa340cd0eac114f5c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 15:47:37 2017 +0200

    use currentUserMock for settings story

[33mcommit 6971520ed72e3908f7dd0b670ce4651a3335549f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 15:38:41 2017 +0200

    remove join/leave popup parameter

[33mcommit 9c4e044a22dc45de579786384aea38623f9c354e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 15:31:55 2017 +0200

    enrich users

[33mcommit db39ac7aab0d3801bf014dab7fb6800659660698[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 15:31:46 2017 +0200

    improve mockdata

[33mcommit cb3901b9357e833dc85024b3483954b348df7ee0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 15:31:37 2017 +0200

    rename ProfilesInline to PickupUsers, fix storybook

[33mcommit dde73551af19a9699c9e38e7081099978cc8c25a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 12:49:10 2017 +0200

    reduce vertical code space

[33mcommit 21bf39bfb9d84c1d8470adedcb9f92cb006e599f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 12:22:46 2017 +0200

    simplify some stories

[33mcommit 0b37bbf1ec378b7335c9220863ac9735523ee5a8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 11:20:42 2017 +0200

    fix loaders, convert stories to render function

[33mcommit 08935e999b59ba308f58366205efa61e46bc590e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 10:07:39 2017 +0200

    don't check locale again

[33mcommit 45192e5abce534eb61ac35ca6f52fc8f8f51a492[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 10:06:47 2017 +0200

    fix locale format

[33mcommit 91ffed6985da1202f405f55bf679a34c095a7b47[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 10:03:44 2017 +0200

    Revert "move locale loading into i18n.js"
    
    This reverts commit 15510d27d3afff75e44afc51b05b839be30a4a26.

[33mcommit 15510d27d3afff75e44afc51b05b839be30a4a26[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 09:41:19 2017 +0200

    move locale loading into i18n.js

[33mcommit 63c76cd0ead3a4445275f702e440838cc0185540[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 21 08:58:22 2017 +0200

    add storeEdit name validation

[33mcommit a7eb0bba46c0c5f06a0c7931aed471aa49dbcf59[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 20 15:46:34 2017 +0200

    add timezone validation

[33mcommit 03a7017d1ed75114df47477309be944365dbe437[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 20 15:32:05 2017 +0200

    initial vuelidation for groupEdit

[33mcommit ac282631594d133f8429c0fbbf48c12e962f0c58[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 20 14:53:17 2017 +0200

    add timezone autocomplete

[33mcommit 3318cf335dd4d3b0f434b08475971e4105c96afa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 20 14:11:55 2017 +0200

    apply initialState() pattern

[33mcommit eebf7b6cec38b472fe50ac6d917c01f402436126[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 20 14:01:13 2017 +0200

    fix initial loading of group members

[33mcommit 4469c890e6aefe10c68431283ed2aae2a58480be[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 15:11:15 2017 +0200

    index users by id

[33mcommit df27036f02936d2a42be2456837935f97c7928f4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:52:54 2017 +0200

    fix pickup enrich test

[33mcommit d9df5e17205aef27dbf0e27902d87e170cbee35c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:45:28 2017 +0200

    use isEmpty

[33mcommit c2ef4967041f81666e4deccbfd0d81479db4e7ed[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:45:04 2017 +0200

    enrich pickup with isEmpty and isFull

[33mcommit e8dc2c90cf4cb362e9fdf6d20297527a18695fc4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:30:01 2017 +0200

    remove unused function removeGetterMethods

[33mcommit e0704af1af8f2fc4e3000612aa7cd7c02f579bad[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:28:54 2017 +0200

    move store import into storeHelpers.js

[33mcommit 69accef4627e52aea8e9b1c8a3e69dedd8776057[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:20:54 2017 +0200

    sort stores by name

[33mcommit 739a4673a5dff1f7d417b6b55d83d48ceb5e8702[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:14:56 2017 +0200

    remove done todos

[33mcommit ab07bad560b87f17f0547d9192f1efaa06c6d4b6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:14:14 2017 +0200

    remove unneeded import

[33mcommit a39db5718f113ffa91e65df0a5840c4f5926fb73[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:12:23 2017 +0200

    implement group save

[33mcommit 0943a77d798931b20bb6306bcbdefffe8864d8d1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 14:05:31 2017 +0200

    add group edit page

[33mcommit f394fc10ed198a8e14dccd7b5b05305950bbe200[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 13:40:43 2017 +0200

    add store options popover

[33mcommit 2ae0f25d24dbc67eababcc2e7f709724029a2e1b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 13:29:54 2017 +0200

    fix test

[33mcommit fb50dda351ddae04af47d146a010acc34c608c4f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 13:19:26 2017 +0200

    enable group leave

[33mcommit 885e5f835e34537c45b04495b7d897c734e355ef[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 19 12:41:27 2017 +0200

    state management for store save

[33mcommit 07a19c3415bbb58cf92628561c6d423a77450bdc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 18 10:58:10 2017 +0200

    make store create work

[33mcommit 143833c046b6c56275ae7697f051a2dd8ed10d50[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 22:34:50 2017 +0200

    Use jest file extensions instead of mapper for vue

[33mcommit dcdcdf3f00f2f3127250d721226ba3870997f810[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 17 22:02:00 2017 +0200

    store create page

[33mcommit a21cd5183eb39d8cdebe9f6b850733670c194fc5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 17 20:28:41 2017 +0200

    fix test

[33mcommit 5f4af379538222498b3b0d80ee376894e6fd4950[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 17 15:48:11 2017 +0200

    let router plugin handle redirect after login

[33mcommit aad14df2586cbb5cb438b4a0ec738ba3cd374897[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 11:14:10 2017 +0200

    Ensure we retrieve correct data after logged in
    
    Previously we would not trigger the data loading after you
    login, only when you visit the page when being logged in
    
    It causes missing users list information such that the author
    details were not known for the wall message pictures (and plenty
    of other things I'm sure)

[33mcommit 22e49b4c6925aa1eb818ae659387046a074e4153[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 10:52:58 2017 +0200

    Allow login by pressing enter on login form

[33mcommit 2b825b924c4587a1e2d6bd4ed9c92130ce601b3d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 10:50:38 2017 +0200

    Fix errors if missing data

[33mcommit 58610820eed103f0004d11631779e6f2781febd5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 10:45:27 2017 +0200

    Add change password on settings page

[33mcommit 2fa29b0cf3d1a121f36c89e6c82158d99f1a6471[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 09:56:19 2017 +0200

    Move mockdata into test directory

[33mcommit 60efa857826c4e48fcbe789337d06ce727895cb8[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 09:50:06 2017 +0200

    Use mountWithDefaults in more places

[33mcommit a13c69945627e7588e7778615895403aab1e4f5e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 09:44:37 2017 +0200

    Add mountWithDefaults function
    
    Captures commonly used options for mounting, although not the
    store as that should not be a default

[33mcommit b298a44bcae1f9dac917a878e6d01a0b5c7476ef[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 09:40:50 2017 +0200

    Add profile edit test

[33mcommit 8d8ef0167e6b8c00b9a33b0bd10e1f1454e192a4[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 17 09:31:35 2017 +0200

    Fixup settings page story

[33mcommit 7dc284f844aef99ef951bcef85fcc1b55343f72b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 15 17:39:54 2017 +0200

    Fix settings test

[33mcommit 2d4808b2d7169f1948b3a24716b0e39faa5c1b47[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 15 15:03:21 2017 +0200

    dep updates

[33mcommit 089d4eb0dc0d7eb81168ecd20c60e3faf1fb71ee[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 13 20:19:11 2017 +0200

    Add profile edit form
    
    Currently cannot customize the marker icon so it shows a store
    icon for the user selection, hey ho!

[33mcommit b1cd3280739695c855961b8880182808bb6bab07[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 13 19:59:40 2017 +0200

    Fixup address picker storybook

[33mcommit 825d7c65568bd7e0b45000450690bde69188b3ee[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 13 19:59:30 2017 +0200

    Remove unused import

[33mcommit 34b92aa63564f69053d230fffbfb37bc31b8dd46[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 13 19:46:35 2017 +0200

    Remove unneeded store map code
    
    Now inside the address picker component

[33mcommit e8f50fe531afd662336f2a628c921e7173042966[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 13 19:46:21 2017 +0200

    Remove unused styles

[33mcommit 7286c6036e1ddcbaf639e684c5b9b57c1870164f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 13 19:44:39 2017 +0200

    Add map option to the address picker

[33mcommit 5120a670ef031d3036dd8e51b8645faf6146879e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 13 16:26:18 2017 +0200

    Add initial store edit form

[33mcommit b1969d9a01dbc3764a23daecd3c2b23d47aecd12[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 12 23:59:05 2017 +0200

    Add ability to delete pickups
    
    I made it so deleting series pickups is not available because
    I don't quite understand what the idea for this is right now...
    
    Actually, in general modifying series pickups is not clear to me.
    It seems quite useful in many cases (e.g. you know one week that
    the pickup is not available, or will be an hour later). But I did
    not think very much about the other cases, e.g. when there are
    already people signed up for it.
    
    I shouldn't be writing all this in here, but I am on the beers, so
    feeling chatty.
    
    I'm wondering whether to get another beer, but will it impact my
    coding ability? I'm enjoying the music and the mood and still got
    58% of my battery left. It seems I added some useful things in the
    last hour, so many more beer helps.
    
    Or will I go over the beer-productivity curve and become less
    productive.
    
    I heard this is disputed though.
    
    Lets finish up this commit though anyway.

[33mcommit 7c7c88d79838f1a10e629ff932c1f1cdceaf81b2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 12 22:39:03 2017 +0200

    Move create button to header

[33mcommit aac55f12765f3283585c3b68032dee44cdbbe4c6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 12 22:37:47 2017 +0200

    Add delete pickup series ability

[33mcommit b9c4831af8b3846fd54d021c7e3fbb771eb93800[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 12 22:23:55 2017 +0200

    Add ability to create series

[33mcommit aeb27a3a46dcd2c304072d4f2c74da926dc3a7e7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 12 11:28:13 2017 +0200

    Add pickup edit test

[33mcommit 417e89850535948d4617615896ffebfdba13cf71[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 12 11:24:17 2017 +0200

    Add pickup series edit test

[33mcommit babf1395ca8720415df4935ac65bfd6ebbd0a2e9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 18:01:29 2017 +0200

    Minor indentation change

[33mcommit 7aac942159a392575159a234b82dc1970b13a494[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 17:21:45 2017 +0200

    Enforce having at least one day selected

[33mcommit ba2e6b2c5cb778af79b652f36d91443d244fa8c8[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 17:09:01 2017 +0200

    Reorder weekdays to make monday first

[33mcommit 964f34ba24308dd56ece627a9cd80cdcc441f441[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 16:59:44 2017 +0200

    Make use of PATCH result to update state

[33mcommit 7ce896d15b54b70a4eb704a7ee409456d7a66f02[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 16:55:03 2017 +0200

    Reset pickup forms if underlying thing changes

[33mcommit 4ae03b82583d78d014b3db6d284b1d482dd4d4ce[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 16:36:52 2017 +0200

    Save pickups and series, a few other changes

[33mcommit 0bd9daf4cc11c779afaf0bd7490843f75857bfc1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 15:47:19 2017 +0200

    Tidy up pickup manage imports

[33mcommit 27250944b1bf300e16a47a0217e213f6624b81ec[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 15:40:11 2017 +0200

    Setup i18n properly for pickup editing

[33mcommit 54e6cce45381e4c2591b5b5a3a7644ad72bae274[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 14:35:26 2017 +0200

    Always display collector count, and set min to 1

[33mcommit 7893bb3bc60223fa1c9477ca964021d550c2b37d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 14:21:34 2017 +0200

    Fixed tests

[33mcommit ec487523e152f45758357b5a29ccd24267126291[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 14:13:06 2017 +0200

    Fix story for pickup series edit

[33mcommit 0ab06a073442e67ff7d20439be09cb70b67a3713[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 11 14:02:34 2017 +0200

    Add initial pickup edit forms
    
    They don't actually save anything yet, but you get the basic idea.
    Also want to rejig a few things around still... and needs
    i18n too...

[33mcommit f2eed22a4b5a34dcce55bfb7274e76ee3ced7813[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 23:29:49 2017 +0200

    Always show users on map if selected
    
    Before if you had a store selected and showUsers enabled you
    would not actually see the users

[33mcommit 47dc949c0885184fa95b3fb618de23143d834595[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 23:20:23 2017 +0200

    Show pickup series and one-time pickupe

[33mcommit ccd179faf996106a2484aaefd3d440fb90e72930[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 20:15:10 2017 +0200

    Add placeholder pickup management page/route

[33mcommit 708d19fa5805195c560ae6049d13c1eb0c38d51e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 20:14:21 2017 +0200

    Simplify router breadcrumbs
    
    Now combines them all in the router hierarchy

[33mcommit 80bcd55489a4bd17452e39aad117f14c0dfbfee0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 18:29:44 2017 +0200

    Clear selected store when leaving store pages

[33mcommit e1e2e56fa542738d01b45b7448dfa4bfd4749ba6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 18:12:43 2017 +0200

    Add router to UserMapPreview to fix console error

[33mcommit b0119364dd77c0805cb1266a9ef8ff683cc48c8a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 18:12:07 2017 +0200

    Allow selectable map markers for group map

[33mcommit c32a3c9cbc399d3c63bfc15a95758ba4a91edfe2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 14:37:11 2017 +0200

    Set showStores/Users in group map story

[33mcommit 453f3124a2451afe6d03ea85f4bb26644e2c4d5d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 13:47:54 2017 +0200

    By default hide users on group map

[33mcommit c9b93cbf6749574d20cd0995c85d758969015dc6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 13:00:50 2017 +0200

    Revert "No need to checkout during deploy"
    
    This reverts commit 1c0077e00290f2761866112060f0509dc1d9bbac.
    
    I guess I do need the checkout, not entirely sure why, but I
    have other things to be doing for now :)

[33mcommit 1c0077e00290f2761866112060f0509dc1d9bbac[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 12:55:23 2017 +0200

    No need to checkout during deploy
    
    Everything is already in the workspace...

[33mcommit 1fd33d07af1c087058aa475e6513bd037fe615c7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 12:51:58 2017 +0200

    Fix lint error

[33mcommit 547a2acdc314e7cba6381953de9d48729a71ec3e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Oct 10 12:25:28 2017 +0200

    Add settings page story and test

[33mcommit 76b734723fc5a87481968c2c1e7ed94f603fbf4c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 9 16:31:33 2017 +0200

    upgrade dependencies

[33mcommit ad6296fa199a71300ffa23b78168caf19224f3bd[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 11:42:20 2017 +0200

    Remove commented out stuff
    
    If you want a commented out section to stay there, add a comment
    explaining why :)

[33mcommit 6d8c3e4c6fb0256642dda4233308ed239a78d7d6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 11:37:23 2017 +0200

    Add Wall test

[33mcommit cc1da04851016c6e97806ac22d0e84dd48e2870c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 11:37:01 2017 +0200

    Name/class components for hooking into tests

[33mcommit d0280bb80a7b83188af5d4a94bd639a0f2f10f8b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 11:36:35 2017 +0200

    Fix default Wall prop values

[33mcommit bf2c59e7eb68570f4755e32d5eb9ce8b3237e381[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 11:36:00 2017 +0200

    Remove console logging in mockdata

[33mcommit 140d6295a8d58473e807acfae87f2080437b4097[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 11:35:39 2017 +0200

    Switch to npm beta version of vue-test-utils

[33mcommit ef7c67a844d172488160c47ad23e2de5cfdc3ab1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 01:50:32 2017 +0200

    Add users/stores back into full page map view

[33mcommit 4c2a58cd43bc676511d77aef18a613652db2847f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 01:17:38 2017 +0200

    Consolidate map rendering into StandardMap

[33mcommit 896790b519c1066fbeb62a0b275416618ddabbfa[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 00:50:10 2017 +0200

    Simplify GroupMap

[33mcommit 7a04c5ff9384fa6755a41073adfe92bbb9f200c9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 00:43:16 2017 +0200

    Register vue2-leaflet components in standard way

[33mcommit 7330d3b6a9457bf08e14a205416247a7502efff9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 00:27:38 2017 +0200

    Add GroupMap test

[33mcommit ee1fedd118d9c9cdeea0e5a60765ea36c32a1c4e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 00:27:28 2017 +0200

    Use localVue in test

[33mcommit 6f8b91eed09f3306528a5956df67167321499a0b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Oct 6 00:26:48 2017 +0200

    Calm jest down when it tries to load a picture

[33mcommit e61bdbf90f602f41b65d4b5b4cd7bccb468621fd[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 5 23:13:16 2017 +0200

    Remove stateful GroupMap component
    
    Everything that used it already had the users/stores anyway

[33mcommit d0ade187863dcd67bf5662e4b74a3a9b03c6a09e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 5 21:14:58 2017 +0200

    Remove UI suffix from connect components

[33mcommit b730c022b6a67cddee8d2e1b69834afb2f72022b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 5 19:32:07 2017 +0200

    Deploy release from quasar-release branch

[33mcommit f26f68c04d2c7a8e60d6a15dac635f218a3143b7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 5 19:30:00 2017 +0200

    Put tag deploy back to basic config
    
    Doesn't seem to work yet, perhaps it needs to be defined
    on the master branch...

[33mcommit 62fcfc579e6fd09897a2ecce1308ac770ba417c1[m[33m ([m[1;33mtag: quasar-0.0.4[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 5 19:24:10 2017 +0200

    More circleci fiddling to try and get tag deploy

[33mcommit 46a21e51835575693dc73738784a33c143308d29[m[33m ([m[1;33mtag: quasar-0.0.3[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 5 19:17:53 2017 +0200

    Add tag filter to all the things

[33mcommit 99aba06a060e41c8d0420778d3884dfaeb34c6c6[m[33m ([m[1;33mtag: quasar-0.0.2[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 5 19:12:43 2017 +0200

    Fiddle with tag filter

[33mcommit b406fd0811aee945a107935669cc808694268517[m[33m ([m[1;33mtag: quasar-0.0.1[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 5 18:54:43 2017 +0200

    Filter tag deploys to "quasar-*" tags

[33mcommit b244bdddd6d2e16fc54297a67834fbe8c6bb6fd8[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 5 19:03:08 2017 +0200

    Tighten up tag release filter

[33mcommit 9763bbbc53a9f3a8d6dccee0b261d06b14de42d7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 4 19:03:12 2017 +0200

    Make backend url configurable via BACKEND env var

[33mcommit 2076c343ce2744a79aa331ae644657febcc5bd8d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 4 12:37:27 2017 +0200

    Sync user language with backend

[33mcommit 281420ebece873bdef37bfdffbd00a63d98fa332[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 23:04:41 2017 +0200

    add hot reload hint to i18n plugin

[33mcommit aef380ddd89fdacfa72118e787b1f15e4cfbad5a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 20:19:03 2017 +0200

    Fixup locale selection

[33mcommit ca2afd4866901ae05b76f9e7c6f5502c52e5b1f3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 19:16:55 2017 +0200

    Remove unneeded !!

[33mcommit 462118b2d832816842405e0fc9a97f2309ece6d0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 16:24:27 2017 +0200

    add simple history detail modal

[33mcommit a69b8c0c4a1f895d74029728126e78ff7bb04641[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 15:57:14 2017 +0200

    add user history

[33mcommit 6586ac0d3c9748857d8d2ba992c31b4dd9fa2b4f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 15:44:36 2017 +0200

    add store history

[33mcommit a9455d483618349e7f7ef9e2a68e336cad42ee48[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 15:43:58 2017 +0200

    initial state for pickups

[33mcommit de374576aa8670f078dd8a0e5bd79f64b6c4fb41[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 15:43:48 2017 +0200

    initial state for alerts

[33mcommit 7bb8b810118b601f0638e56aad1362834bb4ceb7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 15:43:32 2017 +0200

    set and clear initial state from function

[33mcommit 4014846cd33e65adce72c1f388a433f360b1328f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 14:52:00 2017 +0200

    polish some syntax

[33mcommit 6941de392d0d7573083337215e2219755d3cd6b5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 14:51:46 2017 +0200

    add history mock data

[33mcommit d6f4128df6641c1a86082a86326c9b00e848f70b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 14:51:32 2017 +0200

    connect historylist to group

[33mcommit c4df79fb4f8e3773a6164d55abb9e2bc3df6173e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 11:11:16 2017 +0200

    dedupe mockdata

[33mcommit cd27c9c88623f0659fb0a58b59add58e26461fb0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 13:35:41 2017 +0200

    Add basic users module test

[33mcommit 0224c4519fe4c3f2192bf94465ca7de6f8fe59e1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 13:35:33 2017 +0200

    Rename list -> all

[33mcommit b2b27afae775a3258ff1a71e2816da9b5fa85833[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 13:31:36 2017 +0200

    Mock router-link

[33mcommit 19328f9ee31998bc90fdba2c89561ec5a96fa059[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 12:48:59 2017 +0200

    yarn fix

[33mcommit 8428f8843923a544161caaf1a4af1bcf0a877ae0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 12:46:58 2017 +0200

    Add initial users store module test

[33mcommit 3a47c81dbfbe364cb4fa833fd05ed243ec3deadb[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 12:46:47 2017 +0200

    Don't depend on store

[33mcommit 0b04f3340dd629895da6cc93a87688e24c04d459[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 12:15:38 2017 +0200

    Add sidenav store modules tests

[33mcommit 7025df6c6a626bdf84bbbb3b99d806407fb0103e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 11:24:09 2017 +0200

    Add store id filter test

[33mcommit 4e5a183cf1cc8fc32cc10b9de272ad7b033bdfa6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 11:20:49 2017 +0200

    Add pickups/leave test

[33mcommit b72f7561768441da55574f150a58808b05ef70a5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 11:10:03 2017 +0200

    Add more pickup tests

[33mcommit d7d41a49e956b5030b373bde12c44893efe4c238[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 11:09:51 2017 +0200

    Add debug mode for test store to log mutations

[33mcommit 0bcc2e30c839e2725fb4a455897de81c524fc3d9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 2 11:09:30 2017 +0200

    Coerce to boolean, fixup mutation name

[33mcommit 32569f51c86ad70b913a9d28caa43dbf9f09d63f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 10:39:10 2017 +0200

    add example

[33mcommit 635c373f62bbdde9ef689bfa9b0024163e69bbe3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 01:54:41 2017 +0200

    hot-convert i18n messages from angular format

[33mcommit 0ac57b789d1a6809c54219ad6ca92e4d589455a3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 2 01:54:12 2017 +0200

    enricht history entries

[33mcommit 8941595b15c96768718eb5de5d32da29f4ccdd26[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 22:59:37 2017 +0200

    add working history dev UI

[33mcommit 38cd9b251aab90041e53813786afb0ab9f114517[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 22:17:20 2017 +0200

    fix non-reactive state assignment

[33mcommit e99ddc624297db218fef23c91028c640ecc9ea9a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 22:16:34 2017 +0200

    add history module

[33mcommit ed55cfb87d09bbabaaee6f94561d9a31fe938a21[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 21:24:45 2017 +0200

    add history api

[33mcommit 380b07bff48a4c9932b2cceee6bb30e5ee1d63d0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 21:24:32 2017 +0200

    no need to parse initial prev cursor

[33mcommit 918252afe197f6f05635890dbace9e13b714446b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 20:55:39 2017 +0200

    move date parsing into receive code

[33mcommit 9a873660e706eebe4c1943886325132d22ca1063[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 20:48:35 2017 +0200

    ignore vscode settings

[33mcommit acb65a594018bae12bd47223af390edde41541b0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 20:15:05 2017 +0200

    move postcss options away from LoaderOptionsPlugin
    
    it seems to be unsupported in newer versions. had to rewrite the css loader rules to the more verbose webpack 2 syntax

[33mcommit f08652c595350a2352baa43c1a39a0763e450c52[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 20:13:02 2017 +0200

    upgrade postcss-loader

[33mcommit f7c90866308ef0bbbe28da6fd01d045dae71f9be[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 18:38:57 2017 +0200

    upgrade file-loader

[33mcommit 9fef0ed12d1bbea4384546a7c8abe65978669090[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 18:29:45 2017 +0200

    enable build-time module concatenation
    
    it reduce bundle size and scripting time a little bit
    I expect more benefits in future with more added code.
    we should watch out in the bundlesize analyzer what modules are *actually* concatenated

[33mcommit b4b51fd38819af01e404182fab934929780ea570[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 17:21:46 2017 +0200

    export es6-modules from vue-loader
    
    Should help webpack 3 module concatenation
    https://webpack.js.org/plugins/module-concatenation-plugin/
    https://vue-loader.vuejs.org/en/options.html#esmodule

[33mcommit 7f7de686f9e8b6065f67069d5d8ed0d8fe92e1fe[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 16:34:47 2017 +0200

    use more import

[33mcommit 0395c517ca7eb2d52aee7d4e90ac06cb771e88ae[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 16:29:55 2017 +0200

    upgrade vue2-leaflet and vue-loader

[33mcommit 757e77ff0972a0317282fd10da12843e4abd3f48[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 14:36:28 2017 +0200

    update dependencies

[33mcommit b1c1dee57f8baf7a9a27388dc28a09357a7aabb2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 1 15:15:02 2017 +0200

    eslint fix

[33mcommit 590f7f2e18f5a7bc6de843c8a12fbd3c2c3fd8df[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 1 14:28:09 2017 +0200

    Add pickups vuex module tests

[33mcommit be967a5d45349aa63e8dcad418d3619290e6bd0b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 1 14:27:59 2017 +0200

    Make pickups vuex store more consistent

[33mcommit 5359d081ea61642830b4dbc1a5977ebeed0a283b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 1 13:34:08 2017 +0200

    Remove groups/list in favour of groups/all

[33mcommit 8d80e65fb7dbc0d73177abd3ad9bf8103ba3f230[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 1 13:32:36 2017 +0200

    Add more group getter tests

[33mcommit 77862b4d8b6d776e466f7355a67fb6711d26e80b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 1 13:32:28 2017 +0200

    Simplfy code a little

[33mcommit d27a4ca50fce0261e78303ad637c481d9a0a2e54[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 1 13:10:30 2017 +0200

    Use storeMocks test pattern everywhere

[33mcommit 560d29c75894fc4841a336860eecfac51a4c9426[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 04:59:18 2017 +0200

    move progress reporting into vuex plugin
    
    vuex-persistedstate complains about `Invalid storage instance given` in a test scenario. This seems to be a solution, but needs 'monkeypatching' the axios instance

[33mcommit 4c1d4334b5fd821a06a7b93d1fe23ef4a92ea65f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 04:19:26 2017 +0200

    fix type error

[33mcommit 474ac677efa0367f56fad3b4a402c4b8e9c97100[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 04:16:19 2017 +0200

    show API request progress bar

[33mcommit a7b222b77b2cfd7c3fe1fbc298c68e2d89c3bc54[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 00:52:53 2017 +0200

    calm down linter

[33mcommit 29a5f20f90b53f6a6b58b4bb97f877941b2f2de4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 00:28:46 2017 +0200

    connect invitations ui

[33mcommit a8dffbf8f7acc0d42695b374fc98436c8548e0b0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 00:28:29 2017 +0200

    build invitations UI with vuelidate

[33mcommit a496e70846bcc343a62dbb27120642051144b22f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 1 00:27:25 2017 +0200

    add vuelidate

[33mcommit 9ce761b57599aaf3d8396004547f333a8f3ee151[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 21:27:22 2017 +0200

    show invite accept/refuse alerts

[33mcommit 85a29ef82cdaf8e3d4759b8ef005f5b4614102fa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 21:25:52 2017 +0200

    add central alerts powered by vuex

[33mcommit 96ae1324f91f5384440a5706fbb753362896148d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 21:24:19 2017 +0200

    enable quasar-animate in storybook too

[33mcommit 7c4b8b7f325808f03c8d7068c49eb6cddd2794b3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 16:34:19 2017 +0200

    remove deprecated metainfo

[33mcommit 0f03f5a558747148134891b7991403c5cfe43ff7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 30 20:20:28 2017 +0200

    Add more group tests

[33mcommit 6c36119fca1368f767fd5fb2e24ca079d53b5bb3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 30 20:20:17 2017 +0200

    Add enrich() getter to be used generally

[33mcommit 451851926f5090c76f709b6df62c2fac2ad748e0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 30 20:00:31 2017 +0200

    Add more group vuex module tests

[33mcommit aa849417efd6419507945b248a8262ef7f3f1d92[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 30 19:41:29 2017 +0200

    Use root dispatch

[33mcommit 0d454e582edaf4448097c3b3361429518a8f7c3e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 16:12:11 2017 +0200

    use beforeEach to

[33mcommit e148e83d7e17d4a63776c793076f79e13e9d91dd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 16:11:23 2017 +0200

    used indexed storage for stores

[33mcommit a66ed2dc90c28129bc093c9ded1840b2e68aabc2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 16:10:24 2017 +0200

    enable markdown in store description

[33mcommit cf4b258559599accc45956ec1af86d9a418f475e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 16:09:58 2017 +0200

    reduce line length

[33mcommit e19e4582145b9b3cadbb080940b147ec2233e9dd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 16:09:38 2017 +0200

    slight reformatting

[33mcommit fad50a65914ec222bf21308f80965db39d8a191c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 16:09:16 2017 +0200

    create sidenavstore connector

[33mcommit 494a3900ffb9616d16344434c1e5dc51892b7e14[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 16:08:36 2017 +0200

    fix typo

[33mcommit 9e97b83e82c783242f06eb170516253707db0949[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 14:03:19 2017 +0200

    clear state before fetching invites

[33mcommit 5f76466771c4526c39a4e9e2f6cb845df88369dd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 13:59:30 2017 +0200

    use activeGroupId, fixes some errors

[33mcommit c4c841e8a9390b20b676ab11f4cfa24e0b64ec60[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 13:50:52 2017 +0200

    switch to dotted title breadcrumb

[33mcommit 250e70c9d44abe702356ca61b5d876039e7dc7f5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 13:49:38 2017 +0200

    scroll up after route change

[33mcommit b08a58db51478abb7fff3e049c20e8a1c77bcdb5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 13:48:00 2017 +0200

    fix redirects

[33mcommit aa1a71774581020b463342a42573fccbf5ff5026[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 13:45:04 2017 +0200

    refactor routes into main and splash

[33mcommit c415ac8f21660d70267794a372be4a6f013800c3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 12:49:49 2017 +0200

    fix comparison

[33mcommit 5ca8326224cfbe2473e28eba1baa6be1f2db9949[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 12:43:09 2017 +0200

    add comma

[33mcommit cf6330bfba129efb1cb94c1f2aa0b54a9dd16c36[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 30 12:40:44 2017 +0200

    invitations integration

[33mcommit e3db6a5e87dec55645edf058d0ece1f7e3ef4967[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 29 19:33:40 2017 +0200

    name root route

[33mcommit 9ede654049336d855c3e17f24d0ad7278b454eab[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 29 19:29:55 2017 +0200

    fixup auth store

[33mcommit 7e7bfd81a73fdd7ec72aeb4c0f95f5d8786206d8[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 29 02:08:48 2017 +0200

    Add some vuex module tests!

[33mcommit 1daa868ce2215e44f25aca64c8529edf638d9df0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 29 01:23:25 2017 +0200

    Use non-conflicting import alias

[33mcommit ab69be2c1f1f31a2a98b8698627ea77245863d33[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 29 01:22:04 2017 +0200

    Move test helpers into own file

[33mcommit 90f9a5488ddc93325b07857ad75e5746922bcafe[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 29 01:21:44 2017 +0200

    Create empty watchman config file

[33mcommit 27ffd0dded6d2345c04bde455850abc628be5f6b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 29 01:14:57 2017 +0200

    Accept single param in actions
    
    Instead of passing in an object, as most actions require a single
    param, and it gets noisy...

[33mcommit 6d20203b77cc9c0c45f488a657e856e34ddd4350[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 29 01:05:57 2017 +0200

    Show private group description

[33mcommit 776dbc6f272c0da133f289fc6694d0b8a88c5b5b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 29 01:04:08 2017 +0200

    Store full active group details seperately

[33mcommit 33c2aa11d6326554867c30c6f19f5fa6cc86a195[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 29 00:57:50 2017 +0200

    Update group members after join/leave
    
    Previously would reload the whole value again

[33mcommit f97746b83ffc1df4ea764d218600113518486711[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 29 00:45:01 2017 +0200

    Parse all ids in router

[33mcommit 0c6f50f1a6b66fe7abe95df2064357f30952d856[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 28 02:51:06 2017 +0200

    Added Markdown, Highlighted active group and hover to groupPreviewCards

[33mcommit 4a901caf4935a4bedab23019e37c454dd8a2ed03[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 28 02:22:23 2017 +0200

    Added changeGroup button

[33mcommit 13e9aa986d8b1bb13e6c38582ed04c572c0f43ca[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 28 02:00:56 2017 +0200

    Added Splash Layout, changed style for login, passwordReset, verifyMail, Signup

[33mcommit 6ed4ba77cfeb64781d3ce0cd43f474ae122bcb5f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 27 18:07:58 2017 +0200

    WIP: invitations store

[33mcommit 66a1950c3e81e848338b25bd4c791b72692973d2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 27 17:39:17 2017 +0200

    add invitations API

[33mcommit 52903cb949fd669e67a41b3c0fc5125414c42d59[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 27 17:29:04 2017 +0200

    register pwreset and verifymail in storybook

[33mcommit 7574c87cb8a1018f8d177b5a6c3791ff794f274a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 27 17:04:32 2017 +0200

    basic verify mail thing

[33mcommit cf29d0b6692e3ad4880a3c0d6e0760d01997bd5b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 27 12:52:51 2017 +0200

    add password reset

[33mcommit 10d8f611d9957e7f1396e119564114c2dc4ef4d1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 27 12:03:51 2017 +0200

    Fixup sidenav store links to use current store
    
    Right now not actually sure why it seems to keep the current
    groupId param in the links, but not the storeId.

[33mcommit 75ee2a9e6486b15b37e2d40fc9e1c8cb481daade[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 27 11:33:43 2017 +0200

    Prevent previous group info from showing
    
    Before, we would keep stores and pickups from the previous group
    and with the new animation you can see the old pickups flying
    off the screen.
    
    The solution is to clear the entries immediately when we are
    switching groups.

[33mcommit 31dfb010b86883fd0ca276cb7e0a8f6e452565dd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Sep 26 15:27:14 2017 +0200

    made wall conversations work!

[33mcommit d5fa9d001162f815cf9f3774979b6ab7f78b319c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Sep 26 14:35:40 2017 +0200

    prevent errors while loading group

[33mcommit c97214595ef77094786e32deef95034e633d618d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 26 13:45:22 2017 +0200

    ProfilesInline: Added hover animation

[33mcommit 61b364046bd9bd47de9e458682944cdb11e385cd[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 26 02:04:03 2017 +0200

    PickupItem Added bounce animation to profile pics

[33mcommit b4318ddab634235612b0f64777f7bcb95c8ece9d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 26 01:14:04 2017 +0200

    Added correct background to last slot

[33mcommit 4b484079502ac525f4a4e40e3114cb7347beb9d1[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 26 01:12:38 2017 +0200

    PickupItem: Added Dialogs to confim join/leave

[33mcommit 442c0216065b2ec0c20edd78f03867e54e6e6a10[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 26 00:42:43 2017 +0200

    Added animation for pickup leaving emptyPickups list

[33mcommit c31289a33fd3f1d63a7e9f3fdeaccce4c8d428b4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 25 00:35:43 2017 +0200

    Added logout button to mobile sidenav
    Added working sdenav-toggle button in topbar

[33mcommit 25d99397386c1fa6d6ba61d0962d4b4850724784[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 25 00:04:39 2017 +0200

    PickupItem: Nicer way to listen to window.size

[33mcommit 29dc564aee39edc303f95c53398afd269d57bdd1[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 24 23:57:34 2017 +0200

    Fixed links of mobileSidenav

[33mcommit a1b5f1a07accf3a1726adfcd727a837009f5da6c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 24 14:59:51 2017 +0200

    StoreDescription: Not as big as a book anymore
    PickupItem: Empty message icon is smaller on mobile

[33mcommit baa9e56de0d3f76dd5a8b3d90014933619336481[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 24 14:42:58 2017 +0200

    MobileNav: Highlight active
    mobileFooter: hide when logged out

[33mcommit 084ec5b8436c857f93de24a62dc68fc590ba110a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 24 14:24:33 2017 +0200

    GroupMap: calculate bounds by stores
    PickupListItem: show waiting spinner

[33mcommit e7af728dfe0fb50cbc06e39525b0a6938c5390b2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 24 13:55:38 2017 +0200

    Fixed plural of pickup notice
    fixed wall margins
    fixed footer bg-color

[33mcommit 0b3240e553bc84cec01c807227d7c2b5061c344b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 24 00:46:07 2017 +0200

    Show public group info button is now working

[33mcommit d260b80ebb20f42be720987037f868c70db5f1a3[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 24 00:28:24 2017 +0200

    PicturesInline are now automatically expanded to component width

[33mcommit 8dcddb35ca3dd46078b08be4c807843929af5e6c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 23 23:52:50 2017 +0200

    Solved overflow problem of pickupListItem profiles

[33mcommit 9e46ee5c2458adce07672d1eab11313cf258f0eb[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 23 18:26:30 2017 +0200

    Revert "No checkout for deploy, tidy a little"
    
    This reverts commit 1800c57c4cef634f083aa144a8a647de906a63e0.

[33mcommit 1800c57c4cef634f083aa144a8a647de906a63e0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 23 18:23:50 2017 +0200

    No checkout for deploy, tidy a little

[33mcommit 9202dc2854f7e40e9443533032466d6d94e2a7eb[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 23 15:25:35 2017 +0200

    Only deploy if lint passes

[33mcommit 1f761adb0e0c8e608c491d5421149dfb9d22cabc[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 23 15:15:32 2017 +0200

    Filter tag deploy properly, even more parallel

[33mcommit de3c5ebf53ac91af5a26a237022cf5aa4aba689b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 23 15:08:38 2017 +0200

    More parallel and move filters to workflows

[33mcommit 1ce56e32f5a2b4e7e5a615e3cd19caf068936545[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 23 14:59:40 2017 +0200

    More indentation fixes

[33mcommit 2035166ed17f2d535bca0c5190ea86a81147aaa2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 23 14:58:35 2017 +0200

    Indentation fix

[33mcommit 979dc9f0a27b2c6b587b49a8a20081f38b479761[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 23 14:55:31 2017 +0200

    New whizz-bang circle2 workflow build #awesome

[33mcommit 943bf1c01debfff8e2c2d5f421cff8cf67b1089c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 23 04:05:40 2017 +0200

    fix it

[33mcommit 8d5cbb2f8d43db37e590763d14d5fae98ba58b66[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 23 04:00:38 2017 +0200

    patch wall messages

[33mcommit cbd09409d11f1c72f57432c9fd18ecd06f4f2aa3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 23 01:13:48 2017 +0200

    remove Home.vue

[33mcommit 3b9ee2161f3e393fae1a227169e6b4d4015eb0c3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 23 01:05:43 2017 +0200

    add translations and improve design

[33mcommit 1579cfa76efb9544fcd10b6d745d57f929c05526[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 23:58:02 2017 +0200

    add groupInfo breadcrumbs

[33mcommit c6493f4612ba7114cc3d76793c0c4749a38fbb52[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 22:53:24 2017 +0200

    better key handling on login form

[33mcommit 2a99c426b07566ef12805b9c0940fb641cbf1d6e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 22:53:01 2017 +0200

    enable direct group join when logged in

[33mcommit 528e211807383151837cb6960bd355930c28fe71[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 22:17:08 2017 +0200

    add logged-out alert to groupgallery

[33mcommit 9d8db7fd6f53df36ab38ea8933f8e6829af6ab54[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:31:09 2017 +0200

    join group after signup

[33mcommit baa1c5831bbb31b07b3a195b4ce03c9671145a00[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:30:42 2017 +0200

    refine signup page

[33mcommit 6e64c16cf4ef8d5cd6c687f962ac2ea5eb5dc0db[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:29:29 2017 +0200

    improve login form

[33mcommit 252f65adf33446da6828147c0c4301f43fe7ba2a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:29:08 2017 +0200

    enable group join after login

[33mcommit dbe7c8058e7f0fbd78f884488c3319baf01c283a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:28:22 2017 +0200

    add user signup actions

[33mcommit 7dde5622039d34dd95a92cb42ebf5ba77478340e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:27:52 2017 +0200

    underscorize request data

[33mcommit 5b947faac71bf5a2ff283ba15e7a91913a921d63[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:27:27 2017 +0200

    show toast on server and connection error

[33mcommit e774853a9970f268fa6b441116a709ecb6b884b6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:26:59 2017 +0200

    refine pickupitem loader and add to storybook

[33mcommit 56a074c72ab737aeffb5c0572d5f3902542714db[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:26:17 2017 +0200

    refine login and signup storybook

[33mcommit e1777db54d16b98071933cab4e1e3a0909f780c3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 22 21:25:37 2017 +0200

    prevent breadcrumb hover

[33mcommit 8fbc61c589b69a7b7a200399d278f81783f48392[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 22 14:10:14 2017 +0200

    Added ProfilesInline types to storybook

[33mcommit 23a331ede923819be1edb9a5c4046fd8234503d2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 22 13:45:25 2017 +0200

    Added fs-de style pickupListItems

[33mcommit b4a95a73603ad29a96b8d67e7ab0f0eb26f98814[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 22 00:05:06 2017 +0200

    Removed storeWall button for now

[33mcommit 1e2a9f0a2b58800d7092b47a4164d0161776292f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 22 00:04:08 2017 +0200

    Router now scrolls to top on routeChanges

[33mcommit 1066199cc2f7573cf79745307698e900d5cc5a1d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 21 23:59:39 2017 +0200

    Added different Topbar for LoggedOut state
    Fixed Login shaking initially error

[33mcommit df1fb1d0c1302e75311e3ed0455767a63586fda0[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 21 23:16:50 2017 +0200

    Added carrot to footer

[33mcommit c8c70990e1b93255c61db4575f01dc811c709425[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Sep 21 15:04:37 2017 +0200

    upgrade babel-eslint

[33mcommit 834e2e497e08d50952ad555ed876b0c9d7e2bc62[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Sep 21 15:02:48 2017 +0200

    upgrade autoprefixer

[33mcommit 1cca8233cc270aa600a3ae5d44128dccc792c99d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Sep 21 14:59:25 2017 +0200

    upgrade packages

[33mcommit 4256f12ec5edc032e6f64c2548a2d24c333d22ac[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Sep 21 14:55:39 2017 +0200

    upgrade markdown-it-link-attributes

[33mcommit 4a349c15d0127fe6d8600497e160e15f1150fe3d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Sep 21 02:21:22 2017 +0200

    connect groupoverview and groupinfo

[33mcommit 52a86a815a45310ebce93f61429b15c74b4955dc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 20 22:10:55 2017 +0200

    add testcafe for e2e

[33mcommit 05ccbf80450ee84120b020da7cd912af49b3cb7f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 18:39:26 2017 +0200

    Always load fallback locale messages (en)

[33mcommit c555480b879f2829819e4fe85fbc3253132064bb[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 18:23:17 2017 +0200

    Remove accidently included message

[33mcommit 657f38bf84c9e47ba63ae8badf45588c3d1eed75[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 20 18:14:22 2017 +0200

    add emoji to markdown

[33mcommit 4ab03348a40eea17e5dabdd078d53e55cf5d3a6a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 18:13:37 2017 +0200

    Load locales messages on demand

[33mcommit fc48edb5be10371af8f6a89fed64591ce9233b4c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 20 17:53:25 2017 +0200

    replace vue-markdown with custom component

[33mcommit f899bb3fcdc0741d6d6f71c3356abbf8c9405ed7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 16:51:36 2017 +0200

    Add a common async loading webpack thing

[33mcommit 529cc2fc0fd406e5c8af2992d5266385ca0e8229[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 16:49:34 2017 +0200

    Use hashed webpack filenames

[33mcommit bf78b824923437d11ac44e239207dcdf6975c736[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 16:16:27 2017 +0200

    Fixup leading spaces in slack deploy message

[33mcommit fb9ccdc33d79aacc9d4aeedc7ad56a2f299854e1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 15:27:56 2017 +0200

    Add webpack analyzer link to deploy notification

[33mcommit 62c2eaf2149047c978aac3d1c9db5cec61ce8d49[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 20 14:54:33 2017 +0200

    add webpack-bundle-analyzer

[33mcommit 3d091db93f533f7a7c11ffb0cf355543d4751d16[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 14:29:37 2017 +0200

    Pickup waiting as boolean, reload pickup if error

[33mcommit 2061d86acc79cd7823dbc1b7ea4d08bf4db017aa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Sep 20 11:40:07 2017 +0200

    update footer

[33mcommit 462892917bfcece1286ad882ccc73727f084612c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 11:14:02 2017 +0200

    Use pipe for document title seperator

[33mcommit 1654ed8ffec16a09b1230f597f68e29ba41a2a35[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 04:11:11 2017 +0200

    Don't reload pickup from server after join/leave
    
    We assume we can correctly manager the collectorIds

[33mcommit 3f9b8a63e51b16ff3c89f91369c3ae7ee66b8b7d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 04:04:12 2017 +0200

    Use default linkActiveClass

[33mcommit 8c8c8949dc01f136bbdc426cb512cbf85d111917[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 04:01:47 2017 +0200

    Make pickup join/leave work

[33mcommit e60dbd1db40f415c82afd60e5e2e05a0b5430e85[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 03:12:45 2017 +0200

    Make menu to users own profile work

[33mcommit 77e3193c2b8eaf0f342aa23d103e97df68a2451d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 03:07:22 2017 +0200

    Signup page should require being logged out

[33mcommit 9de96d32def47594b4f63142bc7bf242a8400474[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 03:06:17 2017 +0200

    Handle breadcrumb translations in vuex module

[33mcommit aade1728336d178535868bae098c45046a0bed4e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 02:58:38 2017 +0200

    Remove vue-meta lib

[33mcommit 8dec3b32da4e3092c707f876d0e2a90fe3cb8b60[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 02:58:06 2017 +0200

    Set page title based on breadcrumb info

[33mcommit 6c6a8d25e2c26b92f8f82f935a9fa5d23487d76d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 02:37:58 2017 +0200

    Replce camel-case lib with small function

[33mcommit 156e798090c38fdded25232d1c3bd4d9ce0578e2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 02:49:38 2017 +0200

    Made Wall cards a bit better for now...

[33mcommit c426e3425c225c425f8f3381dbdc83489f0dc7ef[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 02:46:30 2017 +0200

    Redid settings page
    EmptyPickups looks more pretty

[33mcommit 045548e792ec34ff09e83581b26215d6c8eb63f4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 02:19:38 2017 +0200

    profile pictures bigger
    corners smaller

[33mcommit d2d9190989cdf412c46d08dc642ef0a236383004[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 02:11:41 2017 +0200

    Added v-if to userPosition

[33mcommit 516b150eb9f382157eda84fddc682ac77f6f1aef[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 02:09:32 2017 +0200

    Improved  userProfile map

[33mcommit 4b75d3a5565ca0ebc6dd602b54067e3e2cb46622[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 02:11:38 2017 +0200

    Add full store object to pickups

[33mcommit 48ca8fa13bb2ec7897bd1894b708c553cc30980a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 02:02:57 2017 +0200

    Add collectors to pickup items

[33mcommit 6c86e034217e7c3f7db5d1e461b9c07d23134d32[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 01:35:50 2017 +0200

    Added groupMember page

[33mcommit d7af41ad4ea8eb7a979107990e300adfb009774f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 01:20:24 2017 +0200

    Made sidenav routes highlighted

[33mcommit bf98f6c25cd3ad96674a8cd8b9f7b81f82b9b8ba[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 01:04:29 2017 +0200

    Added redirect from storeWall to storePickups
    Limited emptyPickups to next week

[33mcommit cce5f51e8d4c1fb692503b0425cc0ae5a05f9b34[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 00:52:01 2017 +0200

    Removed unused buttons

[33mcommit 329e1b44dee913cbe84043b92216fc78ec266b4e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 00:48:10 2017 +0200

    Removed openSidenav on desktop
    Made footer bigger

[33mcommit 5170246a0983de5957e418af13a3c3df6912e2a9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 00:38:10 2017 +0200

    Make random picture component reactive

[33mcommit b2f9261e79af8f963eceb28a70f0ccc0a0b585c6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Sep 20 00:07:02 2017 +0200

    Use shorter story definition

[33mcommit 41e5f3f8a4194c54be9a11c031b12e1bde8d30dc[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Sep 20 00:06:49 2017 +0200

    Changed pickup message

[33mcommit 0e624d3aad80b4bc3587af149b8ea9aafa89f128[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 21:57:21 2017 +0200

    Removed default params for now

[33mcommit f7f9f557144fb67ab9be779b1b0dcdfab4bc02ea[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 21:56:02 2017 +0200

    Added redirect to main page

[33mcommit 4a74f21472517070c79b2861f312afc577c1ba4c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 20:15:42 2017 +0200

    Design: Header padding changes

[33mcommit 7466717b0b4853aa3556150b14875eadca23a41f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 19:47:26 2017 +0200

    UserDetail: Last touches on design

[33mcommit 34e4b4921f956434a391a92e9b0fac0acf6ba774[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 21:32:17 2017 +0200

    Autofocus first form fields

[33mcommit dbd8d7f6a1d274e79eb48e006d85bf495133399b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 21:25:20 2017 +0200

    Fixup selecting group, fix a few null errors

[33mcommit 12b5143bc6249f9646818e5b70052bbe197ed04d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 19:42:07 2017 +0200

    Made UserDetail more pretty

[33mcommit 10979a5b9fc6dce0f867175a7a9543374c92a43c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 17:56:17 2017 +0200

    Added KNotice and emptyPickup message

[33mcommit 1252203b0d786fab241aba6cc685273c8eca58b8[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 17:08:57 2017 +0200

    Added storeFilter to pickupStore

[33mcommit 1d0b36da09ea413e064de683df1e90b9808038e2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 16:35:00 2017 +0200

    Remove trailing slash from vue-test-utils
    
    So it can be used with git insteadOf configs to rewrite it to git
    protocol

[33mcommit 71ba927e3f11e8efce1c09ac80314c69ae8aa2ce[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 16:17:03 2017 +0200

    Added userpage

[33mcommit 5883f59703eff3ef0168bfd4c5f7ebb885d73e18[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 15:33:52 2017 +0200

    Remove url writing fix to a better place

[33mcommit 31c9af24c53d3e8c9901606e2811263460a1117c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 15:32:07 2017 +0200

    Disable git url rewriting

[33mcommit a9cba9e71d3f3a22e97c171b4737f22a1d10b5ff[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 15:19:07 2017 +0200

    CurrentGroup is now automatically set with last currentGroup

[33mcommit 87d98cf807c8999000fd4f06d7670894f5840d68[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 14:42:50 2017 +0200

    Added animation to searchBar

[33mcommit c27f96811c9db174c1b0562a4a8b6ef4d9932c08[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 14:17:50 2017 +0200

    Add more breadcrumb tests

[33mcommit 80346ef44efa99b925ce04839af361bf81ed3235[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 14:04:57 2017 +0200

    Fixed breadcrumbs

[33mcommit 865325ed4a7e304801eaa08ae19cd739631576c2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 14:01:10 2017 +0200

    Added Searchbar

[33mcommit 87c5735e22ea9959239cc4d5bae289e64ad04447[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 11:41:07 2017 +0200

    Moved own style to app.mat.styl
    Breadcrumbs bigger
    background fixed

[33mcommit 8b323123664d64354ee4edbddf271d972e0efde1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 13:33:02 2017 +0200

    Update yarnlock

[33mcommit 1b79e68727811b318d8832a6844d6255e827ae09[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 13:32:54 2017 +0200

    Add testing utils

[33mcommit 9518992acde9d430cae8bddc8a0cde2f6c7f7a22[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 13:32:35 2017 +0200

    Fixup breadcumb story

[33mcommit 93c131e8326d516fb1ec4a2508528f5bd3d260a7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 13:32:22 2017 +0200

    Add general component tests

[33mcommit 0b28c43e8a5ff8754ab9aa9faeab631bf2eb5d4a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 13:31:47 2017 +0200

    Add vuex auth store test

[33mcommit 5b7a99bd613b7c5d8b24ef4cab84b1e90d8284ce[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 13:30:26 2017 +0200

    Add dynamic module import for tests in nodejs

[33mcommit 1c6b0af865d289b26ebf628ca5a56b24e33c15f1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 13:29:25 2017 +0200

    Add jest options to support loading quasar

[33mcommit 4ad5d51204a9fc6051ef03e0320a16d12f3901c5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 13:25:59 2017 +0200

    Conditionally render lastElement in breadcrumb

[33mcommit 98e4e5cbe2588e98ccbe9529a6107869dd1434ff[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Sep 19 13:15:38 2017 +0200

    Move the breadcrumb logic to vuex store

[33mcommit d366d1da0c8eeeaee98760b4056b0c7916525cbf[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 02:08:53 2017 +0200

    Settings: Language picker now working

[33mcommit 8089ad0a63a011384c49c0835f5afb56ef8407f7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Sep 19 01:25:13 2017 +0200

    refine group preview cards

[33mcommit 21580435ed31f1b7aabe8f321571a07c992caa2d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 00:58:07 2017 +0200

    Centered Topbar Breadcrumbs
    Removed dead settings page

[33mcommit 05c08254ef2fed9f3b52aac8e2efc2db8d0cbe02[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Sep 19 00:11:40 2017 +0200

    Fixed store/Stores renaming in router

[33mcommit c027f3b2b6d0dce5700db3234571b9d925403fd4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 23:43:43 2017 +0200

    Added StorePages

[33mcommit 303c26fb494d854b498c29a0eb44cfffc3772f46[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 23:21:51 2017 +0200

    GroupNavbar now disappears when not on subroute

[33mcommit c1a216b24de7025025a32c0db723c18f3b1626a6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 22:38:12 2017 +0200

    Made layout & colors a little more styleish

[33mcommit 1a16e6f1af3cee07920df492f8cde2ed239bf2fb[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Sep 18 22:50:37 2017 +0200

    Remove commented out code

[33mcommit 4d124fce60390cba9e9cdeaf2358eedd9d1620c9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Sep 18 22:50:11 2017 +0200

    Decouple router from store

[33mcommit d8869c5e7b26e9aabb949d128f302f862e55231e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Sep 18 22:21:47 2017 +0200

    Update eslint for jest

[33mcommit 3a0b3bacbd85472c9a390d0b30294a46116cf89d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 20:32:55 2017 +0200

    Changed Layout to nested so that page rerenders correctly

[33mcommit 2ce9abfc89617352234a10cdcb99c4a65af03834[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Sep 18 19:49:36 2017 +0200

    Simplify groups/conversations vuex modules

[33mcommit b7b4e9f1c37d531e0e4270822eeded7b208b2d38[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 18:25:06 2017 +0200

    Added history page

[33mcommit 9a80f604cb65519d339396a517ce10b2522cce9c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 18:08:54 2017 +0200

    Sliced messages from api

[33mcommit eab11179f9df4532f496f88778d293fc002fa255[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 17:32:56 2017 +0200

    Fixed Group Description

[33mcommit 7165de5ae7df56b21ca9d7d377e8e209d8cad848[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 17:08:30 2017 +0200

    Added GroupLayout
    Seperated StoreSidenav and UI
    Added GroupNavbar

[33mcommit d06968565b2347e494b0db789b7611c9c8c59164[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 15:31:57 2017 +0200

    Added map for mobile

[33mcommit a517f02901bf7a7f786bd046f8e36263edb2179e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 14:41:06 2017 +0200

    Added some functionality to topbar

[33mcommit 77909792794f9c5790c43df67c4331df021cf822[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 14:30:12 2017 +0200

    Moved GroupDEtailContainer to pages
    made profilepics work

[33mcommit 2a1676ab2d51dea34714c714fe823c20bd0bbe27[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 14:20:22 2017 +0200

    Added functions to sidenav
    Added reveal property to mailLayout

[33mcommit 54c7a1348ba3b92e80b57a7ba4d3f99f75455d95[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 14:06:48 2017 +0200

    Brand new mobile sidenav!

[33mcommit 3ee7d925899adb7b63a29194117ea54b6d2e9b56[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 13:55:29 2017 +0200

    Added current user - not quite sure if it's working since list isnt fetching correctly

[33mcommit 7c90c27e76a6a2dbded0c101e81ce62eb6c40538[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 13:40:09 2017 +0200

    Added activeStore to store/stores

[33mcommit f9cea0dee35ef9fd275dc92c0e60071e40e31584[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 13:20:45 2017 +0200

    ActiveGroup is now set in router

[33mcommit 2c128e3e80248a1e8f62cebb802ee193ea0e6cd7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 13:01:07 2017 +0200

    Added User and Settings page

[33mcommit cfe56a6205b4960edc70dc307c77c1e389fea0b4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 12:19:42 2017 +0200

    Fixed breadcrumb titles

[33mcommit 2cbbecd46bcc33974071a326e397f4783c89c9f4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Sep 18 03:02:59 2017 +0200

    Added breadcrumbs

[33mcommit ad2385e3dfa180819a432262b4f05a6cfa4db292[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 17 23:22:09 2017 +0200

    Made links working
    Added storeDetail
    Used named routes as default

[33mcommit a5da8acafb56f3122d98725faf6f94d703ffde3c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Sep 18 02:45:30 2017 +0200

    add group join components

[33mcommit fe87e2d9582e0e03c6b879eb346935b5bab6a122[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 17 22:15:40 2017 +0200

    Fixed view for mobile screens
    Added storeList and storePage

[33mcommit edd3d3aaa884a6e7da72dc5c961cfb22845cf2fe[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 17 15:18:43 2017 +0200

    Fixed lint errors

[33mcommit eee236725773133b20819b321ba75b65fa7bd19f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 13:51:05 2017 +0200

    add trailing commas in multiline

[33mcommit cd401b0164542ea6e369d5388c73cbf27b6640fa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 12:33:33 2017 +0200

    force dangling commas on multiline

[33mcommit d407b67db24c3e6527db6f11e3d554d9f43edd5f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Sep 17 13:47:16 2017 +0200

    Move more ui state into vuex store
    
    Still a bit of WIP, but the general idea is to minimise the use
    of getters that return functions, and keep active group ids inside
    the veux store.

[33mcommit f5289dbce1040c818a6c57b2fb11084577a0385e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Sep 17 10:39:15 2017 +0200

    Don't use getter function in i18n store plugin

[33mcommit b7a1e1fbbec65a9aa2691dab52adb9560a9810c3[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 17 13:12:54 2017 +0200

    Changed style
    Topbar now uses quasar topbar

[33mcommit 366f808ce98c0f014b8e031f0e0e3f1c70e06375[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 12:19:40 2017 +0200

    add transifex config

[33mcommit d955b554892311b986cea3193541bebb2351e2af[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 12:14:18 2017 +0200

    add project info files

[33mcommit b9372141d1c06e018ea7e6644db6d378829bdb8b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Sep 17 12:12:50 2017 +0200

    Unified Layout
    Made Sidenav more pretty on mobile

[33mcommit 6b5655b93834f89a69c13d4845cc8c9b8c6a6161[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 12:06:33 2017 +0200

    add a bunch of package.json metadata

[33mcommit 5d66d55d0f119d2ca2dce3f5718646c613832f3e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 11:46:13 2017 +0200

    use plain axios for about API

[33mcommit bc58115dd270f7cb5656c1c544b00a6fa8d4db00[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Sep 17 03:02:58 2017 +0200

    Move store access out of i18n to plugin

[33mcommit f71ff8c66412cb8dd4fb04bbf7306dbb2a4ab242[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 02:40:48 2017 +0200

    try to fix github url

[33mcommit 8d057706316df6a45a7fc8832cf31b3bf93ae6f6[m
Merge: 5a95c0ae ddd1a18b
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 02:34:04 2017 +0200

    Merge branch 'quasar' of github.com:/yunity/foodsaving-frontend into quasar

[33mcommit 5a95c0ae130722b73bcf29f298eab92c6a996224[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 02:33:00 2017 +0200

    add yarn fix command

[33mcommit abf255c093c79107e27163ccca7478206ca1ea87[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 17 02:32:35 2017 +0200

    introduce about api

[33mcommit ddd1a18b58747d98e79a1652e4847adfc4a81204[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 23:06:59 2017 +0200

    Pass proper date to date formatter

[33mcommit 5dcd6136eb3d09cea6deee104d3447e277f51500[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 23:03:08 2017 +0200

    Use default user/pass for development mode

[33mcommit a3e53b6cc81c42436cb7f07c3de57e2a6c141182[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 23:02:53 2017 +0200

    Redirect index page to /group/1 for now...

[33mcommit 21000286f81e05d8432da72b700e009948eff186[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 23:02:27 2017 +0200

    Add KTopbar wrapper component

[33mcommit 0b282be9305f171a944d2a5c02e1976d7c909cfe[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 22:25:06 2017 +0200

    Fix lint error

[33mcommit 8910fd5473f17e3269a3ddb017f0e27517bed084[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 22:24:15 2017 +0200

    Add router auth redirect logic

[33mcommit 502170e5f6dad6a2bc0229eda5abfca9c8c739c4[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 22:24:02 2017 +0200

    Use new getter helper

[33mcommit 54ce8abbef871e0ecaba4ecab05489bee02c9a68[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 22:23:16 2017 +0200

    Remove login stuff from Home page

[33mcommit a94219f071e241b8c7802c6e4a51829c2453c59e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 22:22:56 2017 +0200

    Wait for auth check before starting

[33mcommit 8247ec3c1d5661810d24a787c474cb69bc17ee1a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 22:21:55 2017 +0200

    Check login on start

[33mcommit 2debc601d1d7f4b0764e3442f57574d563c2543d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 22:21:33 2017 +0200

    Remove login/logout stuff from group page

[33mcommit 6d684e459c08766ed7e0e06b0f08a517fb0b5a49[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 22:20:56 2017 +0200

    Rename watchGetter to getter and make more useful

[33mcommit 20c0ecfa5deca10a7304dd1b38f873d038f00849[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 22:19:36 2017 +0200

    Make topbar actually do logout
    
    TODO: move it to stateful/stateless pair

[33mcommit 5b213719efe2a28235eb50c8212b46035f13c85e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 21:29:04 2017 +0200

    Simplify login error handling

[33mcommit cd28483c08d1a2b6807b1a800342025caad1f1f1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 22:23:53 2017 +0200

    show release only in dev deploy

[33mcommit e075033f32fd9977e2765514fed97018c12ea5a9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 22:22:01 2017 +0200

    improve release link

[33mcommit 352b23e4b4e325fec380030db22358f6d5bdf7a7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 22:12:21 2017 +0200

    Added PickupFeedback Component
    Added margin to group menu

[33mcommit 2d53bb3074db9f6e9703d0cd83a6a5016f65f6e2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 22:05:25 2017 +0200

    fix script

[33mcommit 77d39bb9a3e38d82196ccfa8fa1709ba0bbdcecf[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 21:56:51 2017 +0200

    export about.json on deploy

[33mcommit e9e3e9bebb8a775419a6c0038375a916a0ae03cc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 21:38:13 2017 +0200

    add version to footer

[33mcommit e18498bdd4c77bf6877c209f3798bce78428ef8b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 21:26:43 2017 +0200

    MainLayout is now using q-layout

[33mcommit fb945e4844bb967ba9ff0d8d7bf5e8419c7378f7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 20:50:57 2017 +0200

    Fixed import of layout

[33mcommit 25652e7a94c5cb201bec611e2fdbf7d6edaaed8e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 20:41:43 2017 +0200

    Added people to splash background

[33mcommit d050fef167080e195f062d0d7d9b5fc7b17feb09[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 20:19:41 2017 +0200

    Fixed uses of Topbar and Footer

[33mcommit f977c0b406e633279d9abe6359028eb9d7ea1d49[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 20:16:58 2017 +0200

    Renamed Footer & Topbar, improved Login

[33mcommit 97cb90fa825f20666353467d7b09208c637bce35[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 20:43:48 2017 +0200

    fix conversations getter

[33mcommit a732bb9e406692006ba57019ad1c309fc2679299[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 20:38:39 2017 +0200

    Fix named export in .vue file
    
    Vue does not allow this...

[33mcommit 9cc5e5354fd692f21ff4558255d92310246500f3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 20:33:11 2017 +0200

    Add vuex router sync

[33mcommit eac8201903006f52774da6a37bbbe700076b3668[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 20:26:28 2017 +0200

    connect users and messages to wall

[33mcommit c7106bc96d7cdb472309cc7bdf92d0eb69fceacd[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 20:21:15 2017 +0200

    Filter map for items with a location

[33mcommit 139bcaa7e61248a799f320e42b095fa3859a0887[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 19:25:22 2017 +0200

    Added soon-to-be-mobile Layout

[33mcommit e6a4e2b3c6b23c2d8cf46afecf9a9c0459243e04[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 18:46:26 2017 +0200

    Made Login page work

[33mcommit 53b7d58c2e66c09e0afb6a299f5e7d5d4c860937[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 18:53:32 2017 +0200

    Use factory function for default arrays

[33mcommit 1365ac03bcbc1052017bcc45117ed8d467cd7f06[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 18:33:23 2017 +0200

    Refer to stateless component explicitly

[33mcommit 66dbc0272206bd95c03671d5faf0eef12c700754[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 18:32:17 2017 +0200

    Add map state for story, and simplify

[33mcommit 43e0333c88837a33dadb196ff554a7b8c931597e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 18:31:44 2017 +0200

    Use stateless SidenavMap in story

[33mcommit de0adf1182e8255daac1e1951088a008871c89ae[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 18:01:14 2017 +0200

    Fix component name case

[33mcommit 18b1254cc6e02e1ce20cf417fb74c5907e98404f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 17:59:13 2017 +0200

    Add stateful/stateless SidenavMap components

[33mcommit 0eb5f51038fd9c6b85610551962c92883d4ba7bd[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 17:40:51 2017 +0200

    Bind group error message

[33mcommit 9b7bcd0cb8230c99b145d4796747541573d57fa2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 16:13:37 2017 +0200

    Remove commented out template

[33mcommit 3500cfc5adfc8781427ccd3a4ebe22b267c4186b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 16:10:22 2017 +0200

    Remove undeeded string

[33mcommit c56901370c68cef3df2520bfa5c5169b7265a27f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 16:20:06 2017 +0200

    Added Signup and Login pages
    Added Splash Layout
    Change standard link (a) color

[33mcommit e3270060fa59c8651452ed3261f7fff9139505bb[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 15:19:16 2017 +0200

    Added FallbackLocale

[33mcommit c0217b11632604e480928400bc7cac5c69c344ba[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 16:00:25 2017 +0200

    Use map instead of loop

[33mcommit 1b26842f86126449aa09c0e898014d6562366cf9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 15:58:20 2017 +0200

    Include users in bounds calculation

[33mcommit 7bec2112404de7a1787505f7639751bf6b236220[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 15:52:17 2017 +0200

    Move bounds watch expression to computed property

[33mcommit 6e583bc92feaf95e6e1a9af8034b4536933e3f6c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 15:48:01 2017 +0200

    Fix error creating bounds with empty array

[33mcommit 88ebbba8ce76a98833b372189895705ced0ec3e9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 15:40:02 2017 +0200

    Always access state via getters

[33mcommit b3cfbda3192334413ff3cfbef812e0504c70372f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 15:29:00 2017 +0200

    More fiddling with deployment slack message

[33mcommit 65b28b9b846b79e613a6d881d94bedf537518a0c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 15:15:56 2017 +0200

    Add locale getter

[33mcommit e6a4a5b2cf7d48c33961bc8c48eca60f37ac4da1[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 15:03:12 2017 +0200

    Fixed mockData dates
    Added dates to pickuplist

[33mcommit 2d1ed32d0df5a4ae33932e8f2c86df11d3a6d4de[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 15:03:27 2017 +0200

    Add .commit info to deployed artifacts

[33mcommit 8f16d8f0ada07873c0ba39fe2e6e1046c52062d9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 14:59:31 2017 +0200

    More info/links in deploy message

[33mcommit 3789305bb1c88b3f14c7b23e2adf76a60fcff89f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 14:57:20 2017 +0200

    Added timeShort, dateShort and changed pickupItem

[33mcommit bd618e761f9b6854dd5f19ad6ab78d1e3cabecc8[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 14:53:06 2017 +0200

    Use store watch instead of subscribe

[33mcommit 947a917856ce67be4616ef7070c7f6e4d0b7375a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 14:46:52 2017 +0200

    Fixed WallFeedback CamelCase

[33mcommit a7fba5cdf84d8fccf0811426adc02ab5d3845720[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 14:43:27 2017 +0200

    Added dateTimeFormats

[33mcommit 68c875f8b88a5ca1da6915504d4d167d51f0ccfe[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 14:30:40 2017 +0200

    Manage all locale state in store

[33mcommit 1e61f15c96dfed27d02cb38c33e4542730a5e8fc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 14:27:38 2017 +0200

    remove merge marker

[33mcommit 15e11c9f4dfd15c2d7a91e31682efd605f55c03b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 14:23:18 2017 +0200

    camelize

[33mcommit 4991185e519b81006e3ec2f32a2b77268145305f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 14:21:31 2017 +0200

    Fixed localization dateTimeFormats

[33mcommit 7b16a0c413160225ec69e6cb9b7a632bd43c0bca[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 14:16:52 2017 +0200

    Added localization

[33mcommit 5bfeb93a6b1aa21b470baf0e17b05e293ee1054a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 13:47:04 2017 +0200

    Made Feedback mroe pretty

[33mcommit 6af7b839794314fa5223a02f8a439d789db09392[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 14:15:33 2017 +0200

    Persist chosen locale in localStorage

[33mcommit 96163f45cdd80437f0a5d21e877fc688880e0ee1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 14:05:51 2017 +0200

    Gitignore coverage

[33mcommit 209beb2c168c3126c8b266f50467cd195b2598c0[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 14:04:51 2017 +0200

    Detect locale from browser

[33mcommit 8a4b7f762a7830e1cd200cceb6d3055f4d1fb4a0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 13:58:09 2017 +0200

    add stores api and state

[33mcommit 83bd712614ae4c0b6c04a860f7d52bff0aec7431[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 13:47:30 2017 +0200

    Fixup deploy notify link

[33mcommit 91e8fbb30564b27c6b5e3561a5d1de99f90b23bf[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 13:42:24 2017 +0200

    Include more info in deployment notification

[33mcommit 66db125cd03e4d84bd5eef69eae4f89fb84d4ecf[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 13:19:37 2017 +0200

    Added icons to sidenav
    Added breadcrumbs

[33mcommit c1b5d85a809fbe7ac4bbbbdfac0be2d404b27384[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 13:13:31 2017 +0200

    Notify slack on deploy

[33mcommit 2f08fd5662292c53c3be014fccf87d2bb6e67367[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 12:38:15 2017 +0200

    Load map tiles over https
    
    Prevents mixed content warnings when website is https

[33mcommit 66dfcd36f1c718ada039dd11f1bc7c45f734864e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 12:20:19 2017 +0200

    Added border and font variables

[33mcommit af188730bedcea25977dd12e66365541c04a6a38[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 11:38:34 2017 +0200

    Added more translations

[33mcommit 99047ae1513a178a4297e611c0da3177107ff5e0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 10:45:05 2017 +0200

    add title and favicon

[33mcommit 63b6b3e4474f2dc8615b6129084fd793e6e91364[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 02:39:47 2017 +0200

    Added translation for SignUp and Login

[33mcommit c199f83968ab5868433420f0280663c19742a3aa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 02:15:45 2017 +0200

    WIP group detail container

[33mcommit d62fe1d2190f253f88f017ea185590999ab5a687[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 02:09:55 2017 +0200

    Fixup deploy dirs

[33mcommit c3a6faaa8457dfc028df104c9df92cffe9b76533[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 02:04:23 2017 +0200

    Revert "Better way to add host key"
    
    This reverts commit 55e236d9d1ccd723c63516a95c206e614bba0902.
    
    Turned out I misunderstood the option

[33mcommit 55e236d9d1ccd723c63516a95c206e614bba0902[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 01:59:59 2017 +0200

    Better way to add host key

[33mcommit 905a725bb341064337a8176be5630912a734c5bf[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 01:58:26 2017 +0200

    Add ssh key to known hosts

[33mcommit cff0c1da77a94283e67d8ba80ae1af3b972c41ab[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 01:52:20 2017 +0200

    Install rsync for deploy

[33mcommit 6f6d98560469ee9504288d6daaffa85ba488e6cc[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 01:50:02 2017 +0200

    Execute permissions for deploy.sh

[33mcommit 72b90b57d5a7a5e07c86e00c6fe3fa939e9d36c7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 01:49:12 2017 +0200

    Collect coverage

[33mcommit 0428fe4063c50fc7b6294b72717e1a274776d36b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 01:47:23 2017 +0200

    Added signup, improved amount-picker

[33mcommit 61ed6d2d0d30ec61cd8b52bf1fa79d8ee6f7db9b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 01:34:27 2017 +0200

    Improved Login, added people to assets

[33mcommit 26f0d913ed977d338285c0e6777a8261d1199e44[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 01:47:28 2017 +0200

    Deploy quasar branch as release

[33mcommit f2fe4b1224350ed83f614419862386470c072ed1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 01:45:15 2017 +0200

    Fixup circleci node version

[33mcommit d00024ba9c6256dab8873a261af658a70cee4b7e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 01:42:50 2017 +0200

    Use circleci 2 style

[33mcommit b1954b99f67c30b25e2fa0c0538f91347f0a89aa[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 01:11:09 2017 +0200

    Jest junit reporter

[33mcommit ad0431d165f22676ebd20c5a3b195140307f40bd[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Sep 16 00:56:42 2017 +0200

    Changed Wall design
    Added Login

[33mcommit 228dbabdeeb1ff529fbd5ac5841a3e7d1780faf2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 00:57:11 2017 +0200

    Switch to camel-case

[33mcommit c5e3296f67ad537dfaa9a315d0d810b772d9e1c1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Sep 16 00:00:53 2017 +0200

    Add circleci and deployment

[33mcommit 93bc6bd7274a6d4fd3d28cbf0d2025520cd94414[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Sep 16 00:00:30 2017 +0200

    remove page and component template
    copying is better :)

[33mcommit 9f32b49d9c2ba11d9125dbb772a8520a0843cf2f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 23:00:37 2017 +0200

    Made WallCards more pretty

[33mcommit 3cd728119de0ae68b96769c1a7d5aed288a0aa99[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 20:06:00 2017 +0200

    MapSidenav: Added functionality to showUsers / showStores btns

[33mcommit dc1cf2c51b103e68bf20231e0d24cb793806a982[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 19:13:14 2017 +0200

    Added map-sidenav functionality

[33mcommit b54a552e3f0a981c018de26ce2824d04688240f5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 19:27:28 2017 +0200

    Revert "Lock vue version"
    
    This reverts commit 027ea33067fc00ae55c1af5fa062a1ff3d4bb9c1.

[33mcommit d27ae8dd33f213a11a441fb8988747b6994f639e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 19:26:46 2017 +0200

    Revert "Explicitly add has-flag to make netlify happy"
    
    This reverts commit 51ecafa1a480b41c0aacc092e0c900f9d9df3cfe.

[33mcommit 51ecafa1a480b41c0aacc092e0c900f9d9df3cfe[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 19:10:07 2017 +0200

    Explicitly add has-flag to make netlify happy
    
    Have no idea what it's problem is... works fine here, getting
    `Error: Cannot find module 'has-flag'` on there :/

[33mcommit 865a2097c39a943ca383fa32f66c735823c37fe6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 15 19:04:45 2017 +0200

    add helper for getter methods

[33mcommit 64a263e008363f1c92a4823ebef14d4b5a172622[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 18:55:07 2017 +0200

    Added WallMessage, improved dataflow of Wall

[33mcommit 027ea33067fc00ae55c1af5fa062a1ff3d4bb9c1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 18:40:19 2017 +0200

    Lock vue version

[33mcommit 815355a1bfee7372dac5f585cc4df1bfa37bae70[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 18:15:42 2017 +0200

    Added mockData

[33mcommit f3deddc4caa0cd90d3b8f8969a231fa99580e0f1[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 17:30:39 2017 +0200

    Added GroupMap

[33mcommit c7733f281ce13b0ab3b2df7aa91f74109af82d6d[m
Merge: b535dd98 c08b8593
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 15:07:31 2017 +0200

    Merge branch 'quasar' of https://github.com/yunity/foodsaving-frontend into quasar

[33mcommit c08b8593ffbd3762083af29ea452a09ba5180832[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 15:02:48 2017 +0200

    Set DISABLE_EXTRACT_CSS in correct place

[33mcommit 473cdcac763428ff8e7e8cb5b26013e4b21b2ad4[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 15:00:00 2017 +0200

    Fixup building static storybook

[33mcommit b535dd9886c93c3fda7c673129d803e5e77b99b0[m
Merge: 5a0d0b1e 6a6cd35d
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 14:58:49 2017 +0200

    Merge branch 'quasar' of https://github.com/yunity/foodsaving-frontend into quasar

[33mcommit 5a0d0b1ece27d159f59150cf5bb5731371bcf778[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 14:58:01 2017 +0200

    Added AmountViewer and AmountPicker functionality

[33mcommit b89286fef2ce2858a58b62b24689788471b84e44[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 14:09:43 2017 +0200

    Update yarn lockfile

[33mcommit e47496f687ad6c24eaf9bf5c8caa28d542b4e574[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 14:09:20 2017 +0200

    Remove auto fix eslint in webpack
    
    It fights with intellij...

[33mcommit 1a848ff8538cc24d53d4f0355a1398da24ceac52[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 14:09:08 2017 +0200

    Add i18n

[33mcommit 6a6cd35d75509480721e3c369803263137b3600d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 15 13:41:26 2017 +0200

    add addresspicker demo

[33mcommit c3587ce3f5a12d9824dfde0f25e23d79706909c6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 15 13:34:18 2017 +0200

    add map demo

[33mcommit 1b0da8d204feccc35752e025efa9627274b4778a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 15 13:20:53 2017 +0200

    remove demo component

[33mcommit 9de4ffeb90c47a06172571409f87e441c286ea22[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 15 13:20:20 2017 +0200

    add pickupseriesedit component

[33mcommit e2a09e061bf12bcbca8b55d8c6ab659972b477aa[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 13:09:06 2017 +0200

    Fixed Amount picker

[33mcommit b8fcb2142b0aa9b9f9b45f4e365cb70939f82174[m
Merge: 6f880feb 45a20e1e
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 12:56:19 2017 +0200

    Merge branch 'q-add-components' into quasar

[33mcommit 45a20e1ebdce2358a2ed803b8bf2e1f9749317e3[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 12:55:42 2017 +0200

    Renamed Layout, added AmountPicker

[33mcommit 6f880feb8665ffd925bbd4d61278d2ba2027ed0d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 12:51:07 2017 +0200

    Use new path to assets

[33mcommit 0116a4954278905b9a5ead445913db5d0553c567[m
Merge: da8e08eb f0c75561
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 12:39:25 2017 +0200

    Merge remote-tracking branch 'origin/q-add-components' into quasar

[33mcommit da8e08eb335d73e6aafc8b664557cddbb01f21e1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 12:38:16 2017 +0200

    Add loglevel logger

[33mcommit 1c1e2c429bd716f883f44350d8caa75803003ba6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 02:31:44 2017 +0200

    Fixup socket

[33mcommit 842c514ac5e58e886ea44edd111cbdbc8f9bdfe6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 02:21:47 2017 +0200

    Remove unused getter

[33mcommit bd8929c684a38d4429fa2e9cd0217435b55a47f8[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 02:21:19 2017 +0200

    Add pickups store module

[33mcommit f0c75561cd17dd3a2bcca35711c1fdf97caf7eda[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Sep 15 00:50:14 2017 +0200

    Improved Layouts

[33mcommit 4029abd916fc16d13bc4bcdd44b698bf0f748ac2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 00:35:40 2017 +0200

    Remove karma conf

[33mcommit 063305e0c7651327b5cee28cc6929a5b3276d0c5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 00:19:16 2017 +0200

    Add yarn lockfile

[33mcommit 42ed3809e361fb3a19f7166551da31837258bcd5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 15 00:19:07 2017 +0200

    Add a basic jest test

[33mcommit d7de975706e58ddf3bc4e4cea1dd429845605a7c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 14 23:51:27 2017 +0200

    Improved Layout

[33mcommit ca95e3b2a0360b87f7c609ae0a1527bf894ceb76[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 14 23:29:44 2017 +0200

    Added Logo, layout, topbar etc.

[33mcommit f65fbc3e56dd6d4fcf53f772592c3d1fbe016c69[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 23:24:35 2017 +0200

    Switch to babel-preset-env

[33mcommit fdae5945e63b9803984095d6fed093a40dd2328d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 23:08:11 2017 +0200

    Add utils file

[33mcommit 4425570422b4a1e799fab3cabcf9d31640cc174b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 23:03:23 2017 +0200

    Update yarn lockfile

[33mcommit 58d9731046eadaafd52b45baa6c4c7440894be25[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 23:03:03 2017 +0200

    Connect/disconnect socket on login/logout

[33mcommit bb4c2279ae46ba538cfa71cba4760255da4d0c36[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 21:36:43 2017 +0200

    Add conversations store

[33mcommit c3bd87ae140bc7aceecc375494e7911bc3d9e29c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 14 19:40:06 2017 +0200

    Added Sidenav boxes and ProfilePictures

[33mcommit 6b33e5f3cb5927329e37a56d8840b386e7745329[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 18:08:19 2017 +0200

    Fixup some group methods, remove delay

[33mcommit 4bea43b3c96a69256ba198f12782075418be4538[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 18:06:40 2017 +0200

    Add auth api methods/store and more group methods

[33mcommit cf9f662d62e36489551195990b2567a63b28fbde[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 17:04:51 2017 +0200

    Add yarn lock

[33mcommit aa18cf0985d2518f0c9adf8e72f16839d05b8565[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 17:04:30 2017 +0200

    Add basic veux store

[33mcommit 51ad00fffa0836bc6d87cf636769fa70bc2a198d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 17:04:19 2017 +0200

    Proxy to dev backend

[33mcommit fb100efc3ce0f6d0b88a032afb32792d091a73bd[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 17:03:29 2017 +0200

    Rename Hello component to Home

[33mcommit 5229270b19813860cdf498f162fc8f681893fa36[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 14 16:35:18 2017 +0200

    pickupItem and pickupList

[33mcommit bde2f2d009ae6bf3e99a5ce1fa39ae67e03d7437[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Sep 14 16:25:08 2017 +0200

    Added nbproject to gitignore

[33mcommit 381e04343bcd22e09e653b4f9bf8c7a555554c70[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 16:15:43 2017 +0200

    Add yarn lockfile

[33mcommit 1156cb01da5d6c182fbfb3c823c650f851ff74f7[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 16:15:29 2017 +0200

    Gitignore yarn error and .idea

[33mcommit 256dbf95fd4d654b642c4f34bc5cf5532e89a8db[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 16:13:53 2017 +0200

    Add root webpack config
    
    Allows intellij plugin to read webpack aliases

[33mcommit 266ea4989cc6751a80f5ecc637e3a10a3b4e4efe[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 16:13:33 2017 +0200

    Add basic component and story

[33mcommit 1b0766243c631fad7e34ee6d993e3b016d57360f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 15:58:22 2017 +0200

    Add storybook conf and scripts

[33mcommit 25a9d06e2649752ea8c7dc7c410f123800b6f502[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 15:56:39 2017 +0200

    Add storybook deps

[33mcommit b28c8c45e692855084d7d54078dd9866b5e47e65[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 15:55:53 2017 +0200

    Add veux dep

[33mcommit dbf0db9fef624a4baf3de352a3a5bce0997a3a42[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Sep 14 15:51:28 2017 +0200

    Add initial quasar template

[33mcommit c4742995d6d17f827f634ddf966d94a1a0b0d70f[m[33m ([m[1;33mtag: v3.1.1[m[33m)[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Sep 10 22:36:08 2017 +0200

    thorough rename to karrot

[33mcommit e8a430cbffd4dd539e4e075da9fde5759f09627c[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Sep 10 21:53:48 2017 +0200

    Rename to karrot

[33mcommit 986bd422f31b8e327835b47aac4ae6f6abada08c[m[33m ([m[1;33mtag: v3.1.0[m[33m)[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 1 15:44:50 2017 +0200

    Use includes() for string and array inclusion test
    
    Get rid of those .indexOf() >= 0 tests

[33mcommit df30f2613074557a66d0692ce12410a37b25ba20[m
Author: Janina Abels <djahnie@disroot.org>
Date:   Fri Sep 1 18:17:20 2017 +0200

    Update ROADMAP.md
    
    add the idea for custom categories to group stores in.

[33mcommit 12fc76fcab648f9adfe0957b5cef2d87ea5dbc14[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 1 19:12:45 2017 +0200

    dependencies upgrade to latest

[33mcommit de615f97eafbfcfc59c5843c70f65aa5bb098e07[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 1 18:59:35 2017 +0200

    upgrade packages

[33mcommit fd0f56691ddcec1e375a538232e5640cf82d08c5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 1 18:54:58 2017 +0200

    update locales

[33mcommit 4377506829dabb47be5966e1ff2f563560f0fea4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 1 01:53:46 2017 +0200

    actually add feedback service

[33mcommit c68b4602ab009f1206bfa241d2b0f272f9040b25[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 1 01:52:20 2017 +0200

    add a nice litte user flow

[33mcommit 3ac5f4462af2fb6fea5b984ea4378fac1adf9cee[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Aug 31 21:33:24 2017 +0200

    add feedback service and integration

[33mcommit 953a05f01144e2e8e19f5f24f8ee2e1289928343[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Sep 1 09:39:46 2017 +0100

    Update roadmap to mention legal entity discussion

[33mcommit 0bcdec7053f977550ba8b60ad4f9872b9149fbce[m
Author: Jasim <jasimtaqi@gmail.com>
Date:   Sat Aug 26 15:56:17 2017 -0700

    replace calls to  with calls to ScreenSize.isGtXs

[33mcommit ab0de2268b450908f3a19c94162afeb317d396e7[m
Author: Jasim <jasimtaqi@gmail.com>
Date:   Sat Aug 26 15:40:17 2017 -0700

    add function to check for extra-small screens to ScreenSize service

[33mcommit 46b46fe3e69283f8c07cf05d1710c6d393e4b967[m
Author: Jasim <jasimtaqi@gmail.com>
Date:   Sat Aug 26 15:26:48 2017 -0700

    shorten ScreenSize service function name

[33mcommit 0a0cc3bdcf696de377d9141e16e23090df5ea86d[m
Author: Jasim <jasimtaqi@gmail.com>
Date:   Sat Aug 26 15:11:34 2017 -0700

    replace calls to  with calls to ScreenSize service

[33mcommit e9e51696be0343d1f15fa6f8c08b0dff77f632ec[m
Author: Jasim <jasimtaqi@gmail.com>
Date:   Tue Aug 22 20:06:11 2017 -0700

    refactor: Create service for determining screen size
    
    The service provides a function that wraps $mdMedia (an AngularJS Material service)
    and returns a boolean indicating whether a screen is wider than 960px.
    
    The service can be extended by adding similar functions to test for other breakpoints.
    
    Resolves: #465

[33mcommit 55764710ebdfc3c7245562cba05790609b4e9365[m
Author: jherfst <jozuaherfst@gmail.com>
Date:   Fri Aug 11 11:57:38 2017 +0200

    ignore intelliJ dir (.idea) en fix bug (view all groups on group info page
    not working)

[33mcommit 7830612e1deac9ed35c6bd1e6e3c62d1ed8e58ab[m
Merge: 44bf340a 4a5fa8f3
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Aug 11 15:02:04 2017 +0200

    Merge pull request #591 from yunity/404page
    
    404 Page

[33mcommit 4a5fa8f30c80637e38f9b6062c1f36a7c3bcbec6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Aug 11 13:37:41 2017 +0200

    Removed login redirect from groupInfo
    Destructured group.beMemberOrRedirect error

[33mcommit 5be1829b93a178ddb57187fadc96650b213a5b46[m
Merge: 670fade9 44bf340a
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Aug 11 13:25:44 2017 +0200

    Merge branch 'master' into 404page

[33mcommit 44bf340aaec01a07260be2b498f4e67e288e3a46[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Aug 10 22:25:20 2017 +0200

    update lockfile

[33mcommit 7b68be73e9ee0cc5fab63baed3e5ede274de6c8b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Aug 10 22:09:34 2017 +0200

    switch to yarn

[33mcommit be6bb69b1782985f28879fc14c0069905c8c7105[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 2 11:39:27 2017 +0200

    add greenkeeper-lockfile

[33mcommit 670fade97d54d8d2baaff9d0035ee7267c2e961c[m
Merge: 07d70ede 1b245da7
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Aug 11 11:45:59 2017 +0200

    Merge branch 'master' into 404page

[33mcommit 1b245da70204430b126bade2e13b15615aadaafd[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Aug 9 13:21:54 2017 +0200

    add hint to test groups, remove old feature discussion

[33mcommit 4cb08a23333eeafd84b91428b5b1e7f67772567d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Aug 8 12:00:12 2017 +0200

    Test socket (un)subscribe and not-json error

[33mcommit 786cc096d175e4e2e9b0575b83a6790e42b193e5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Aug 8 11:59:55 2017 +0200

    Don't throw error for invalid json, just log error

[33mcommit 208dd5ad9fdb9ddc03425d0ff5ebeff8b7c6fe15[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Aug 8 11:24:55 2017 +0200

    Remove groupDetail dev conversation ui

[33mcommit 1c1bf7f2cd6f43ebb83fedb98f2fbc81e9d069b3[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Aug 8 11:21:43 2017 +0200

    Add group conversation test

[33mcommit 8f8e6e92cc2010fa15862682cd86dbeb40ab8f19[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Aug 8 11:18:47 2017 +0200

    Consistent test module name

[33mcommit 9be6b07906dac571fbeb34c1e054019c392ccc30[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Aug 8 11:18:29 2017 +0200

    Use wss if on https

[33mcommit 7e3d1b4e662c764effc25dbba085af72a72acdef[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 20:10:06 2017 +0200

    reload stores data on storeDetail/groupDetail init
    
    otherwise the store list and store map gets stale when other people changed something on the server

[33mcommit 26cba7bf2361912f52dc0e729740b80dca6438e5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Aug 7 21:36:09 2017 +0200

    Add some conversation module tests

[33mcommit 419d1ae2c34f7e5119ba9f58a43d8368675e5f50[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Aug 7 16:49:36 2017 +0200

    Fix group tests by using mock conversation service

[33mcommit 9df9719074ba0d6a08cab0cbf6809296ff815035[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Aug 7 16:49:22 2017 +0200

    Add basic conversation service and dev-style ui

[33mcommit 41c83708d97e7bf5394f018e2e1dc2b7232937dc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 8 23:52:24 2017 +0200

    add test for login

[33mcommit e690f8ad811cd3542d6b89accaf62def4f023220[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 8 23:35:12 2017 +0200

    remove console.log

[33mcommit d72363a7670c271db5ecfe27de9c5aed3ac8b986[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 8 23:33:33 2017 +0200

    remove hookProvider from template

[33mcommit 98c32e4b70535a6e76fa72a7acee29fdc9391f3a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 8 23:22:08 2017 +0200

    add back topbar Auth loading

[33mcommit e25846306adcb3e07990c1e7ae6320efe6caca3e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 8 23:09:08 2017 +0200

    change caching strategy
    
    Instead of using a custom promise in SessionUser, use the $http cache to allow frequent calls to Authentication.update(). The cache is reset on login and logout.

[33mcommit f0fcfc679caf3ce0f55d53976bba4207a666bc0d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 8 00:32:02 2017 +0200

    fix tests

[33mcommit 9fdb9dbaabc05646156053b6f4501e38b806727b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Aug 8 00:00:06 2017 +0200

    handle changes to SessionUser.loaded

[33mcommit c54d41ee5df41ded7051515ba7e93eaf12e6b5b4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Aug 7 23:26:50 2017 +0200

    use resolves as redirects
    
    load the authentication data on app startup

[33mcommit 8389dfb58f97eb192f75c9629d989f323d6c709d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Aug 7 21:12:46 2017 +0200

    authCheck next version

[33mcommit 7ffaa785bd87c0d1b188ea8f525542a062f593df[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Aug 7 18:26:46 2017 +0200

    basic authCheck structure

[33mcommit 07d70ede99bc907e9cc66a08f55a0cfa91928e97[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Aug 10 16:40:43 2017 +0200

    Added tests for group and store

[33mcommit ac260175950d6f74705d0c0ee4f1cd61212a7c5c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Aug 10 15:55:01 2017 +0200

    Redirectet user, store, group and group-detail pages
    Made non-authenticated

[33mcommit d6516ff261e0464bf8bf33ff47e28264c9c88135[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Aug 10 15:33:58 2017 +0200

    Added notFound page

[33mcommit 075c22f322fb0f12adead33c3106eb1771b5265f[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Tue Aug 8 00:19:52 2017 +0000

    fix(package): update typeface-cabin-sketch to version 0.0.35

[33mcommit 5e497cdb5d6c1f3c70bb94630cf0bf634cbd4ea2[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Mon Aug 7 18:30:56 2017 +0000

    fix(package): update typeface-cabin-sketch to version 0.0.34

[33mcommit 401aec1574d9e1728f83b33b0d8833a22ba9ea42[m[33m ([m[1;33mtag: v3.0.2[m[33m)[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Aug 7 13:35:20 2017 +0200

    fix tests

[33mcommit 483531632be1cfd1a43b9ca6b013837dcbd43f63[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Aug 7 12:33:04 2017 +0200

    make sure to always load group data on init

[33mcommit 9504d7915c4352695e4ff7590b789f102b14dda3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Aug 6 13:39:41 2017 +0200

    switch to most recent node and npm
    
    no compatibility needed with deployment server, as it only serves static files

[33mcommit 058f0182180066139fc5bc987a1616420c6c74c4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Aug 6 13:23:34 2017 +0200

    set different node version
    
    circleci somehow stuck to 4.2.6 before

[33mcommit 89e05d970402ed84a8c2bc5ec07876a732b9f2b0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Aug 6 11:03:58 2017 +0200

    add noscript message

[33mcommit b24e6ed911ca864addbb6fb2b9b11fe7fb7bf252[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Aug 6 02:11:01 2017 +0200

    link back to the landing page
    
    Closes #488

[33mcommit 33ecd34286a53887d62b6600a1e4bbcdae6d5734[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Aug 6 01:40:40 2017 +0200

    fix groupInfo redirect if non-user
    
    I removed the hookProvider since this also works for anonymous users (SessionUser.value is undefined)

[33mcommit aecb34eba85943c14485a504e52fa5fc20c07e5b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Aug 6 01:26:51 2017 +0200

    redirect to login page if resolves return error
    
    this fixes "blank page" problems if the user is not signed in
    
    Note that interrupted connections could also cause this, so probably this would need to be handled in future.
    With this, the hookProvider could almost be removed

[33mcommit a80cc39dae9e89c77dfe8718307455b6d531f9c1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Aug 6 00:54:29 2017 +0200

    fix opacity in overview mode, reduce opacity for users

[33mcommit c63e5970e0e539c022e37761dd4dd572a3f68d7c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Aug 5 19:47:54 2017 +0200

    workaround md-button on leaflet issue

[33mcommit 14e633e620eca64452e8f0f5d0fc0cdaf53fb7d1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Aug 5 19:29:39 2017 +0200

    remove unused isCreate state

[33mcommit 4d96ab61e510bdc6af855d50b261d96746bef0fd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Aug 5 19:24:47 2017 +0200

    add translateFilter stub

[33mcommit 89521c186814f41f9f8d3cf6c42e85a640bbcba3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Aug 5 18:35:54 2017 +0200

    refactor and improve groupMap
    
    - increase overview max zoom to 14
    - rewrite getMarkers to fully non-pure style instead of half functional (woah so much state!)
    - change CurrentGroup.map.overview explicitly via setter, simplifies watch
    - store-centered mode also has a setter now
    - store-centered mode: set opacity to 0.5 for non-selected stores
    - store-centered mode sets $ctrl.center explicitly
    - many new tests

[33mcommit 749c4c52c1df3b09b8c729726550c1ec397f2e40[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 20:23:12 2017 +0200

    simplify groupMap watchers

[33mcommit eb0850d4ffae8379201e43c4f58ce7c127458cbf[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 20:10:06 2017 +0200

    reload stores data on storeDetail/groupDetail init
    
    otherwise the store list and store map gets stale when other people changed something on the server

[33mcommit 3c493e5b5a500f303889b5f6bf177314a7fb10e0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 19:37:09 2017 +0200

    make 'search' string translatable

[33mcommit a4cd6e65908cf11e231815822d2478cc0cd6f7cd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 19:24:29 2017 +0200

    reload group list when clicking on group _groupMenu
    
    prevents outdated group list, e.g. when leaving a group

[33mcommit b62d9614885e10529be5321570c34d73e01371f1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 19:04:04 2017 +0200

    hide map toggle if no stores exist

[33mcommit 4622c0cce67c4fee3012fdfe6a346162b0d4b5da[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 17:36:40 2017 +0200

    show store map even if address is not filled out

[33mcommit de90a0ef8d57acf1728ee4cf7640f9c3f3057731[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 17:18:17 2017 +0200

    groupEditCreateForm to use mapPicker
    
    Closes #580

[33mcommit 2bc2fbd2f941aab6bb51b88e94b17c95310ba915[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 17:02:58 2017 +0200

    sort store list by name
    
    should also handle non-ascii characters

[33mcommit 1d1cbe86705e89cfadc03e415b559a0ce363a54a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 16:14:02 2017 +0200

    close sidebar after changing the language

[33mcommit 470cef04d9911e94fbeed6dd33c23b3ba8aceba1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 11:45:59 2017 +0200

    remove spaces

[33mcommit 9503aea02822640a2eb745d5c19e587ffa7c2136[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Aug 4 11:37:11 2017 +0200

    hide login button, sidenav button on the left

[33mcommit a23fc30747041c86cb05bed4925da6ce234f5393[m
Merge: 26b38cf3 501d09bd
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Aug 6 13:05:34 2017 +0200

    Merge pull request #581 from yunity/feedback-people
    
    Added illustration for feedback amount

[33mcommit 501d09bdf8bfaabe4d9624a9c8467006ee6e1de9[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Aug 6 12:05:12 2017 +0200

    Added imageLinks to controller

[33mcommit f04521534610ab2c7aed2eff12e10ceee1d60f68[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Aug 5 23:22:43 2017 +0200

    Added tests
    renamed getHight to isHigherImage

[33mcommit 3f4458d79f8ea630f33fb195686f8cb56afeee48[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Aug 1 00:26:00 2017 +0200

    Changed > to >= signs

[33mcommit 42e0307a64fd921d21c98a4af507b98d0930b3d0[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Aug 1 00:02:27 2017 +0200

    Added illustration for pickup-feedback amount

[33mcommit 26b38cf3516afc85f808495a19bd58fde88face6[m
Merge: e78034f6 83621b6b
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 31 15:25:00 2017 +0200

    Merge pull request #575 from yunity/pickup-feedback
    
    Pickup-Feedback

[33mcommit 83621b6b1004fd21573169de9209329e0f877288[m
Merge: 7313eb3a e78034f6
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 31 15:15:30 2017 +0200

    Merge branch 'master' into pickup-feedback

[33mcommit e78034f67ee28b2252e10076373624c20ad8b01d[m
Merge: ff1bcfe3 62f21e5f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 31 15:02:13 2017 +0200

    Merge pull request #579 from yunity/fixaddressfield
    
    add md-floating-label to mapPicker

[33mcommit 62f21e5f7029a3a6676b7362981bb16866467640[m[33m ([m[1;31morigin/fixaddressfield[m[33m, [m[1;32mfixaddressfield[m[33m)[m
Author: djahnie <djahnie@disroot.org>
Date:   Sun Jul 30 17:49:54 2017 +0200

    add md-floating-label to mapPicker

[33mcommit ff1bcfe307ae306025025a953225d361c900181f[m
Merge: 0f0021cf e453eca2
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jul 29 18:00:38 2017 +0200

    Merge pull request #578 from yunity/revert-576-greenkeeper/file-loader-1.0.0
    
    Revert "chore(package): update file-loader to version 1.0.0"

[33mcommit e453eca2d0c01b8b3a4bf8ce732d60dca670a879[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jul 29 17:59:30 2017 +0200

    Revert "chore(package): update file-loader to version 1.0.0"

[33mcommit 0f0021cf9f768dc3a739cdc97ef5338a7a7ede4b[m
Merge: c860f84f 5b54946a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jul 29 07:27:05 2017 +0200

    Merge pull request #572 from yunity/groupMap
    
    GroupMap for desktop

[33mcommit c860f84f2d0f02d20055a01b9659d4aadc942b1d[m
Merge: 6cb2bcb5 524b0ca3
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jul 29 07:23:48 2017 +0200

    Merge pull request #576 from yunity/greenkeeper/file-loader-1.0.0
    
    chore(package): update file-loader to version 1.0.0

[33mcommit 6cb2bcb53e195a45d319bd00d471ec85603aab70[m
Merge: 7eb3908a 5f19135d
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jul 29 07:23:05 2017 +0200

    Merge pull request #574 from yunity/pickupDescription
    
    rename pickup comment to description

[33mcommit 7313eb3a658cb79a0ac12b38e5606bca3c7793e3[m[33m ([m[1;31morigin/pickup-feedback[m[33m)[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Jul 28 13:11:26 2017 +0200

    Added feedback page (no functionality yet)

[33mcommit 5b54946a71c40799c49025b60ea7eb6b7e77e2e2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Jul 28 10:57:54 2017 +0200

    groupMap-Popups: Replaced <a> with <md-button>

[33mcommit bfdb853ff9b116c745c7acfdd25ad54703cec248[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Jul 28 10:47:22 2017 +0200

    Added awesome markers to package.json

[33mcommit 4105d0e95e81bc6b6bfb231ca1e40bbaa0e49cf4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Jul 28 10:40:18 2017 +0200

    Changed "watcher" to "deregister"

[33mcommit e8dc76670b888377a614308a0dd7adaef7ab0689[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Jul 28 10:38:01 2017 +0200

    Removed unnecessary spaces

[33mcommit 5f19135d25eb7eebccf7fcf08db178e2c1c0dade[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jul 27 12:55:57 2017 +0200

    rename pickup comment to description
    
    I didn't rename the translation keys, as syncing it with transfex is a
    pain

[33mcommit 524b0ca3c35803f4def75dbe4e5a0ba7809d56a6[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Wed Jul 26 22:05:51 2017 +0000

    chore(package): update file-loader to version 1.0.0
    
    Closes #573

[33mcommit f2b36e6c06971f93948f133991d240a4d2323f11[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jul 25 12:06:07 2017 +0200

    Moved icons closer together

[33mcommit 3e285e6ff02301a2a4eb1e0af5a14a1c71ec6e5d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jul 25 11:52:24 2017 +0200

    methods -> data, removed timeouts

[33mcommit 6d93037b3fb3a398a20cedab6a84878c3034f659[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 18:43:02 2017 +0200

    Fixed fa rules to only change groupMap toolbar

[33mcommit f4bf7113b5f31330589121388b5f33e24a49879a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 18:36:25 2017 +0200

    Added tooltips to show/hide buttons

[33mcommit b90ffe742c6311b4f1b4f9ac51584b356feef619[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 18:21:01 2017 +0200

    Fixed indentation in groupOptions

[33mcommit a760d7f7178130b58400fe048ef6ffc45a3c5621[m
Merge: e2a943c8 7eb3908a
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 18:19:03 2017 +0200

    Merge branch 'master' into groupMap

[33mcommit e2a943c80bad27a019d30d25106a7e572ddcc957[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 18:17:03 2017 +0200

    Added awesomemarkers
    removed unnecessary return statements

[33mcommit 7eb3908a43b5ad68e2326436e89d806ad93c9626[m
Merge: ea162d30 fb141bd1
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 24 18:08:28 2017 +0200

    Merge pull request #569 from yunity/userMapEdit
    
    User map edit

[33mcommit e5810abcb1bddd55abfbf35689ac0119d5e5552b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 17:29:34 2017 +0200

    Added show hide buttons, added options to currentGroup.map

[33mcommit 8539144f17865029e71cf647941ac36ae43dda31[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 16:12:09 2017 +0200

    Added invitations to groupOptions

[33mcommit d049c9fd716976bfb4856f2fa8171cd9838d5733[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 16:09:12 2017 +0200

    Fixed merge error

[33mcommit 1061eb619768e761c442148e60f6020e96987016[m
Merge: 60c01d09 ea162d30
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 16:08:23 2017 +0200

    Merge origin/master into groupMap
    
    Conflicts:
            client/app/locales/locale-en.json

[33mcommit fb141bd17f0449f8480d099488e5971f2f1de6bf[m
Merge: b77e654d ea162d30
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 16:04:37 2017 +0200

    Merge branch 'master' into userMapEdit

[33mcommit b77e654d5b55cf3f12476b6e2109eda643be9ed3[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 16:02:47 2017 +0200

    Changed binding to two way binding
    Fixed margin 0 auto on main panel

[33mcommit ea162d3040d07d414b88957b3d379cf57132701d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 24 11:45:55 2017 +0200

    update locale

[33mcommit 751917997ece6e5e18bc4585b935bd0eaf064d7f[m
Merge: c48fff9a 1f51da3b
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 24 11:30:19 2017 +0200

    Merge pull request #562 from yunity/invitations
    
    Invitations frontend

[33mcommit 1f51da3b7250d9ab91996bbc8b9d41163ff4029f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 24 11:18:22 2017 +0200

    test if email fills from url

[33mcommit 64212641a444e949292021d9a0b69142d1ac47ba[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 24 10:17:59 2017 +0200

    catch and show invite error

[33mcommit 4bef544c07d4f1785ff2ad361aa28a13ca4df2d2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 24 09:57:28 2017 +0200

    use invitations in message

[33mcommit 9b8a3f8c989956652e95b92cac3fe6ad1f463a56[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 24 09:16:11 2017 +0200

    bind this
    
    validator gets called from another context, so we need to bind our
    'this'

[33mcommit e449cc60beec27cd8af2951edf05b6114a29a234[m
Merge: e9ec5e25 c48fff9a
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 01:41:32 2017 +0200

    Merge origin/master into userMapEdit

[33mcommit e9ec5e253b1b3fe115fb05b146b785f63b98b76f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 01:40:00 2017 +0200

    Added map to userDetail

[33mcommit 558176ee7a021dfbba5a01a6fe626ef7a94dc881[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 01:12:02 2017 +0200

    Added map to userEdit

[33mcommit 924389c628b420caf5339dc93a4a603adfe1643a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 01:02:40 2017 +0200

    Fixed init on create

[33mcommit bd6123422783295e674851421d1ea9bae7803b9d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 24 00:58:34 2017 +0200

    Added mapPicker

[33mcommit c48fff9ab05d02f74369e69fbad143c8cd28776c[m
Merge: 0f6d76ab 7d06019a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jul 23 23:17:47 2017 +0200

    Merge pull request #568 from yunity/designFixes
    
    Quickfix: Toolbar fixed on mobile not overlaying anymore

[33mcommit 4e47bc118ed2a016f0537c75fe97b0db6304f100[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 23 23:13:52 2017 +0200

    test accept invite and redirect

[33mcommit 7d06019aef2ad50fc0caec3e66a86a16e202c752[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Jul 23 22:57:07 2017 +0200

    Fixed topbar and made toolbar-font a little smaller on mobile

[33mcommit 60c01d094b38bbba639366fe29911784ea80c789[m
Merge: b3657c70 0f6d76ab
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Jul 23 22:42:49 2017 +0200

    Merge origin/master into groupMap
    
    Conflicts:
            client/app/components/group/groupDetail/groupDetail.controller.js

[33mcommit b3657c70639f74b6ccf4fe357db3f2e779ee60de[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Jul 23 22:27:50 2017 +0200

    Added users to map (not tested yet)

[33mcommit b7922c4c27400c3ac835e0fd34b026258ee5410c[m
Merge: 7e3f17df 0f6d76ab
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 23 22:04:22 2017 +0200

    Merge branch 'master' into invitations

[33mcommit 0f6d76ab0d49d618978b0d70dc3f35e1d7843684[m
Merge: 688ad349 cb523c1b
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jul 23 21:51:08 2017 +0200

    Merge pull request #564 from yunity/newLayout
    
    New (group navigation) layout

[33mcommit d44938d90df6a98a5f91d3654d5fac19696a3401[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Jul 23 21:46:05 2017 +0200

    Removed map from stores page on desktop
    Fixed style issue with mainPanel being bigger than sidenav

[33mcommit def3799038e437d006a0d4e60de2cdb1f655090c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Jul 23 21:30:31 2017 +0200

    Added groupMap
    Removed map from storeList on desktop
    Added zoom for stores and groupDetail

[33mcommit cb523c1b567ad19031ea3219128457cbd6fe42e4[m
Merge: 0583bf40 688ad349
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Jul 23 14:33:05 2017 +0200

    Merge origin/master into newLayout

[33mcommit 0583bf40ae9c8c9bf3a8d7d13a4e4e3613d0bd6c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Jul 23 14:31:48 2017 +0200

    changed "more options" to lowercase

[33mcommit 0745bd4c912cacd46f0c3b76a5d9836c8a8bbe89[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Jul 23 14:30:22 2017 +0200

    Improved sidenav closing by watching stateChanges

[33mcommit 688ad34949a202334f8bb5e2f2acf3fdf25571b3[m
Merge: 5277155a c388d475
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jul 23 14:06:09 2017 +0200

    Merge pull request #565 from yunity/improveGroupJoin
    
    Fix/improve group join

[33mcommit c388d475fb2b6694bcaf60c621cef6a7be440c11[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 23 11:45:55 2017 +0200

    make join-group available for not-logged-in users

[33mcommit 22b9fa86dada4a8078d4fecb6f1571453c5cab1d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 23 11:44:47 2017 +0200

    fix home redirect

[33mcommit 333740644f8c9f1e5c7905a3b8e3bc2dc0e6ae06[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 23 11:43:52 2017 +0200

    align join button to the right

[33mcommit 6a2af4c23a5231718d6c9210d4d3b4f79c1e0c9a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 23 11:43:15 2017 +0200

    add padding to group list

[33mcommit 3d3734695abfb72a02a62b3ea8a304eeb1330e59[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Jul 22 22:57:14 2017 +0200

    sidenav: Fixed z-index
    topbar: position: fixed on mobile

[33mcommit a0733abf4df8581febb3ea5910e4bad1020140a6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Jul 22 21:57:20 2017 +0200

    Added groupOptions menu

[33mcommit 5aeda5251965fe035696487467979e3de40bd558[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Jul 22 21:00:09 2017 +0200

    Moved sidenav to left
    Added store list to sidenav
    Removed stores tab on groupDetail

[33mcommit 7e3f17df3ba590a1f62e2900e4b0dcc1343a6de0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 21 20:40:24 2017 +0200

    remove log statements

[33mcommit 7fdeefec4f632880214470eb5663c0dfc48375c5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 21 20:33:13 2017 +0200

    add tests

[33mcommit 014530b6967eee88f23df8fbed6d4a6bda2121ba[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 21 20:13:03 2017 +0200

    add navigation

[33mcommit 264497930c57aab589e0ad586ab0912c428fbdc9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jul 21 19:39:09 2017 +0200

    check if already invited

[33mcommit 64c53b879611f4eaecca815e52f48c5dbe68557a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jul 20 20:08:19 2017 +0200

    add invite UI

[33mcommit cb415fe8308db3969b7710786f123cd0f90a32b7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jul 20 19:30:21 2017 +0200

    parse email from query parameters

[33mcommit 51b96870f813984666f22e536a6e2fe73a5ea34f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 19 15:06:51 2017 +0200

    WIP: accept invitation

[33mcommit b8c6fe3583d9187274ada4f5c02294bb84b758bb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 19 14:13:30 2017 +0200

    add invitations service

[33mcommit 5277155a584d4ecb65100399c7865d5d48fd56d1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 12 14:10:47 2017 +0200

    remove wrong alt attributes

[33mcommit 313c16b38007e43f92fe1987075ebe3269134250[m
Merge: 57dfa887 8abcd979
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jul 12 12:13:16 2017 +0200

    Merge pull request #558 from yunity/pickupListImprovements
    
    Pickuplist Design-Improvements

[33mcommit 57dfa8877325e7a635bb28e1a8c80e6665971a92[m
Merge: 8763988e 20922f76
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jul 12 12:12:31 2017 +0200

    Merge pull request #560 from yunity/greenkeeper/typeface-cabin-sketch-0.0.31
    
    Update typeface-cabin-sketch to the latest version 🚀

[33mcommit 8763988e244212a880165d29f5e980fdcf142223[m
Merge: e0455c63 1b97b164
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jul 12 12:12:10 2017 +0200

    Merge pull request #557 from yunity/groupJoinImprovements
    
    Group join Improvements

[33mcommit e0455c63ef7fac3bb422c64812a0c29edf0646d2[m
Merge: 86ea91e2 103b63db
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jul 12 12:09:07 2017 +0200

    Merge pull request #559 from yunity/moreDenseLayout
    
    More dense layout

[33mcommit 86ea91e2c531695d0d4c177bd8311ed2d836a7c0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jul 12 10:35:57 2017 +0200

    update locale

[33mcommit 7cfda17b0bec81b665773815b632375b30a3fc62[m[33m ([m[1;33mtag: v3.0.1[m[33m)[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jul 9 17:58:09 2017 +0200

    replace lesser with lower

[33mcommit 20922f7674502346de7e59699cefb610d5602aef[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Fri Jul 7 20:00:29 2017 +0000

    fix(package): update typeface-cabin-sketch to version 0.0.31

[33mcommit 8abcd979aba13eee25d4c2ff8cfc20c9d4ed1f7d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Jul 6 12:02:48 2017 +0200

    Fixed style error

[33mcommit 103b63db25341236014a3ed4d6ccee0c1cd0954d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Jul 6 11:58:47 2017 +0200

    Fixed width of pickuplist icon buttons on mobile

[33mcommit 6e8786defa7f17cc9289068ffd9a7f9843ede788[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Jul 6 11:46:55 2017 +0200

    improved store-list layout on mobile

[33mcommit 9f34250f6f3b074f3ecfe4302f45a3820c7d4be7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Jul 6 11:40:24 2017 +0200

    Group Description:
    - expandable panel is always expanded on mobile
    - font size on mobile is smaller

[33mcommit 8f9b3f3bbb17b2b828bad504bf524a3480272305[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Jul 6 11:36:06 2017 +0200

    Titlebar buttons closer together
    list items more closer

[33mcommit a351f8f59fdfcd0e923e8d175ccdd1236a7e23e2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Jul 6 11:21:17 2017 +0200

    Pickups you joined are now green

[33mcommit 1b97b164f3404cf39f075c866445b56db8cacb14[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jul 5 11:49:46 2017 +0200

    Fixed "resolve then" and URL-name

[33mcommit 5db6bbdc9ae3305a8a1a6ec706916875d250cfa2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jul 5 11:39:30 2017 +0200

    Fixed height of comment field and buttons

[33mcommit 63b31aa0af27671a9c7596b66f1fcd2dce3a8df6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jul 5 10:54:13 2017 +0200

    fixed lint camelcase error...

[33mcommit 0cd26a1a590f4beb7a73261d2f142f65568fb7a3[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jul 5 10:52:11 2017 +0200

    Added stripes to empty pickups

[33mcommit 71b02007afe39e7f8e8b7a27e10e6152654d717f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jul 5 10:33:34 2017 +0200

    Added profilepics to pickuplist

[33mcommit 1f087b305dbb6358ddeeee8fa6331bad42d8aadf[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jul 5 09:08:57 2017 +0200

    Fixed test

[33mcommit c35f40eb861f48d40d750a1c597fb148159563e6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jul 5 09:02:51 2017 +0200

    Made style more consistent (used main-panel everywhere)

[33mcommit d9311d989e9a02a36006ec4eb2f527f1ede1ea45[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jul 5 09:02:21 2017 +0200

    groupList is now a component, not a page
    added joinGroupList page

[33mcommit 73eb68d9bbaedda7d584a7b8c65d5e7da35de1dd[m
Merge: c24e2a97 550b89a2
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jul 4 23:58:20 2017 +0200

    Merge pull request #556 from yunity/groupList
    
    new group list and changed join group flow

[33mcommit 550b89a2c37651344a8bfbe92e494310cf769b84[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jul 4 12:43:57 2017 +0200

    remove unused variable

[33mcommit c7e040287565101f8c2e6074fa83631e0ba7615d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jul 4 12:18:46 2017 +0200

    new group list and changed join group flow
    
    users now go to groupList to select their group, then visit the details
    on groupInfo and the joinGroup dialog optionally asks for password
    
    public_description supports now styling with markdown

[33mcommit c24e2a97a7a2f752c4670e5d96cfaa16bc5cf550[m
Merge: 98216583 7e0ac0c7
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jul 4 09:36:57 2017 +0200

    Merge pull request #555 from yunity/timezoneAutocomplete
    
    autocomplete valid timezones

[33mcommit 7e0ac0c73b06d3e79ec036b738f8d2e205ca7ab7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jul 4 09:26:29 2017 +0200

    autocomplete valid timezones

[33mcommit 9821658390e3cd6c067eb4175f2701ed612a817a[m
Merge: ca417846 9ce84608
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jul 4 08:24:47 2017 +0200

    Merge pull request #549 from yunity/pickupComment
    
    add pickup comment field

[33mcommit 9ce84608352680d62a56d036515db32932ad1ee3[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Jul 3 23:59:10 2017 +0200

    Changed style of pickuplist-items

[33mcommit ca417846e7b88bdc1a9c88e7cfd6164c48851b2f[m
Merge: 965fced8 7ad5bd1e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 3 23:52:44 2017 +0200

    Merge pull request #554 from yunity/angular165
    
    update to angular 1.6.5

[33mcommit 7ad5bd1e0e555df43d9fab37a477f56a60d2b59a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 23:46:21 2017 +0200

    update to angular 1.6.5

[33mcommit 965fced863666b1a14acfda0a425e3088d6a1543[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 3 17:48:10 2017 +0200

    add idea of having a legal entity and TOS

[33mcommit 3d1bee963f9bc2be162d5c8335cb23bcb5e5079d[m
Merge: b8e4cd45 9e8f9ee6
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 3 15:11:51 2017 +0200

    Merge pull request #548 from yunity/generatorTestTemplates
    
    add template test to generator

[33mcommit b8e4cd457746e81cc5262e9c10f5b718e97a29fd[m
Merge: d1d04123 3402ae89
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 3 15:11:30 2017 +0200

    Merge pull request #547 from yunity/leanImports
    
    Shorten imports

[33mcommit 7f4fe304fbb824a42ddbb2de914ca1efdbd83d9a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 14:43:20 2017 +0200

    add pickup edit button in store view

[33mcommit 06d60f29ea3511e540e3773e59a9723c4b993df0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 13:06:11 2017 +0200

    add pickup comment field
    
    Closes #158

[33mcommit 9e8f9ee6cc25ea90e121929ab556c8dce9473b79[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 09:14:28 2017 +0200

    add template test to generator

[33mcommit 3402ae894942ca054bc6dd3ffe08bd05459cbc02[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 08:58:03 2017 +0200

    shorten imports

[33mcommit 7ce9c4120712ecbe7d0e73e158f0bddf44aff736[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 08:57:12 2017 +0200

    add client/app as resolve directory
    
    allows us to write shorter import statements

[33mcommit fafd42d7405aaa69eca1e42c776301daa7728a3c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 08:56:27 2017 +0200

    ignore vscode conf

[33mcommit d1d04123b4d4d0307ffde7657198eb375f6fc928[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 08:38:30 2017 +0200

    fix text overflow error

[33mcommit 8aeaf7870ea6aa0851e8c1783d84e5dac65887be[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 07:59:49 2017 +0200

    update locales

[33mcommit 84d640c34ce45eb3d90d5d06488744a0e7beccbd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 07:54:06 2017 +0200

    release v3.0.0

[33mcommit 2789e93a854e43fcdeda4ba4886c3a15f4a12666[m
Merge: 901d2004 a2f8579d
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jul 3 00:26:43 2017 +0200

    Merge pull request #446 from yunity/testTemplates
    
    Start testing compilation of templates

[33mcommit a2f8579dbe3b947c7d759f2921663fbec22826a7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jul 3 00:13:36 2017 +0200

    remove zombie code
    
    this has already been removed in master!

[33mcommit f7749b3db0522c2ab980b610befa5879db8de4c1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 2 23:54:15 2017 +0200

    disable some ARIA warnings

[33mcommit 11b668454ab06536d2bafb402fb4d48643b0e85d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 2 23:37:02 2017 +0200

    fix code errors

[33mcommit e0a0d0775ee59b46455572f3c28bcc6ad219dc9f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 2 20:25:39 2017 +0200

    remove some unneeded code
    
    hopefully...

[33mcommit 26759778179b5e049f832ec280af62dd9a008614[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 2 20:25:13 2017 +0200

    update karma reporter

[33mcommit 375d67798b59ff79e5fc4367835e426e49036e12[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 2 19:58:51 2017 +0200

    clarify eslint rule
    
    some code had to be indented more

[33mcommit 252d63c496b56596ac73a3037731ef0a4abe7089[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 2 19:53:16 2017 +0200

    upgrade gulp-eslint

[33mcommit 34e95f0138285a5e8f534f006c4046bd685a2512[m
Merge: 89b1f26a 5f1b604b
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 2 19:15:14 2017 +0200

    Merge branch 'master' into testTemplates

[33mcommit 901d2004668e6defe5f5c54568753211ccb9f59e[m
Merge: 5f1b604b 4092ecef
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jul 2 16:28:10 2017 +0200

    Merge pull request #545 from yunity/planning
    
    fstool planning

[33mcommit 4092ecefd42234a742bff297b9f2a55388795086[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jul 2 13:44:45 2017 +0200

    add new planning stage

[33mcommit d2fbf8c0e762fcf7adb8f785010fa691ea3f3a6c[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jul 2 12:51:34 2017 +0200

    roadmap clarification

[33mcommit 5f1b604b8773656c1238c22f88eedc6517d62e52[m
Merge: f69470c3 aaa0e7c1
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jul 2 12:12:39 2017 +0200

    Merge pull request #542 from yunity/temporarilyKillPackageLock
    
    remove package-lock.json

[33mcommit aaa0e7c1cd9c3abb10766a0403ff76e120e05567[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jul 2 12:01:30 2017 +0200

    remove package-lock.json
    
    until npm problems have been solved

[33mcommit f69470c3e94a0b150209be73cd37bcee4bcd4507[m
Merge: 20cbb0f3 5204a31e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jul 1 19:09:23 2017 +0200

    Merge pull request #540 from yunity/showMissedPickups
    
    show message in history if pickup was missed

[33mcommit 20cbb0f3316bf2a752f7ee0834ddb06c9afee5b8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 1 19:08:13 2017 +0200

    support eslint v4
    
    ecmaFeatures.modules was moved to parserOptions.sourceType = module

[33mcommit 5204a31ebc43b3af47d0e3c38765f78abd5382f2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 1 18:55:50 2017 +0200

    show message in history if pickup was missed
    
    showed up as PICKUP_DONE before

[33mcommit 29e039590e63ad9a3008c6e146d7279f7759c820[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 1 15:17:11 2017 +0200

    update dependencies

[33mcommit 1698aa1593a6ed71cf877b482cd1b60146f842e1[m
Merge: c5f335de 4ec9e296
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jul 1 09:31:07 2017 +0200

    Merge pull request #537 from yunity/fixLocalize
    
    don't localize if no language is set

[33mcommit 4ec9e296a63fd186738c15e0766ef21a3c92f80c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jul 1 09:22:26 2017 +0200

    don't localize if no language is set

[33mcommit c5f335de8006180776ff44cc42039a18c612f00e[m[33m ([m[1;33mtag: v2.1.7[m[33m)[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Jun 30 17:18:23 2017 +0200

    Roadmap update after pad meeting/call

[33mcommit 7197b11b7244486d41fad7685aa512909d3e1a1b[m
Merge: 6bd841c2 f0d0a133
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Jun 29 12:40:20 2017 +0200

    Merge pull request #533 from yunity/designImprovements
    
    More Design improvements

[33mcommit f0d0a1339fb2cc5ce3f3ceb9be3283e73b879938[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 28 21:07:41 2017 +0200

    Fixed test - added GroupService to GroupPopup

[33mcommit 8671fe6f2f5c5d645492ee0b3ce3b6c2bec7b97f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 28 20:58:24 2017 +0200

    Sidenav: icons are now fixed width

[33mcommit fd9fe87a1160cb68c952cf05783f13cd29b7bd5f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 28 20:49:21 2017 +0200

    md-toolbars are now all 42px high - removed unnecessary styles from styl files

[33mcommit 991e4ae5af08845b7c7d3184c557a03279396e81[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 28 20:28:25 2017 +0200

    Fixed width of carrot on mobile on splash screen

[33mcommit d3dab4ab595e2812e2ed8babac26445bcdb82b2a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 28 20:21:21 2017 +0200

    Made groupInfo more pretty

[33mcommit e01e167b5094501a4418269177e520827a60c812[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 28 19:59:43 2017 +0200

    removed outline on "Have a look at our map"

[33mcommit 80de01250586be018880fa0ff41d1293ef5d699e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 28 19:56:04 2017 +0200

    Removed text of icons on mobile

[33mcommit 6dfa3b5691899593dbbbba5bd697b0ef6569c8a3[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 28 19:42:43 2017 +0200

    redid group popup

[33mcommit 89b1f26a213c8a5ea0c5fa82ce308687d793087f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 28 18:48:59 2017 +0200

    Solved some more issues

[33mcommit 6bd841c2aa3f338147b53510e5b0146caa590202[m
Merge: ccf18ed3 0af39db8
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jun 27 18:34:54 2017 +0200

    Merge pull request #532 from yunity/runE2E
    
    Run end to end tests

[33mcommit 0af39db81ec084606d81a3c450a91474ab9e1a5a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 27 16:48:55 2017 +0200

    fix quotes

[33mcommit a0ebf91e469d86860a68f7888020828aca855a0c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 27 11:01:29 2017 +0200

    pass branch as parameter

[33mcommit 3b64d56abed4c3608b041c8d96b83f764006c693[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 27 10:54:52 2017 +0200

    pass branch

[33mcommit 126fbd86bd134097247e0b550a33a44126e37fd7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 27 09:51:12 2017 +0200

    run e2e test on push

[33mcommit ccf18ed34d25e5024252534eb934a6453168d895[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 26 23:59:32 2017 +0200

    completely refresh package-lock.json

[33mcommit 416248a9e963bab4845e64310e7559438b3e2c7e[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jun 26 15:00:57 2017 +0200

    switch to dev.foodsaving.world backend

[33mcommit 42eb3ac0b9fad871f3fc941afac97dd61d8130b7[m
Merge: 59c53e8d d60e0972
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jun 25 20:38:00 2017 +0200

    Merge pull request #529 from yunity/noWeeksInAdvance
    
    only show weeks_in_advance setting when editing a store

[33mcommit 59c53e8dc13b9f8bde06af4fd07cb709a1ae7068[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jun 25 20:32:06 2017 +0200

    dep updates

[33mcommit 187a5084569c0d1834ce98fda86f92bfac612787[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jun 25 20:27:56 2017 +0200

    reload page on logout
    
    Closes #415

[33mcommit d60e0972fabf90092b53c46480620c732f17ddd8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jun 25 19:10:37 2017 +0200

    only show weeks setting when editing a store
    
    Closes #376

[33mcommit 00752fee3d6dc537c70370dd3c1d24dcc8242a0c[m
Merge: c4cd8c0c 9d92c4d0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jun 25 19:03:38 2017 +0200

    Merge pull request #528 from yunity/sentry
    
    Enable sentry in frontend

[33mcommit 9d92c4d0e62aef344101834123815a5f5585a923[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jun 25 18:56:26 2017 +0200

    simply check in public sentry DSN

[33mcommit c4cd8c0c302383cd513d91a9c08fea467cc504c8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jun 25 12:56:01 2017 +0200

    make language menu longer

[33mcommit 9e4ba1788f90e19c8d8cc3ae2ac08de7837aa990[m
Merge: d20700dd 39c6b988
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jun 25 12:41:14 2017 +0200

    Merge pull request #527 from yunity/StylusStyle
    
    enforce stylus linting

[33mcommit 39c6b988cce8cbbd82ff89edba445906fd720d7d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jun 25 11:25:40 2017 +0200

    enforce stylus linting
    
    Closes #464

[33mcommit d20700ddacca8004230c4ea7db8cd7063a60aa78[m
Merge: e2dbadfb 4efb6001
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Jun 25 11:08:26 2017 +0200

    Merge pull request #525 from yunity/translationProgress
    
    Show translation progress in UI

[33mcommit 4efb600158712e59005839ab4ae66119a69a8cb9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jun 25 10:55:10 2017 +0200

    add test

[33mcommit 122ecbab1189d493e2609738638781807d5be376[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Jun 25 10:54:55 2017 +0200

    fix whitespace

[33mcommit 5dfbbef473fcf3d3242d891306646bc6ec16cebb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 24 15:31:18 2017 +0200

    add command to update locales

[33mcommit 3c8e9da0f130a2adbb2ed87612aadfcb9ab24875[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 24 13:13:53 2017 +0200

    show translation status in UI

[33mcommit e2dbadfbecdc5c8c1eec9798d20448a4aa8c6d02[m
Merge: 252e05e5 fd6b0b09
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Jun 24 09:29:19 2017 +0200

    Merge pull request #524 from yunity/greenkeeper/eslint-4.1.0
    
    Update eslint to the latest version 🚀

[33mcommit fd6b0b0952a0eda19083229c1df3dc00d8ce3dd1[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Sat Jun 24 01:34:19 2017 +0000

    chore(package): update eslint to version 4.1.0

[33mcommit 252e05e5d2283d467c3fff20bb10bae283068fd7[m
Merge: a9eabdeb a9cf6204
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Jun 23 22:08:25 2017 +0200

    Merge pull request #523 from yunity/chinese
    
    Add Chinese language to menu

[33mcommit a9cf6204f7dfaef28946a1dc47bf60005680f842[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 23 21:56:36 2017 +0200

    remove underscores in language detection

[33mcommit 6a4a227b48c571f9cff9ed9184948bae7c464adc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 23 21:56:00 2017 +0200

    add chinese to menu

[33mcommit a9eabdeb234242c04f5db8d1e28d11547c43ebe2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Jun 23 14:44:32 2017 +0200

    add initial chinese translation

[33mcommit cfe4400198449a95d5373fd3377b22f33710ba01[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 21 18:34:26 2017 +0200

    update lock file

[33mcommit e366fbf3c300e422cc71572ff9105ad0a3532df6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 21 18:13:04 2017 +0200

    update

[33mcommit ee04fa185e7177d4055843a18d1bc360aa33dcf7[m
Merge: 819c1baa 80836562
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jun 21 18:10:38 2017 +0200

    Merge pull request #522 from yunity/greenkeeper/supports-color-4.0.0
    
    Update supports-color to the latest version 🚀

[33mcommit 80836562313a330c0ebae88d6ccd935556713877[m
Merge: bf69db3e 819c1baa
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jun 21 17:57:16 2017 +0200

    Merge branch 'master' into greenkeeper/supports-color-4.0.0

[33mcommit 819c1baaa5311155ea78bb98c81906754216cb8d[m
Merge: bb996750 108043c6
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jun 21 17:56:35 2017 +0200

    Merge pull request #521 from yunity/greenkeeper/webpack-3.0.0
    
    Update webpack to the latest version 🚀

[33mcommit bf69db3eecf35eff58796760061820d9cf2b7f76[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Tue Jun 20 19:25:42 2017 +0000

    chore(package): update supports-color to version 4.0.0

[33mcommit 108043c64006a24b73c290307fe11b0fe6739a1e[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Mon Jun 19 16:01:47 2017 +0000

    chore(package): update webpack to version 3.0.0

[33mcommit bb996750b01f17e6b5c861789cebbb6dd5cb7b70[m
Merge: 645c0353 54106548
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jun 12 09:32:07 2017 +0200

    Merge pull request #519 from yunity/greenkeeper/del-3.0.0
    
    Update del to the latest version 🚀

[33mcommit 54106548d85627627c5af899f4cba08dc8c520ca[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Fri Jun 9 14:45:43 2017 +0000

    chore(package): update del to version 3.0.0

[33mcommit 645c0353818516a1eb3f0a90d0190465d952a51f[m
Merge: d8e11e15 6d10c096
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Jun 8 20:17:37 2017 +0200

    Merge pull request #518 from yunity/locales
    
    pull locales from transifex

[33mcommit 3f3ac1dfc4cb18503265dbeadf959bccbfdd8014[m
Merge: 74e11bb6 d8e11e15
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Jun 7 21:33:40 2017 +0200

    Merge origin/master into testTemplates
    
    Conflicts:
            client/app/components/_topbar/topbar.spec.js
            client/app/components/group/_groupEditCreateForm/groupEditCreateForm.spec.js
            client/app/components/group/_pickupEditCreate/pickupEditCreate.controller.js
            client/app/components/group/_pickupList/pickupListItem/pickupListItem.controller.js
            client/app/components/group/_pickupList/pickupListItem/pickupListItem.spec.js
            client/app/components/group/groupDetail/members/_userList/userList.controller.js
            client/app/components/group/store/_storeEditCreateForm/storeEditCreateForm.spec.js
            client/app/components/group/store/storeDetail.spec.js

[33mcommit d8e11e15434eede411c5c96c6e7e9946745d8f14[m
Merge: 4929dd31 c3dd26a5
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Jun 7 20:28:32 2017 +0200

    Merge pull request #516 from yunity/storeHistory
    
    Add history tab to store page

[33mcommit c3dd26a56df25e00731a60d985aa24278c757a1d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 7 20:26:32 2017 +0200

    make storeDetail state abstract
    
    only the substates are being routed to

[33mcommit b4f00b7971e8f26e0db840b1769958b75bff9e4c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 7 20:19:29 2017 +0200

    remove unneeded services

[33mcommit 4136c84b8b23b41361f024e76f851b4e0ef5a86a[m
Merge: 5e4c7324 4929dd31
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 7 20:08:42 2017 +0200

    Merge branch 'master' into storeHistory

[33mcommit 6d10c096a53cd4c780fe3be28fd4749292271b27[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jun 7 19:24:56 2017 +0200

    pull locals from transifex

[33mcommit 4929dd31f64cb7579883553a5ba80d3535c42f8f[m
Author: SiddharthaSarma <sidduinevitable@gmail.com>
Date:   Wed Jun 7 22:36:05 2017 +0530

    Issue 466: Added min date validation to pickup datepicker in stores page. (#517)
    
    * Issue-466: Added min date validation for the pickup datepicker in stores page.

[33mcommit 5e4c7324f2bd9311f5acdf039d2a17c34e6aa398[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 6 23:04:49 2017 +0200

    remove hook to simplify testing
    
    should still work

[33mcommit 26552e9c061c0264e2393945bea43c5a4fd5262a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 6 23:04:39 2017 +0200

    test redirection

[33mcommit 020ac4648f8a11cff600dc830f067791df949d60[m
Merge: 0a185282 1717faea
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 6 22:35:31 2017 +0200

    Merge branch 'master' into storeHistory

[33mcommit 1717faea26b146a3392ef3205d1ec32f6fa08931[m
Merge: 617803d6 105268af
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jun 6 22:30:00 2017 +0200

    Merge pull request #513 from yunity/profilePics
    
    Initials for random profilePictures #460

[33mcommit 617803d69ba799aac7d34762f6e779f4d9c04154[m
Merge: 99d3d2ed 7b1c00ec
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jun 6 22:29:45 2017 +0200

    Merge pull request #512 from MonsieurShaik/master
    
    Issue #474: Replaced Create Pickup button with Manage Pickup Dates button. Removed Delete Pickup Dates button from pickup-list-item,

[33mcommit 105268af1863cf73f19814ea114073ca886129e5[m
Merge: 9875aaa2 99d3d2ed
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jun 6 22:23:52 2017 +0200

    Merge branch 'master' into profilePics

[33mcommit 99d3d2ed081c59c68337a09d574555b5d79978e1[m
Merge: c9b4fe60 28097c69
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jun 6 22:22:04 2017 +0200

    Merge pull request #514 from yunity/removeStylusWarnings
    
    Solved stylus warnings #464

[33mcommit 0a18528294b9b2da2abbdbc519a877f40e47f4b5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 6 18:38:41 2017 +0200

    fix store links

[33mcommit ce595e6d18d33a6ca1c734d9ca81dbec86f8d682[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 6 18:34:23 2017 +0200

    fix breadcrumbs

[33mcommit 5d57e385d76527ffc47e2940217d6fe37ce98531[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Jun 6 18:16:04 2017 +0200

    add history to store page

[33mcommit 28097c695d73588db7606cc89e77a8a36b94acbb[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jun 6 02:50:08 2017 +0200

    Fixed color stylint errors

[33mcommit 3f375245346d53f93f301d8087e0964082bc35c6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jun 6 02:38:02 2017 +0200

    stylintrc: names of items are not checked anymore if they are valid

[33mcommit d2095dea9b7d2017de4b14900b8b85d4c27a2467[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jun 6 02:34:02 2017 +0200

    Fixed tons of stylint warnings

[33mcommit 9875aaa2e40968b03addf17d67bbf77774b809d6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jun 6 01:33:23 2017 +0200

    removed unnecessary style

[33mcommit 45ec84afff7f8a9ea3cc0049348eb36802f205f4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Jun 6 01:22:44 2017 +0200

    Added initials in random profilePicture

[33mcommit 7b1c00ec7f221b903ed869d40a95797b2bbaaa9a[m
Author: Sameer Shaik <clicksamir9032@gmail.com>
Date:   Tue Jun 6 02:23:02 2017 +0530

    Removed 'Check and manage pickups' button from the store details top bar as we already have a more prominent 'Manage pickup dates' button which will redirect to the Manage pickups page.

[33mcommit cc536ca1aebf18f665e8dc320abc61f26ad58c44[m
Author: Sameer Shaik <clicksamir9032@gmail.com>
Date:   Tue Jun 6 02:21:14 2017 +0530

    Removed delete pickup button from pickup list item as it was mentioned in the issue.

[33mcommit bc25b252937749cae8478d0f5c79f3686e0c81fa[m
Author: Sameer Shaik <clicksamir9032@gmail.com>
Date:   Tue Jun 6 02:20:18 2017 +0530

    Replaced 'Create pickup' button with 'Manage pickup dates' button in store details page.

[33mcommit 8f85edb9e0e975eb4d4a7227db4a2c32ef318536[m
Author: Sameer Shaik <clicksamir9032@gmail.com>
Date:   Tue Jun 6 02:19:04 2017 +0530

    Updated all the language files with new phrase called 'Manage pickup dates'

[33mcommit c9b4fe60eb82f07ccd967d758f4d830fb61b5e51[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 5 20:53:31 2017 +0200

    add new package-lock file

[33mcommit 4e4a6a5736ae4539bd0325c7f71ac272141228db[m
Merge: 72821624 b25c9344
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jun 5 20:05:19 2017 +0200

    Merge pull request #510 from yunity/verifyRefresh
    
    Refresh user data after mail verification

[33mcommit 728216244886e8278295ff57c84d6c15e025b319[m
Merge: 200a4c7d 931abbab
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jun 5 19:55:23 2017 +0200

    Merge pull request #511 from yunity/SessionUserValue
    
    Switch to SessionUser service

[33mcommit 200a4c7d8f9aa457a26af48043460e8a227bb4df[m
Merge: a29e0ddd f56b1002
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Jun 5 19:50:54 2017 +0200

    Merge pull request #509 from yunity/historyCount
    
    Show count of history entries

[33mcommit b25c9344cd8b2078e545e0d3bbdb3e754e151d12[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Jun 5 19:50:17 2017 +0200

    disable skipping of tests

[33mcommit f56b1002fe435a8a01552a4fd8703191f0d61c4e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 3 16:37:49 2017 +0200

    show count of history entries

[33mcommit 931abbab508c37fde5967aaac7b4926b063ea1c5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 3 16:27:00 2017 +0200

    refactor all to use SessionUser
    
    instead of Authentication.data

[33mcommit 60e64e13962e869f93b63f839694c29d85187125[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 3 16:26:32 2017 +0200

    add central isLoggedIn method to SessionUser

[33mcommit a31d8fbdd1ae97dabd9a2e50a908782bb199929e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Jun 3 15:50:44 2017 +0200

    refresh user data after verification

[33mcommit a29e0dddb17b8cde1b65439a62eb0b92fdb5ea9f[m
Merge: a52e780c 54e65a07
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Jun 2 10:25:40 2017 +0100

    Merge pull request #508 from yunity/greenkeeper/chai-4.0.1
    
    Update chai to the latest version 🚀

[33mcommit 54e65a0785da3e2da91b53e29f73b57cf33e1475[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Wed May 31 21:41:05 2017 +0000

    chore(package): update chai to version 4.0.1

[33mcommit 9d0b04e282a90436475dcb4aa531db00beba7ab8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Apr 14 13:49:31 2017 +0100

    add sentry package

[33mcommit a52e780c91424a3b9c81b0f3480a6c4a24a1e975[m[33m ([m[1;33mtag: v2.1.6[m[33m)[m
Merge: ffb4b4a4 4ffc573c
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon May 29 22:11:37 2017 +0100

    Merge pull request #507 from yunity/fixChecks
    
    use proper isObject/isString checks

[33mcommit 4ffc573c65cf7d853ed952986d1c29e804a706ad[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon May 29 20:38:32 2017 +0100

    use proper isObject/isString checks

[33mcommit ffb4b4a4ca22ae07db25c6b24fa0f52b3a0940e9[m
Merge: ed6bce10 7d8ae514
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon May 29 17:33:30 2017 +0100

    Merge pull request #505 from yunity/fixNullPayload
    
    history page: handle case if no payload

[33mcommit ed6bce10f66795d59d3a145bbc184d7e4190a66e[m
Merge: 33d3786c 8673281e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon May 29 17:33:09 2017 +0100

    Merge pull request #506 from yunity/verifyMailUI
    
    Improve UX when changing mail address

[33mcommit 33d3786c20609ef968f6fa24ba4730756fac86ab[m
Merge: 37b15ba5 ffade4e2
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon May 29 17:32:57 2017 +0100

    Merge pull request #504 from yunity/greenkeeper/ng-annotate-loader-0.6.1
    
    Update ng-annotate-loader to the latest version 🚀

[33mcommit 8673281e6fac2ef801703125e7d8f4018a55584d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon May 29 16:03:40 2017 +0100

    show if user changes mail

[33mcommit ffade4e29a507754a9d8e96b9d39cfa285e0f82b[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Mon May 29 13:38:03 2017 +0000

    chore(package): update ng-annotate-loader to version 0.6.1

[33mcommit 04153d31f4e56d1037e931c7699babb418d69a9f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon May 29 12:51:22 2017 +0100

    simplify $q resolves/rejects

[33mcommit 68d8e4bf677514f6771b4e238ba1351ba71119d9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon May 29 12:41:55 2017 +0100

    add proper title for verifyMail

[33mcommit 7d8ae5145ed4a8acecc4f743e86188ae2bab453b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon May 29 10:29:40 2017 +0100

    handle case if no payload

[33mcommit 37b15ba5a57625bdb574dff631979bca82e14074[m
Merge: 7dcbb490 ddec9cbb
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed May 24 16:27:15 2017 +0100

    Merge pull request #495 from tsmrachel/377
    
    Fixes #377 Group create/edit & store create/edit: check if name alrea…

[33mcommit 7dcbb490e31ea753b270927d86ab9122d69c1850[m
Merge: 0b508cbc 349d0faa
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon May 22 22:04:04 2017 +0100

    Merge pull request #503 from yunity/greenkeeper/style-loader-0.18.0
    
    Update style-loader to the latest version 🚀

[33mcommit 349d0faa4108ec260f55c39c7375d961a88c292d[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Mon May 22 06:55:47 2017 +0000

    chore(package): update style-loader to version 0.18.0

[33mcommit ddec9cbb73e902547b1dce3ee48f35f8757ab865[m
Author: tsmrachel <t.s.m.rachel@gmail.com>
Date:   Sun May 21 16:33:31 2017 +0800

    removed trailing space

[33mcommit 0f22c9fdc470eff9b3ca60606d17eee19cb651df[m
Merge: f614590d 0b508cbc
Author: tsmrachel <t.s.m.rachel@gmail.com>
Date:   Sun May 21 16:27:12 2017 +0800

    Merge branch 'master' into 377

[33mcommit f614590dc580e9ee8278f581082fa6fee7a123e0[m
Author: Rachel <t.s.m.rachel@gmail.com>
Date:   Sun May 21 16:05:37 2017 +0800

    added tests for name validation; added "ngInject;" and fixed linting errors; fixed service test errors; corrected 'store' parameter to 'group'; added 'StoreService' to store.js

[33mcommit 0b508cbc5bbb18ee3303a88ccfa2f19202763ac9[m
Merge: e886b86e 6df65ed2
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun May 21 02:02:40 2017 +0100

    Merge pull request #502 from yunity/fixShowEmptypickups
    
    fix: show empty pickups in history

[33mcommit 6df65ed2e436ee722a1c6f9ffc2ec691d6fc2dff[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 21 01:49:25 2017 +0100

    show empty pickup in history

[33mcommit e886b86e0aa544fe3057d06d7790cd2d60340ad9[m
Merge: f61b5fec efa186fa
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat May 20 12:23:24 2017 +0100

    Merge pull request #500 from yunity/checkPayload
    
    show button to historyDetail only if there is payload

[33mcommit efa186faf810dd72e973b5e8b4ba965c0afe5c7b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 19 20:16:53 2017 +0100

    show historyDetail only if there is payload

[33mcommit f61b5fece94518909532ae8b21d9d3357c37a1b8[m
Merge: 523d409b cb6b2477
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri May 19 20:09:08 2017 +0100

    Merge pull request #449 from yunity/historyFiltering#382
    
    History filtering #382

[33mcommit 523d409bdb48c4fec3398e7cd3b0ad382246e2ed[m
Merge: 2ad26a91 edd86412
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri May 19 19:51:29 2017 +0100

    Merge pull request #499 from yunity/sessionUser
    
    Introduce SessionUser and fix Auth data bug

[33mcommit cb6b2477f7408faa0ec76be26fb3a33448782233[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 19 19:47:12 2017 +0100

    enable user search

[33mcommit 50d56035d24c9436de70ee9de409824b648690a3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 19 19:13:15 2017 +0100

    use gettersetter to show log entries of unknown users

[33mcommit 94af2dced3bc3a85242243fac5e7aefd18c7c342[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 19 18:32:31 2017 +0100

    fix test

[33mcommit e4c3c9468196af17188d8279c36948b0a84f6f3d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 19 17:44:51 2017 +0100

    unify and explain translations

[33mcommit 41ef79a7ae5dcf48f9dd95f9529071064a5f7a74[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 19 17:24:25 2017 +0100

    add tests

[33mcommit 798690cd7c494113089aee8547964b9a766510bd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 19 17:24:00 2017 +0100

    save selection to separate list

[33mcommit edd86412679079108130a466dd6f4bcb903e2e19[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 19 14:16:59 2017 +0100

    persist group when user is loaded
    
    Closes #498

[33mcommit 123f26e20ff88afc02b63f938b9c6560baf53cd0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 19 14:03:39 2017 +0100

    introduce SessionUser service
    
    keeps data of loggedIn user
    provides a `loaded` promise to run code when the auth data has been
    retrieved

[33mcommit 2ad26a9152ebc14a168c2330fd0f55258cf81fc0[m
Merge: e1f13552 b249cdbe
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu May 18 23:46:11 2017 +0100

    Merge pull request #497 from yunity/showGroupName
    
    show group name on non-group pages

[33mcommit abadcdc738f41c946d5a04f63727317791ec849f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 18 23:44:02 2017 +0100

    refactor to angular style
    
    use CurrentStores and CurrentUsers as up-to-date values
    avoid explicit update() functions

[33mcommit 2f110cc1e5f43668ebb7639aac3dd1512c86e7a5[m
Merge: 0a8fc9df e1f13552
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 18 21:29:48 2017 +0100

    Merge branch 'master' into historyFiltering#382

[33mcommit b249cdbe39cfb4f5009116a9059fd1e28aa8b359[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 18 21:15:50 2017 +0100

    show group name on non-group pages
    
    if current group hasn't been loaded yet

[33mcommit e1f13552691df4c2aaed9e210b7cb7a0739f514a[m
Merge: 391d7b40 a1fc92f0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu May 18 20:24:02 2017 +0100

    Merge pull request #471 from yunity/persist-current-group
    
    Persist current group of user

[33mcommit 391d7b4033f2b40799c51e3bb93577e91036fd9e[m
Merge: 6d07a1c6 dc521370
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu May 18 20:16:09 2017 +0100

    Merge pull request #482 from tsmrachel/462
    
    Fixes #462 Refactor logout directive into controller

[33mcommit 6d07a1c640709884f641563683f1e003f0ca2c5f[m
Merge: 644aa332 2766ee15
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu May 18 20:10:01 2017 +0100

    Merge pull request #496 from yunity/updateTranslations
    
    pull from transifex

[33mcommit 2766ee155e07b1347416b442043f78046d4340de[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 18 19:56:22 2017 +0100

    reuse old translation

[33mcommit 644aa332159a97d38a026bab488b874376cfcdb7[m
Merge: 13d2c997 4c4a8e43
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon May 15 17:21:16 2017 +0100

    Merge pull request #494 from yunity/historyDetail
    
    Simple detail view for history and "load more" button

[33mcommit 84a013cb99e3fbf432ce8e9f1d386b96d8e173e1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon May 15 17:19:45 2017 +0100

    pull from transifex

[33mcommit 2bc5a652db98dca0a9f6cf4c8c23e383e9c221e4[m
Author: Rachel <t.s.m.rachel@gmail.com>
Date:   Mon May 15 22:02:59 2017 +0800

    Fixes #377 Group create/edit & store create/edit: check if name already exists

[33mcommit 4c4a8e43f20015f9a25402eb77592b846b05c38a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon May 15 14:27:02 2017 +0100

    userList: retrieve user data from currentUsers

[33mcommit 738440b646cf903c0d0dd6a6fdbac270bfbe20f7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 14 15:08:52 2017 +0100

    profilePicture: load user from currentUsers

[33mcommit 5fd8d8c91b056ef8fca0fae87efb8d899e1ccea8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 14 13:48:44 2017 +0100

    retrieve store name from CurrentStores

[33mcommit 609434665744f3c77469036fd624c02994d79ab5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 14 13:23:34 2017 +0100

    refactor closeDialog

[33mcommit 7468b20a8909f1a82fd0089acdefad4e48056ef5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 14 12:49:06 2017 +0100

    adapt history service test

[33mcommit dd0313ae651bb1d6ba9672320de18bed96023eb1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 14 11:42:39 2017 +0100

    test history component

[33mcommit ffa2b07adb2d7bbc1a10dd84ffb047d27f8dcd1a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 14 08:56:46 2017 +0100

    use bind() instead of passing 'this'

[33mcommit b533fbcbc9948b313305a042d9d3e0856277512e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 14 08:25:26 2017 +0100

    switch to material design

[33mcommit 13d2c9976a6d03f1fbd06cd55f14429de5e1839f[m[33m ([m[1;33mtag: v2.1.5[m[33m)[m
Merge: b9d017fa 15b465d2
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat May 13 18:51:04 2017 +0100

    Merge pull request #492 from yunity/disableAriaWarnings
    
    disable ARIA warnings

[33mcommit b9d017faf9c54b929a9cf4653665ca60be766508[m
Merge: 41b93ee9 51eeaa9e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat May 13 18:50:48 2017 +0100

    Merge pull request #493 from yunity/stylint
    
    enable stylus linter

[33mcommit ed8a74ca6db4b5a0aa17f37a6707052121bd3d83[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 12 21:56:36 2017 +0100

    disable button if no more data can be loaded

[33mcommit 67bdd2ac7a66cf9e5ae18e3233fecb0152a76f2c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 12 21:37:33 2017 +0100

    let template call controller functions

[33mcommit 97f89157a252099d9abb46202054da22aeedf005[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 12 21:25:01 2017 +0100

    load more history entries

[33mcommit 453904cf88dac9b3df8d82e4a439fe47729328ac[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 12 20:03:00 2017 +0100

    make more pretty

[33mcommit e855c39a3abedd7cd22d0a18fa6412ad33bdd84f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri May 12 14:23:34 2017 +0100

    add debug view for history entries

[33mcommit 41b93ee9a86118a27870d39202571161746ee6e9[m
Merge: dfc0824c e4b2cd32
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu May 11 15:14:10 2017 +0100

    Merge pull request #441 from yunity/addEditstoreMap#391
    
    Change Store/Group location by clicking on map #391

[33mcommit e4b2cd323ad4173bb471f0451b83e3ed7b58c814[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 11 14:51:46 2017 +0100

    make group map clickable

[33mcommit 5c6a4c1ae53c418f001a25c6c69b9237b7acfece[m
Merge: 0643c2ff dfc0824c
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 11 14:51:12 2017 +0100

    Merge branch 'master' into addEditstoreMap#391

[33mcommit dfc0824c562ba2562120026ebb1333ac0da292c0[m
Merge: f040a7c4 eecc4a08
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu May 11 14:23:08 2017 +0100

    Merge pull request #420 from yunity/372_RefactorPickupList_JoinLeave
    
    372 refactor pickup list

[33mcommit eecc4a08be3b5b2b01c15df52e0fc2c497418af4[m
Merge: cc511224 f040a7c4
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 11 14:15:01 2017 +0100

    Merge branch 'master' into 372_RefactorPickupList_JoinLeave

[33mcommit cc511224f6ebe1b13e397be49a8255d5a7ab8ee4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 11 14:04:46 2017 +0100

    add more tests

[33mcommit 795bfe160b4d56dc66b020967164b4678f426cd0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 11 13:39:40 2017 +0100

    refactor into more angular-style code
    
    template should call controller functions

[33mcommit 3af2652c6dd7d5c03a1c3e7c11716a759192867e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 11 11:45:27 2017 +0100

    add currentUsers service

[33mcommit 80cbfbb15f4a72f999098fd4324cb3d3c7380e91[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 11 10:33:49 2017 +0100

    add tests

[33mcommit c87e98d9d57e1256f531fe97e0df37c5b2f61ca9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu May 11 10:21:44 2017 +0100

    switch to Array.find
    
    better use plain Javascript

[33mcommit 51eeaa9efdbe2b77228b9701a7436677efaf46a8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed May 10 21:18:26 2017 +0100

    enable stylus linter

[33mcommit 15b465d22468b0113735d699e5ffe2111c92353a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed May 10 17:30:11 2017 +0100

    disable ARIA warnings
    
    let's wait until it becomes a problem
    Closes #461

[33mcommit f040a7c400a17e35a167c2a95878b5232f302b5e[m
Merge: e5511bd7 69fd3ed5
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed May 10 17:21:16 2017 +0100

    Merge pull request #491 from yunity/webpackUpgrade
    
    Webpack upgrade

[33mcommit 69fd3ed56aaac91e6a3992df6ff3e4fb90d0ce9e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed May 10 17:08:31 2017 +0100

    update karma webpack config

[33mcommit fa2bca1bd28a77c93da5ee0e246bc0636895a871[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed May 10 16:53:25 2017 +0100

    upgrades for webpack2

[33mcommit 3100ab6a7168ac96ae605ed0c7774a7b799b8736[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed May 10 16:33:34 2017 +0100

    switch to webpack2 loader syntax

[33mcommit 59092c0e0f485d65e1713a380f9c78ce099a06ce[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed May 10 16:20:54 2017 +0100

    json loader is not required for webpack2

[33mcommit f5390b65601bc96053b53984fa61b433aa90dc1d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed May 10 16:17:03 2017 +0100

    fix postcss loader warnings

[33mcommit 2f362de46975c22d39425d7b1b1410044c5c08c3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed May 10 16:08:54 2017 +0100

    fix name of angular-ui-router

[33mcommit cba7a0be20a31ee8fed730bbcb6f993a02d5392b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed May 10 16:08:40 2017 +0100

    upgrade webpack and fix loaders

[33mcommit e5511bd73858f4397aafc6aed6e9a49946151f65[m
Merge: 8581fb96 be7f1e1d
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed May 10 00:06:25 2017 +0100

    Merge pull request #489 from yunity/greenkeeper/postcss-loader-2.0.3
    
    chore(package): update postcss-loader to version 2.0.3

[33mcommit dc52137084360a6ea3020c225677cec8f0c9df6a[m
Author: Rachel <t.s.m.rachel@gmail.com>
Date:   Sun May 7 20:08:11 2017 +0800

    Fixes #462 Refactor logout directive into controller

[33mcommit be7f1e1dfdc64360d05beb03ef62fa9ab234c3af[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Tue May 9 11:28:14 2017 +0000

    chore(package): update postcss-loader to version 2.0.3
    
    Closes #487

[33mcommit 8581fb96ea58345d9dada24d638dab56df736c02[m
Merge: 8cc61e3c 26c3f418
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun May 7 17:06:03 2017 +0100

    Merge pull request #473 from yunity/refactorRootapp
    
    Refactor layouts into components

[33mcommit 26c3f41811386ac3302c0cccb570dd6d6bfd6928[m
Merge: 9abf06e3 8cc61e3c
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 7 17:52:10 2017 +0200

    Merge branch 'master' into refactorRootapp

[33mcommit 8cc61e3c903859875689f0adbc0c515e5c37dabf[m
Merge: 1427cf09 3ac50865
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun May 7 16:49:33 2017 +0100

    Merge pull request #483 from yunity/renameUirouter
    
    rename uirouter dep

[33mcommit 3ac508651ba57e86a2a7bee9e5e4a28c983b3a53[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun May 7 17:40:55 2017 +0200

    rename uirouter dep

[33mcommit 1427cf0993f5e1c7c1f89c4e7cc13645b0ae74fe[m
Merge: a958dbeb d8d07de8
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun May 7 13:26:52 2017 +0100

    Merge pull request #478 from yunity/greenkeeper/normalize.css-7.0.0
    
    Update normalize.css to the latest version 🚀

[33mcommit a958dbebd24817421a47dc7f4cd16702120d380c[m
Merge: d91e0045 175ff613
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun May 7 13:26:12 2017 +0100

    Merge pull request #479 from yunity/greenkeeper/yargs-8.0.1
    
    Update yargs to the latest version 🚀

[33mcommit d91e0045bcc266094e475952d5c005ffd3227c6f[m
Merge: 2feef524 9960b841
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri May 5 14:59:39 2017 +0100

    Merge pull request #481 from jeromechrist/459-pickupManage-backbutton
    
    changed fa-times to fa-arrow-left

[33mcommit 9960b8418463f2f00bfb822cb67c0c379c85d914[m
Author: jerome christ <jerome.christ@live.fr>
Date:   Thu May 4 22:02:42 2017 +0200

    changed fa-times to fa-arrow-left"

[33mcommit 175ff613bcef6b12b1eb16777e7c84667c43cccf[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Wed May 3 14:57:39 2017 +0000

    chore(package): update yargs to version 8.0.1

[33mcommit a1fc92f0f1091524efc88cdb9792ec61ae578de1[m
Author: ShababShahriar <sskhan11@live.com>
Date:   Wed May 3 07:22:22 2017 +0600

    Fix assert/expect call styles

[33mcommit 49d3d2837c264bfbc2370699f31fbf15feca34b1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue May 2 14:27:24 2017 +0200

    stub CurrentGroup.set

[33mcommit 13d0d88407cf5eac1eed4baf8c75b484ecc50a86[m
Author: ShababShahriar <sskhan11@live.com>
Date:   Mon May 1 08:02:46 2017 +0600

    Disable linting for snake-cased variable 'current_group'

[33mcommit 9c9f7868458d990c97ed165324b9c2aa21e08e0a[m
Author: ShababShahriar <sskhan11@live.com>
Date:   Mon May 1 07:56:12 2017 +0600

    Inject UserModule dependency in group service

[33mcommit bc3dc4fd77f843e02d2f598b98a8f011e96529a0[m
Author: ShababShahriar <sskhan11@live.com>
Date:   Sun Apr 23 16:19:03 2017 +0600

    Update tests

[33mcommit aaed57bb7c472157225713a758fc36a530c47b48[m
Author: ShababShahriar <sskhan11@live.com>
Date:   Fri Apr 21 21:48:55 2017 +0600

    Persist current group of user

[33mcommit d8d07de88e250f911fa0b5e6149fa9d17ea01bf7[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Tue May 2 18:18:54 2017 +0000

    fix(package): update normalize.css to version 7.0.0

[33mcommit 2feef524a70fa4ac87017f355f47d356315ca2ce[m
Merge: 3352f876 0c0e063c
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue May 2 14:47:38 2017 +0200

    Merge pull request #476 from yunity/greenkeeper/ng-annotate-loader-0.6.0
    
    Update ng-annotate-loader to the latest version 🚀

[33mcommit 3352f8769420f383cc182b4f305990a0c950cf18[m
Merge: 1170d304 b47fb564
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue May 2 14:47:25 2017 +0200

    Merge pull request #477 from yunity/greenkeeper/style-loader-0.17.0
    
    Update style-loader to the latest version 🚀

[33mcommit 1170d304be24ac4220925aff4867bc071d103bab[m
Merge: 396bdff4 7a73d752
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue May 2 14:42:17 2017 +0200

    Merge pull request #475 from yunity/fixDrag
    
    fix marker dragging

[33mcommit b47fb5642810631f675aa607578dd418d7a0c9e1[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Mon May 1 19:00:00 2017 +0000

    chore(package): update style-loader to version 0.17.0
    
    https://greenkeeper.io/

[33mcommit 0c0e063ce5665a452d4d6291409fc37d15d8f2a0[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Sat Apr 29 12:11:38 2017 +0000

    chore(package): update ng-annotate-loader to version 0.6.0
    
    https://greenkeeper.io/

[33mcommit 7a73d75217bd3998c2d995aaacc6584eaf4280dd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Apr 28 19:29:29 2017 +0200

    fix marker dragging
    
    keep reference to marker pin instead of overwriting

[33mcommit 396bdff41e968a7992f600cd01e0149b2cf1efb9[m
Merge: 17e2e0b5 151efb52
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Apr 28 18:33:15 2017 +0200

    Merge pull request #468 from PabloCarmona/branchForFacebookLinkIssue
    
    Added Facebook link and fixed some typos.

[33mcommit 151efb525c90e69ebb3637629e0d872c7f411212[m
Author: Pablo Carmona <pablocarmonagonzalez@gmail.com>
Date:   Fri Apr 28 16:12:35 2017 +0200

    Add link to facebook group on footer in layouts/main.html

[33mcommit 17e2e0b5df1dd27569d4737f0d7b46a2b6787f42[m[33m ([m[1;33mtag: v2.1.4[m[33m)[m
Merge: c7507acc 135edfcd
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Apr 27 23:48:30 2017 +0200

    Merge pull request #472 from yunity/greenkeeper/ng-annotate-loader-0.5.0
    
    Update ng-annotate-loader to the latest version 🚀

[33mcommit c7507acc347f03f8964b89295bdbc4ecca2e6c3f[m
Merge: be8f67ef 84b7e0e6
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Apr 27 23:45:23 2017 +0200

    Merge pull request #469 from yunity/greenkeeper/angular-material-1.1.4
    
    Update angular-material to the latest version 🚀

[33mcommit 135edfcd0c4f7ea7782d1b1df3bca2fb616d02e7[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Wed Apr 26 18:26:39 2017 +0000

    chore(package): update ng-annotate-loader to version 0.5.0
    
    https://greenkeeper.io/

[33mcommit 84b7e0e6ec0d7b62603506842516b9c0284e6301[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Thu Apr 20 21:59:25 2017 +0000

    fix(package): update angular-material to version 1.1.4
    
    https://greenkeeper.io/

[33mcommit 9abf06e30d17bb0b100fd88dc6a0adfb55a98a67[m
Merge: b491d2de be8f67ef
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Apr 20 17:45:50 2017 +0100

    Merge branch 'master' into refactorRootapp

[33mcommit 402822c1faec9cb8921dde6f6f8472b547f399f2[m
Author: Pablo Carmona <pablocarmonagonzalez@gmail.com>
Date:   Thu Apr 20 18:34:40 2017 +0200

    Added link to topbar nav to Facebook Group. Create note for eng/spa for Facebook link tooltip. Fixed typo in Github link for Spanish.

[33mcommit be8f67ef0498198aabc6202c0f68fb2466b154ab[m
Merge: d892d65f 2ed61fe4
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Apr 14 15:20:12 2017 +0100

    Merge pull request #447 from yunity/pickupManage2
    
    Additions to the manage pickups page

[33mcommit d892d65f83a66f115c153e70a54e89f788c8c343[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Apr 8 20:05:23 2017 +0100

    feat: make markers draggable

[33mcommit 8d4602d91cd0c6b3f17f189139860572600a28d2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Apr 14 15:15:14 2017 +0100

    remove trailing space

[33mcommit 4215fdd100c7e6cab97f379380df9f3a1da9488b[m
Merge: 0031ddb2 7706df85
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Apr 14 15:13:57 2017 +0100

    Merge pull request #444 from yunity/groupInfo
    
    public page to show group information

[33mcommit 7706df85cd132e889f982b4b002027e77d9365f5[m
Merge: 03d2c137 0031ddb2
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Apr 14 15:11:55 2017 +0100

    Merge branch 'master' into groupInfo

[33mcommit 0031ddb27bc254edf7d3fbda6d7e3cffde2cad84[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Apr 14 15:12:35 2017 +0200

    Design Improvements (#442)
    
    * Improved fontSize of Headers on splash pages
    
    * LandingPage: show public descriptions of groups
    
    * LandingPage: rename title to "Foodsaving Worldwide"
    
    * Topbar: Removed margin underneath on mobile
    
    * History: Added padding for description
    
    * remove wrong comment

[33mcommit 2ed61fe41f5915db542420805a083897cdbe0cd5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Apr 12 21:49:44 2017 +0100

    extend tests

[33mcommit 21de26dafefe6ed8ff8cfcf566df1d782fd7eb91[m[33m ([m[1;33mtag: v2.1.3[m[33m)[m
Merge: 903ffff7 07b5e744
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Apr 12 16:43:13 2017 +0100

    Merge pull request #443 from yunity/fixRussian
    
    fix russian translation

[33mcommit 903ffff700b7adaaf935d7c1daa19aab67ea8811[m
Merge: 73ae05dc 6d7e4f83
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Apr 12 16:42:49 2017 +0100

    Merge pull request #452 from yunity/updateSV
    
    localize: update Swedish

[33mcommit 6d7e4f835e02c68f9e7f6a7cf2b43feff13a89b0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Apr 12 16:42:13 2017 +0100

    localize: update Swedish

[33mcommit 73ae05dc457590f86aa88bb275f2bafd786e96a4[m
Merge: c5e11dfe 824cb945
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Apr 12 16:41:03 2017 +0100

    Merge pull request #451 from yunity/greenkeeper/karma-chai-plugins-0.9.0
    
    Update karma-chai-plugins to the latest version 🚀

[33mcommit 824cb9459efb7eb1661a069cc4d9ef193d51b9fe[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Wed Apr 12 11:03:42 2017 +0000

    chore(package): update karma-chai-plugins to version 0.9.0
    
    https://greenkeeper.io/

[33mcommit 2a8c633b16e995b0d4c0b35939ffc362604dd536[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Apr 12 11:57:09 2017 +0100

    refactor action menu, optimize for small screens

[33mcommit b491d2de0df68cd4ea6e68db26f7ae63e1fa0802[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 11 14:21:14 2017 +0100

    refactor layouts into components
    
    reduces style code in root app

[33mcommit 6bc2aabc95dd2b5b3a0c3575c8d7378b22a722b3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 11 11:54:30 2017 +0100

    add special text for deleting a series

[33mcommit 15c43e7171d01884d052a11ffcee3d40052cd001[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 11 11:31:36 2017 +0100

    fix links in README

[33mcommit 2bc7830fd4a2a45c8316812ac1c139ef9dae9f8d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 11 11:01:04 2017 +0100

    add pickupManage tests

[33mcommit 5f6c28fbf1ddd9262ce67b6b8ad92402f20a9d11[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 11 10:09:33 2017 +0100

    dont rely on config.series
    
    might be changed during creation

[33mcommit d05552bf9ecb2fe268c0282eaa13dd98db5dda73[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 11 10:08:51 2017 +0100

    fix tests

[33mcommit 3da04a11ee962a538947d24ab15affaca35df0ad[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 11 00:16:35 2017 +0100

    relax checking of time autocomplete

[33mcommit 4d07c086ee3ce67be3b131dd8676b068955aba3e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Apr 11 00:10:00 2017 +0100

    add tooltips

[33mcommit 0a8fc9df140ad2e1f6b635976a2e52d3a342401e[m
Merge: fb7edb13 c5e11dfe
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Apr 10 21:54:34 2017 +0200

    Merge origin/master into historyFiltering#382

[33mcommit fb7edb133ac77c1b2adb61454b1000d12273ce72[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Apr 10 21:53:36 2017 +0200

    History: Added filter options

[33mcommit c5e11dfe3402a4ebf64cd094b988d41717ff01cf[m
Merge: 7ea4def6 2b5fd064
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Apr 10 16:46:45 2017 +0100

    Merge pull request #448 from yunity/greenkeeper/file-loader-0.11.1
    
    chore(package): update file-loader to version 0.11.1

[33mcommit 7ea4def631b80f9e6e9cef76b9f7ade9b55fc223[m
Merge: b6f62120 83506720
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Apr 10 16:46:01 2017 +0100

    Merge pull request #430 from yunity/greenkeeper/normalize.css-6.0.0
    
    Update normalize.css to the latest version 🚀

[33mcommit b6f62120283b982a4829b1102955cc7f9d50e130[m
Merge: 19b0e1de 7614a7ca
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Apr 10 16:32:30 2017 +0100

    Merge pull request #432 from yunity/greenkeeper/css-loader-0.28.0
    
    Update css-loader to the latest version 🚀

[33mcommit 0643c2ff85595c4c35184308c90d8f1d720d4e94[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Apr 10 15:29:55 2017 +0200

    StoreEditCreate: Store location can now be changed by clicking on map

[33mcommit def599470d70c9b08f163714850a5328a262c239[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Apr 9 14:06:30 2017 +0100

    sort pickups and series by time

[33mcommit b683cc1867bcb19c186ade6a796c1a61001fd0b4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Apr 9 13:45:44 2017 +0100

    reduce complexity of function

[33mcommit 3399490caaef46e9945cbe4402c702b43c298001[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Apr 9 13:33:54 2017 +0100

    feat: indentation, reordering, numbering

[33mcommit 03d2c137d76ce8dc8bcf553e9e61481c1fa423c4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Apr 8 14:20:32 2017 +0100

    test: controllers

[33mcommit 6b6435d09b405c39fbfa087d33d2f129b1340ebf[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Apr 8 13:55:43 2017 +0100

    use no-padding and main-panel classes

[33mcommit 566eeabbaf37636f8afef43d0606f279ec49338f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Apr 8 13:55:11 2017 +0100

    remove global override of md-whiteframe

[33mcommit e70430489b854e669a8cc62686602129602df0a2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Apr 8 12:47:49 2017 +0100

    reword message

[33mcommit 52d03ada4c430b8c75b8e843bedb744d992bb6a5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Apr 8 12:14:55 2017 +0100

    topbar checks auth state
    
    this make is possible to use the topbar also on unauthed pages (splash,
    groupInfo)

[33mcommit 07b5e74419850fe15cfdf485561376cf7ce69aa5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Apr 5 12:10:23 2017 +0100

    fix: variable in translation string was changed

[33mcommit 32d7322f2770d8a39d29493b78122b70facb9721[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Apr 5 12:05:50 2017 +0100

    feat: reload pickups when series has changed

[33mcommit 653ddab35c04b7dc6055b3b4f518f11369359b89[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Apr 5 11:00:51 2017 +0100

    feat: delete pickups and series from manage page

[33mcommit 2b5fd0643b63462a8f78fb8753403e0c411510a9[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Sat Apr 1 11:57:58 2017 +0000

    chore(package): update file-loader to version 0.11.1
    
    Closes #439
    
    https://greenkeeper.io/

[33mcommit 32408a0193f408dfe6cd2980cdf165630d5f1de7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Apr 1 09:53:28 2017 +0100

    feat: show pickups per series

[33mcommit 76c974fd8bde917273913b52b03d5e6883fcfba1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 21:42:25 2017 +0100

    fix: groupInfo was loaded at the bottom

[33mcommit fba08437a78252b26836daf26c5d76c15e91b296[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 21:25:56 2017 +0100

    fix: didn't show public group description

[33mcommit 5318d9a57c0bf60bc5e962c27034184a9b5ac740[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 20:31:58 2017 +0100

    fix: breadcrumb for group info

[33mcommit c85da7de606004985956e07dd396a73e784f6895[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 19:14:47 2017 +0200

    test: fix test

[33mcommit fd1a6f1893b2ca200f1f4aed210548257f3e4845[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 18:30:09 2017 +0200

    test: mock translate

[33mcommit a31c4bce66805beda2de21fadf6aacfb78548a0d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 18:28:01 2017 +0200

    feat: message while redirecting

[33mcommit ac21de9515b8cc339ecb184a222de6ec15ddbf8e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 18:11:29 2017 +0200

    add icon to group info

[33mcommit 6a42b726fc23372bb63c588d07c6156de45e954f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 18:07:11 2017 +0200

    feat: link from landing page to group info

[33mcommit f6f36463a77826da766a32258a9e9e99b35ea4fb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 17:06:58 2017 +0200

    feat: button to switch from group to group info

[33mcommit 0b38cebc0b55e6f0c498f7bde71f460b3287f6f9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 16:50:41 2017 +0200

    feat: add buttons
    
    if member: go to full view
    if not member: join group (via group join dialog)

[33mcommit 06ab96069c432784887833ec8693d82263ed46d6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 15:51:42 2017 +0200

    feat: redirect to group info if user is not in group

[33mcommit 9d9277100e276d91b8e5c9473a10c1679cad805f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 31 15:25:26 2017 +0200

    feat: group info page
    
    shows group preview and location

[33mcommit 74e11bb653f8606e88fd46278f0dfa421d1759e8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 30 20:10:33 2017 +0200

    add some more aria-labels

[33mcommit 7614a7ca7ff00e7617242899fb6528a91eb33772[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Thu Mar 30 06:52:27 2017 +0000

    chore(package): update css-loader to version 0.28.0
    
    https://greenkeeper.io/

[33mcommit 835067207fef103582676bfec148350387f164c6[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Sun Mar 26 22:33:37 2017 +0000

    fix(package): update normalize.css to version 6.0.0
    
    https://greenkeeper.io/

[33mcommit dc646f30c5cfbef865c7c93185af5992b278b9a8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 25 11:57:29 2017 +0100

    pass binding

[33mcommit d7e13704733837ceae183cee36214646d60631ea[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 25 11:46:24 2017 +0100

    check if data is bound

[33mcommit b43660b1c7604f122f82fe327f5cbed48a80b86d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 25 11:42:08 2017 +0100

    handle case if binding is undefined or empty

[33mcommit 5a5b06711714f914382f5ff3f77cdeb2548677b2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 25 11:20:50 2017 +0100

    mock $translate
    
    avoids warning about missing configuration of $translate

[33mcommit 13b6f5eec50f5bef23037145ac9c0eef8a5108a5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 25 11:08:47 2017 +0100

    mock translate filter

[33mcommit 3eb0a5105ee1c3e295b6a9c6a531d72eb79d35bc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 16 22:48:55 2017 +0100

    fix some warning

[33mcommit d9a17d1b62d2359ead9a830eb1148aa6d3025361[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 16 22:18:47 2017 +0100

    all compiled

[33mcommit 8e47a988457c99750c09c330301ea0375c49b8d0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 16 21:49:38 2017 +0100

    expandable panel simple test

[33mcommit 19b0e1dee514b4d9d4f0f422f6d3108ec6d6caae[m
Merge: ffc48973 afc680c4
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Mar 23 14:01:31 2017 +0100

    Merge pull request #426 from yunity/linkTeampage
    
    feat: link to preliminary team page

[33mcommit afc680c4f56be49a8f5e51c2540e41338eff822c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 23 13:53:13 2017 +0100

    feat: link to preliminary team page

[33mcommit ffc489737f61748ce32969ba23b8c1310622ee16[m
Merge: d169fc83 f7ba19f6
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Mar 23 13:37:51 2017 +0100

    Merge pull request #425 from yunity/greenkeeper/eslint-3.18.0
    
    chore(package): update eslint to version 3.18.0

[33mcommit d169fc8314635c1fb872a34d11caa09803178673[m
Merge: d31a040d 7a01101e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Mar 23 13:26:35 2017 +0100

    Merge pull request #422 from yunity/greenkeeper/style-loader-0.16.0
    
    Update style-loader to the latest version 🚀

[33mcommit d31a040dce51ff0659f6596eed0a63a23f0b3ec0[m
Merge: d99f74a6 c9c8fdb3
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Mar 23 13:25:32 2017 +0100

    Merge pull request #424 from yunity/greenkeeper/eslint-plugin-angular-2.2.0
    
    chore(package): update eslint-plugin-angular to version 2.2.0

[33mcommit c9c8fdb320a89ee7b06767c6d69a1ea0b8e1e78e[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Wed Mar 22 20:06:33 2017 +0000

    chore(package): update eslint-plugin-angular to version 2.2.0
    
    Closes #423
    
    https://greenkeeper.io/

[33mcommit 7a01101ef03646b49dcc71ac96e7ec73d9e32e06[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Wed Mar 22 13:53:50 2017 +0000

    chore(package): update style-loader to version 0.16.0
    
    https://greenkeeper.io/

[33mcommit 2106c6cdd38c8536052a5fbcf15f3460c078bf34[m
Author: Florian <florian.gruehn@netzkern.de>
Date:   Tue Mar 21 17:36:54 2017 +0100

    #372 - added tests

[33mcommit 9855090ea97f18951c694794c0abec929557af2b[m
Author: Florian <florian.gruehn@netzkern.de>
Date:   Tue Mar 21 17:27:24 2017 +0100

    #372 - handled update on client.

[33mcommit d99f74a63176de146f3c4425b3e77d404fcbc78b[m[33m ([m[1;33mtag: v2.1.2[m[33m)[m
Merge: d0b4cb60 2d0e268e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 21 10:40:18 2017 +0100

    Merge pull request #410 from yunity/fix-store-list-updating
    
    Fix store list not updating

[33mcommit d0b4cb60487eab13184a7ff5116c306e25c12a3f[m
Merge: 7334a3ad 28b50844
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 21 10:39:43 2017 +0100

    Merge pull request #419 from yunity/greenkeeper/style-loader-0.15.0
    
    Update style-loader to the latest version 🚀

[33mcommit 2d0e268e238c75ada0c4351b085e844cff2cb640[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 21 10:38:18 2017 +0100

    refactor: use CurrentStores from controller

[33mcommit 7334a3ad5ed30e88389dcf552fc28daa96eea03a[m
Merge: ee0bd08c a1eb832b
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 21 10:26:32 2017 +0100

    Merge pull request #411 from yunity/font
    
    Include Noto font

[33mcommit 28b50844b6c73000e7d98c67ea73eb663412ac9c[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Tue Mar 21 02:31:13 2017 +0000

    chore(package): update style-loader to version 0.15.0
    
    https://greenkeeper.io/

[33mcommit f7ba19f60cff5c5788ee7082af9cf6ccd3b42cf2[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Fri Mar 17 22:17:24 2017 +0000

    chore(package): update eslint to version 3.18.0
    
    https://greenkeeper.io/

[33mcommit ee0bd08cd5974247c8d015806eca70f0494c90f8[m
Merge: 662243e0 9455acc4
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Mar 16 08:32:29 2017 +0100

    Merge pull request #416 from yunity/greenkeeper/style-loader-0.14.1
    
    chore(package): update style-loader to version 0.14.1

[33mcommit 9455acc4a99c60102fe4c645455729296d50913d[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Wed Mar 15 23:24:13 2017 +0000

    chore(package): update style-loader to version 0.14.1
    
    Closes #414
    
    https://greenkeeper.io/

[33mcommit 662243e0cc1d5f444fcd2102dcaf43670e4e03dc[m
Merge: 0721d50c 6f789ba6
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 14 01:22:29 2017 +0100

    Merge pull request #403 from yunity/deepWatching
    
    Update store map by equality watching

[33mcommit 0721d50cd9e195c5b188e448227538eeacea6f1a[m
Merge: 1a5e90b9 f5af5c56
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 14 01:21:33 2017 +0100

    Merge pull request #405 from yunity/reworkTest
    
    Rework test: use injected services from controller

[33mcommit 1a5e90b99a4baaf182c007886f8b3c54162df777[m
Author: Anannya Uberoi <anannyauberoi27@gmail.com>
Date:   Mon Mar 13 23:20:17 2017 +0530

    Added link to the landing page in logo: Issue #373 (#412)
    
    * Update splash.html
    
    * Update splash.html

[33mcommit 6f789ba69646781c0411f3c22f4ed266c43f6027[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 13 15:15:07 2017 +0100

    test: some more tests

[33mcommit 384f70792149439bd1ec16b678a9643b6584589a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 13 15:14:43 2017 +0100

    refactor: remove storeMap binding
    
    can load all data from CurrentStores

[33mcommit 87d17e6a36c26a0d5c8872cd3726571571e44d4d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Mar 12 23:26:11 2017 +0100

    Fix storeList not updating
    
    Creating clone of list means further updates will not be present
    in the cloned list.

[33mcommit dd6a8c803f5b8ca61919cd3a1d3625330585b204[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Mar 12 23:20:46 2017 +0100

    Add failing test

[33mcommit 3193527f8cf31cd301ceaf3051799ced08490860[m
Merge: 8513cfd6 cb764367
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 12 22:20:12 2017 +0100

    Merge pull request #407 from yunity/issue-406-aria-label-warning
    
    Fix missing aria-label in storeList component

[33mcommit cb7643677c537c283470fe34b19a88279d31fd64[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Mar 12 21:42:29 2017 +0100

    Fix missing aria-label in storeList component
    
    Was causing test to fail
    
    Fixes #406

[33mcommit a1eb832b7b3bc80a47740f56d6c494de45b2767e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 12 21:28:40 2017 +0100

    feat: add Noto font
    
    supports many scripts in the world

[33mcommit f5af5c56aef5b47feb0e6e2d07a99e0df187d138[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 12 18:38:02 2017 +0100

    refactor: use injected services from controller
    
    I noticed that I used to inject services only for mocking, even if they
    are already injected in the controller. This should make the tests
    slightly easier to understand and modify.

[33mcommit bbecd3d39a0ab800691c01842b9978d84e730e48[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 12 17:03:38 2017 +0100

    fix: profile picture test

[33mcommit 8513cfd61ef504952d41e4a5cc3166166852bdec[m
Merge: e40a25d2 6079ae46
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 12 08:59:22 2017 +0100

    Merge pull request #404 from yunity/andela-tisrael-feature/resend-verification
    
    Updates to notifications page

[33mcommit e40a25d264b024c0d2bc06b46b8e0ea0971d5761[m
Merge: 99c0ac17 c9382a03
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 12 08:57:39 2017 +0100

    Merge pull request #402 from andela-tisrael/feature/resend-verification
    
    Feature/resend verification

[33mcommit 6079ae462a3e789ccbbddcf39fa28fbe676f967f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 12 08:55:58 2017 +0100

    feat: rework design

[33mcommit 160bb9cfd20f5da3b64e7856630487ddc35ef005[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 12 08:18:58 2017 +0100

    test: notifications

[33mcommit 8080ac192840f6bd6186fb8d8a82ad6fa5bb7bb5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 11 23:40:40 2017 +0100

    test: resend verification service

[33mcommit 9669b09f5832f1ace58802fb2ad712e1b870c9e7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 10 13:58:39 2017 +0100

    chore: update version

[33mcommit 417ffcce9f1c74832f560b1341c44104596df302[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 10 07:41:42 2017 +0100

    fix: polyfill fs

[33mcommit ac644c450a57432aa9b77461c1b19486a06faa8c[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Fri Mar 10 05:47:17 2017 +0000

    chore(package): update css-loader to version 0.27.0
    
    https://greenkeeper.io/

[33mcommit b9f8d8dbdb06ad67aea8e8e40be96fc7fea7edb3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 11 21:34:26 2017 +0100

    refactor: rename to notifications, move inject, improve layout

[33mcommit 4b30e3b1c19b300258cc998cf60bcd4cd973378d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 11 21:30:36 2017 +0100

    refactor: rename class, move message

[33mcommit 206c527849d5c69ab47ffc321b01d19eb9016270[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 11 21:29:04 2017 +0100

    refactor: move resend from Auth to User

[33mcommit 0614c08673277ecb0650fe99d02ce6a2225d5ed4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 11 15:30:21 2017 +0100

    refactor: move deep watching to storeMap

[33mcommit c9382a03b66a303bdabca60c9b84333ccba0060f[m
Author: andela-tisrael <israel.tomilayo@andela.com>
Date:   Fri Mar 10 18:14:55 2017 +0100

    refactor: edit feature based on PR review

[33mcommit 99c0ac17669c2678815a0fd683ec5bc2eade6e11[m
Merge: 6efbfa8d a319a2fa
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Mar 10 16:29:27 2017 +0100

    Merge pull request #401 from yunity/greenkeeper/css-loader-0.27.0
    
    Update css-loader to the latest version 🚀

[33mcommit a319a2fa1168f80ed5697bcfc264edd7c83b4ee0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 10 13:58:39 2017 +0100

    chore: update version

[33mcommit 133b23f82a6f216c7d0bfc378f399b1cf157ec89[m
Author: andela-tisrael <israel.tomilayo@andela.com>
Date:   Fri Mar 10 07:59:20 2017 +0100

    feature: handle rejection for email that does not exist

[33mcommit b356a60474d34b58e29cd48e87353c0fc4edf123[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 10 07:41:42 2017 +0100

    fix: polyfill fs

[33mcommit 53e61ce6876b85917a212792cc59b38ca1c84831[m
Author: andela-tisrael <israel.tomilayo@andela.com>
Date:   Fri Mar 10 07:17:06 2017 +0100

    feature: add verification button and style

[33mcommit 1388a64328aa3ddf739dab723356eaaeec50b642[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Fri Mar 10 05:47:17 2017 +0000

    chore(package): update css-loader to version 0.27.0
    
    https://greenkeeper.io/

[33mcommit a0a761d0843554fefef4bd290b2ace8c9b79d13d[m
Author: andela-tisrael <israel.tomilayo@andela.com>
Date:   Thu Mar 9 23:27:15 2017 +0100

    feature: create a template for the notification page

[33mcommit 51fd64cdfc358443eeeb0ea93329b0f717acb3ec[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 9 16:44:45 2017 +0100

    use scope watching with equality comparison
    
    old angular behavior, can get expensive

[33mcommit 6efbfa8da6fb1d3560c75a7264a47e92a6879430[m
Merge: 4bb4ed82 b91737e5
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Mar 8 11:42:43 2017 +0100

    Merge pull request #379 from yunity/updateContributeMD
    
    Development workflow description

[33mcommit 4bb4ed82924266315d091328a6e2d92664b1b479[m
Merge: 36f9d0b9 639567d2
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Mar 8 11:41:40 2017 +0100

    Merge pull request #393 from yunity/372_RefactorPickupList_DialogFeedback
    
    #372 - refactored dialog promise to not call update every time, added…

[33mcommit 639567d24ce3cc7456fca10f6a10f2b32580883a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Mar 8 11:27:51 2017 +0100

    test: rework pickupList test

[33mcommit 38aeae56e289da84d360606542e40b5aeeb86cf5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Mar 8 10:56:26 2017 +0100

    fix: reload list if series was created

[33mcommit c406e26374ee350053e8d0e0a69e4f748643e1c4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Mar 8 10:38:45 2017 +0100

    test: add pickup

[33mcommit ebf3e6b0db2408201712df425eb189e3e842c813[m
Author: Florian <florian.gruehn@netzkern.de>
Date:   Tue Mar 7 21:24:06 2017 +0100

    fixed missing bracket

[33mcommit 8d6e3ca454e80ec23295a962ab44a4aec1451247[m
Author: Florian <florian.gruehn@netzkern.de>
Date:   Tue Mar 7 21:18:22 2017 +0100

    #372 - refactored dialog promise to not call update every time, added isMemberOf function

[33mcommit 36f9d0b9e7f7afdfbbfcf24497e4ca2983d85f87[m[33m ([m[1;33mtag: v2.1.1[m[33m)[m
Merge: 27a03c95 81231f3f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 7 12:59:30 2017 +0100

    Merge pull request #390 from yunity/fixPickupSort
    
    fix: reverse default pickup sorting

[33mcommit 81231f3f92c640aec443c6cea27516bd512493d1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 7 12:25:57 2017 +0100

    fix: reverse default pickup sorting

[33mcommit 27a03c9509ca24c4d83c349f661b5dfe803518c9[m
Merge: 2dfef94a 8e899864
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 7 12:20:54 2017 +0100

    Merge pull request #389 from yunity/fixStoremap
    
    fix: update data binding for storeMap

[33mcommit 8e899864bc179ee2474ca4a3cd2352bfec087730[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Mar 7 12:08:59 2017 +0100

    fix: update data binding for storeMap
    
    I consider this a hotfix, this is not proper understandable data flow.

[33mcommit 2dfef94a9df2e51412b5ab5b00b6ca3af0396adb[m
Merge: 46b58072 5d61f6db
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Mar 7 11:11:20 2017 +0100

    Merge pull request #387 from yunity/searchableLists
    
    Adds search option in member- & store lists

[33mcommit b91737e566536217dfb08dc039c9261a5f50732c[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 7 09:42:57 2017 +0100

    Add backend section to contribute.md

[33mcommit 62b489e76e303df79e0ce5b755209d93b6036972[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 7 09:41:25 2017 +0100

    Update README.md

[33mcommit 3831e9526d49ccefa119f1444d5bc06638ec85b5[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 7 09:28:43 2017 +0100

    Rework the general section

[33mcommit f7891d558b142937829b0a52a9f7c2aa021ce85e[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Mar 7 09:21:50 2017 +0100

    Add used tools and libraries, streamline text

[33mcommit 5d61f6db3980a2ef105a6abccea3a18cb52a0f5a[m
Merge: 2ed8faa4 46b58072
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Mar 7 00:56:33 2017 +0100

    Merge branch 'master' into searchableLists

[33mcommit 2ed8faa4710c7437183fbd2aaef63637f5474991[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Mar 7 00:55:32 2017 +0100

    Added a simple searchBar to userList and storeList

[33mcommit 46b58072948aa9e0c5fad9fcaa888541bb86aa64[m[33m ([m[1;33mtag: v2.1.0[m[33m)[m
Merge: f59a2a5d d86ef883
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Mar 6 18:44:13 2017 +0100

    Merge pull request #385 from yunity/fixPasswordreset
    
    fix: password reset button and typo in translation key

[33mcommit d86ef883c16f026023b994ecbd711898df396989[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 6 16:47:51 2017 +0100

    localize: update german translation

[33mcommit 4de53f6f5770a00568e0f0b25bad2f34f87005b8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 6 16:36:37 2017 +0100

    fix: add back time_error string

[33mcommit fb5d26ce51eabba9c4c502913ca19eb7e51da92a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 6 16:16:09 2017 +0100

    fix: password reset button and typo in translation key

[33mcommit f59a2a5dc2ce6e88b8f5e03c8b482703188556fa[m
Merge: edb8a3bd f405665a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Mar 6 12:08:40 2017 +0100

    Merge pull request #384 from yunity/cleanupStrings
    
    localize: removed unneeded translation strings

[33mcommit f405665a65cb3365c7a4d82a5cbe648a1c64d090[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Mar 6 11:46:40 2017 +0100

    localize: removed unneeded translation strings
    
    The script detects those as unneeded, but they are actually in use:
    
    ´´´
    32d31
    < GROUP.DESCRIPTION_VERBOSE
    45,60d43
    < HISTORY.GROUP_CREATE
    < HISTORY.GROUP_JOIN
    < HISTORY.GROUP_LEAVE
    < HISTORY.GROUP_MODIFY
    < HISTORY.PICKUP_CREATE
    < HISTORY.PICKUP_DELETE
    < HISTORY.PICKUP_DONE
    < HISTORY.PICKUP_JOIN
    < HISTORY.PICKUP_LEAVE
    < HISTORY.PICKUP_MODIFY
    < HISTORY.SERIES_CREATE
    < HISTORY.SERIES_DELETE
    < HISTORY.SERIES_MODIFY
    < HISTORY.STORE_CREATE
    < HISTORY.STORE_DELETE
    < HISTORY.STORE_MODIFY
    116d98
    < STOREEDIT.DESCRIPTION
    ```

[33mcommit edb8a3bd20750cf99c2fbc8f794b4853507f21b8[m
Merge: 0eae635f 0436a5e3
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Mar 6 10:19:49 2017 +0100

    Merge pull request #383 from yunity/updateChangelog
    
    Update CHANGELOG.md

[33mcommit 0eae635fc7113bc794150c40d323733a4ea4b0f1[m
Merge: 52fe6587 a49281a1
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Mar 6 10:19:30 2017 +0100

    Merge pull request #378 from yunity/#372_RefactorPickupList
    
    added function isFull

[33mcommit 0436a5e338e9625441e12e687ee3ebf8ed0eabd2[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 5 18:57:09 2017 +0100

    Update CHANGELOG.md

[33mcommit a49281a1afe36914581b2cc905f9b9f6c4ca2c63[m
Author: Florian <florian.gruehn@netzkern.de>
Date:   Sun Mar 5 18:05:15 2017 +0100

    added space

[33mcommit 52fe658749d7679d23a6041047b36c4a308eff80[m
Merge: 5d4966ad 91617110
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 5 17:49:38 2017 +0100

    Merge pull request #381 from yunity/updateFrench
    
    localize: update French

[33mcommit 91617110ae6ab03d05b59f950d9713b395db3743[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 5 17:49:09 2017 +0100

    localize: update French

[33mcommit 5d4966ad7d03b98ddb958d9a8fb563dd7c2c1a7f[m
Merge: 153e4669 d7f583de
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 5 17:46:46 2017 +0100

    Merge pull request #366 from yunity/editPickups
    
    Editing for pickups and series

[33mcommit 153e46698ced808d7b489fa633a930b1acddbae2[m
Merge: 265d7f1d 4620c12d
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 5 17:45:46 2017 +0100

    Merge pull request #370 from yunity/headlineFont
    
    fix: use h2 for passwordreset headline

[33mcommit 265d7f1df177e46ca7b4eae7a832dd8e20a04835[m
Merge: 16c48c39 26e78e16
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 5 17:45:33 2017 +0100

    Merge pull request #371 from yunity/watercolorHttps
    
    fix: use HTTPS for landing page tiles

[33mcommit 39763e607e2c37d3ed896d2c1e6fc1363814d9be[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 5 16:03:33 2017 +0100

    Development workflow description

[33mcommit 03203a38cd4b3c7434dc61a214906e2c50f25330[m
Author: Florian Gruehn - netzkern <florian.gruehn@netzkern.de>
Date:   Sun Mar 5 15:36:39 2017 +0100

    added binding for metadata and added tests

[33mcommit eeb28d4b4173f30b0b7615c5978afb50fb0ee432[m
Author: Florian Gruehn - netzkern <florian.gruehn@netzkern.de>
Date:   Sun Mar 5 14:17:37 2017 +0100

    added function isFull

[33mcommit 26e78e169b8c2002d43d8343dd0a3fc2fee04adb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 5 12:04:44 2017 +0100

    fix: use HTTPS for tiles

[33mcommit 4620c12ddeb05d8b676659351bcbd34b545a0cc1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Mar 5 11:54:50 2017 +0100

    fix: use h2 for passwordreset headline
    
    similar to login and signup

[33mcommit 16c48c39dd48779c1b1ae208eceee9d20162c435[m
Merge: 69adcf48 42abfe09
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Mar 5 11:47:14 2017 +0100

    Merge pull request #369 from anne27/master
    
    Formatted splash page to match landing page text Issue #365

[33mcommit 42abfe09a77d07d59b36afd33870d85a3738a871[m
Author: anne27 <anannyauberoi27@gmail.com>
Date:   Sun Mar 5 15:51:09 2017 +0530

    Update app.styl

[33mcommit 76e0225423ced4a320c11aac0ce37c7589d92881[m
Author: anne27 <anannyauberoi27@gmail.com>
Date:   Sun Mar 5 15:50:31 2017 +0530

    Update splash.html

[33mcommit 0781c5ced4634dc61853303dcaf7f2a8233a6364[m
Author: anne27 <anannyauberoi27@gmail.com>
Date:   Sun Mar 5 15:12:06 2017 +0530

    Update splash.html

[33mcommit dce54137c3a043a7b511074ca12954cbec5d86cc[m
Author: anne27 <anannyauberoi27@gmail.com>
Date:   Sun Mar 5 15:11:08 2017 +0530

    Update app.styl

[33mcommit f2224181c0803a89d510400a29845a69d6cbaab8[m
Author: anne27 <anannyauberoi27@gmail.com>
Date:   Sun Mar 5 03:22:43 2017 +0530

    Update splash.html

[33mcommit 21776dd8e6199a2ca66bdf87ea7d6a4ca2fc4eef[m
Author: anne27 <anannyauberoi27@gmail.com>
Date:   Sun Mar 5 03:10:57 2017 +0530

    Update app.styl

[33mcommit 7f2350f10a0c17e915df9db0f2aae178b523fd9f[m
Author: anne27 <anannyauberoi27@gmail.com>
Date:   Sun Mar 5 02:17:14 2017 +0530

    Update splash.html

[33mcommit d7f583de082a6370ae501447cef864252b6881c8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 4 19:44:26 2017 +0100

    feat: default date is now tomorrow

[33mcommit 499f1b16d0f775b22429c036eb8146d6cb7360ec[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 4 19:35:51 2017 +0100

    feat: pre-fill time field

[33mcommit 6b87c8a582ee5f137ff77422aa7ffa4d28c1181f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 4 19:08:33 2017 +0100

    test: timeLookup

[33mcommit dd3fd8ee8768ebf30bd71f19b21bfe13485b2192[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 4 18:41:52 2017 +0100

    test: managePickup extended

[33mcommit bcf2221d64bac42724574ae213aba0084acdb2c6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 4 18:41:23 2017 +0100

    refactor: reduce $onInit, create small fns

[33mcommit 761dd5a1f9efadba71dc208b5850ea97fb54d507[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 4 17:41:46 2017 +0100

    test: pickupEditCreate extended

[33mcommit cf185c363a26a68f3b86cd96c6879bf223dcc11c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 4 17:41:25 2017 +0100

    refactor: split single and recurring data

[33mcommit 8aa96ce61a91de63db0fa070cf945b9929dda25b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Mar 4 13:59:52 2017 +0100

    test: fix test

[33mcommit 69adcf48062cb8e9b693b647eaa2840070271291[m
Merge: 216d8407 321cf8e0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Mar 3 20:51:14 2017 +0100

    Merge pull request #368 from yunity/greenkeeper/yargs-7.0.1
    
    Update yargs to the latest version 🚀

[33mcommit 52ef883d989ec34aa2421315adcdf738ecf97fe9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 3 20:36:07 2017 +0100

    feat: use md-autocomplete as time picker

[33mcommit 5cabd8ba6c8c8902482cc942401b6813d13bfc09[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Mar 3 20:35:31 2017 +0100

    feat: use localized time example

[33mcommit 321cf8e04b07e7cc05ce81eef4a2ac69e9aca467[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Fri Mar 3 18:45:58 2017 +0000

    chore(package): update yargs to version 7.0.1
    
    https://greenkeeper.io/

[33mcommit 95e0fee411e8cff9f1c0c7b3cb129e0fc40cf850[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 2 23:59:35 2017 +0100

    refactor: rename and move localTimeInput directive
    
    to its own file

[33mcommit 0950cdc88be83869fde0c35bb533f04653fb16c6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 2 23:53:10 2017 +0100

    refactor: rename to pickupEditCreate

[33mcommit f4fc6894bd1b2b6265e869252c9b5b4e1712ec50[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 2 18:25:40 2017 +0100

    test: fix tests

[33mcommit e216af76609a06ac159729cabac417e4eae18b42[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 2 17:45:13 2017 +0100

    refactor: copy obj before parsing/serializing
    
    should not mutate

[33mcommit 49a7be42fd7f5b8cd076aad83a13f191ac16541f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 2 16:24:22 2017 +0100

    feat: make pickups and series editable

[33mcommit ccba228f7e28d9204b6b137e332ab806a7370c3f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Mar 2 11:29:35 2017 +0100

    refactor: move parsing and serialization to service

[33mcommit 216d84070844313057914261af9e4ca254ccb141[m
Merge: 8d77871d 499cad53
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Mar 1 14:31:37 2017 +0100

    Merge pull request #362 from yunity/nicksellen-slack-link
    
    Point to slack link instead of riot

[33mcommit 499cad533ad76548c40bc027e96b417f1ca44b54[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Mar 1 14:21:49 2017 +0100

    Point to slack link instead of riot

[33mcommit 8d77871d8b5682abcbd46532ce6f459340b7ee24[m
Merge: 6bbfa978 df993d23
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Mar 1 14:00:51 2017 +0100

    Merge pull request #352 from yunity/managePickups
    
    feat: page to see all pickup series and single pickups

[33mcommit 6bbfa97849bbf4a3766015ec437b61721f7546b2[m
Merge: 07ffe759 6f52c76f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Mar 1 14:00:14 2017 +0100

    Merge pull request #357 from yunity/groupHistoryR
    
    Group history rework

[33mcommit 07ffe759712c549b11aa839fafc431914804a354[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 28 21:10:11 2017 +0100

    Fixed layout on mobile

[33mcommit f5ae0d7d407a5041e4e1259b18a109efda6d60a9[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 28 20:42:42 2017 +0100

    Login is now in the middle
    changed Map to watercolored tiles, and headline font to cabin sketch

[33mcommit 9193dd130fa0afdbf72e4078edea44de7c580825[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 28 13:10:55 2017 +0100

    test: landing page and group map

[33mcommit 4a7848702430b1b3d5912655116f1c86baa8bd05[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 28 13:10:34 2017 +0100

    localize: landingpage

[33mcommit 67dc91de77d49c818ef1da2b3a98a30f93cbf30d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 28 11:54:53 2017 +0100

    feat: set maxZoom

[33mcommit 69ef1101ebebf4a66143c87859763b87f8dd640a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 28 11:45:11 2017 +0100

    refactor: map sizing
    
    apparently we need to invalidate the size. ui-leaflet offers an event,
    which seems simpler.

[33mcommit 946fb0bf0d82e8045c8316e3bc3dda2897709f48[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 28 00:15:57 2017 +0100

    Changed Statistiks -> Blog
    Map: Now has europe as center as default

[33mcommit 2dc424cb233dcd949300c89eb8aa0fb28fc0587d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Feb 27 23:52:58 2017 +0100

    Added markers & groupPopup to map

[33mcommit 8d00987ced76c1f4baf0f51d6568e0643ce67641[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Feb 27 23:05:02 2017 +0100

    Added landingPage

[33mcommit df993d236953b0a5562cdf2469cbe7794d5e739b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 28 13:32:05 2017 +0100

    fix: store breadcrumb
    
    use currentStores service to save the selected store via storeDetail
    resolve.
    
    the $$childHead workaround was broken for the pickupManage state, and
    this seems to be like a better workaround for the limited functionality
    of ncyBreadcrumb

[33mcommit 1b8781f1b34f50d1f0e914e4caac7ab8b59b51e2[m
Merge: 00e2cbfe fabbec78
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Feb 28 09:41:11 2017 +0100

    Merge pull request #350 from yunity/promisebtn
    
    Use angular-promise-buttons to block buttons while loading

[33mcommit 6f52c76f0234be70390dd8ec27d7354e3a9bdde2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 28 09:36:31 2017 +0100

    fix: underscore in translation replacement
    
    backend uses underscore and we pass the value directly

[33mcommit fabbec7850e6dde1b6bdae57df2609dd01d079c5[m
Merge: 2f41a8fc 00e2cbfe
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Feb 28 09:30:03 2017 +0100

    Merge branch 'master' into promisebtn

[33mcommit 6372fdb68674bf02b486b2c483bc9fbbc507bc70[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 20:34:50 2017 +0100

    fix: small things

[33mcommit 2da4911ec73a407f22f135e2a707e1ff88414912[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 20:34:26 2017 +0100

    refactor: list method and HistoryService

[33mcommit 44e4a437343eb0e7dfd14bb8783426868503f695[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 20:32:06 2017 +0100

    refactor: remove unused profile picture

[33mcommit dced7dae35ff670229bc98055806bb16d031feda[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 20:29:56 2017 +0100

    test: history, profile picture and random picture

[33mcommit 0c21fbd7f13fa3b3630d7ed64af5094d0af07efe[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 18:38:35 2017 +0100

    refactor: make history component stateless
    
    so we can use it for stores too

[33mcommit cc6157f42b8ae09d1faaf6e15103269786927dc1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 18:22:20 2017 +0100

    refactor: move random picture to directive
    
    DOM manipulations are better off there

[33mcommit d2cc33623e51f5a81ff0a0c4011ed124b2640b60[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 16:58:32 2017 +0100

    fix: handle case if user can't accessed
    
    e.g. after group leave or account delete

[33mcommit 8e36cd1cdcbe874e4112237f9d1b5add51fc3686[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 16:36:18 2017 +0100

    fix: server response is already sorted

[33mcommit 9c98005a30c7c508f94be54a361a5add8ac8f78a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 14:57:35 2017 +0100

    localize(history): add missing strings

[33mcommit 461101638887b9ade030a33298b1e6006f6bbc54[m
Merge: 00e2cbfe f21e234f
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 27 14:22:58 2017 +0100

    Merge branch 'groupHistory' into groupHistoryR

[33mcommit 00e2cbfe18a9f779a32bffd2fd0c0574e70e802a[m
Merge: 3b0e7479 37584830
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 27 12:18:11 2017 +0100

    Merge pull request #349 from yunity/noAuto
    
    Disable formatting features on signup and login

[33mcommit 3b0e7479e1fba242ae26bd3047cad6962a907b26[m
Merge: b117ea3d 4cb2b31f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 27 12:17:28 2017 +0100

    Merge pull request #351 from yunity/translationCheck
    
    Script for checking usage of translation key's

[33mcommit 3758483016003e72990f5aa453a1442b01a5d8f1[m
Merge: 0d95e285 b117ea3d
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Feb 27 09:28:24 2017 +0100

    Merge branch 'master' into noAuto

[33mcommit 5a7c4277cadc00df5b5a7c5b0f2e80e728be5693[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Feb 26 22:39:21 2017 +0100

    fix: add breadcrumb for manage page

[33mcommit 5ff4ac85dbb8804be07e48f02ca7b60158213631[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Feb 26 22:01:41 2017 +0100

    feat: page to see all pickup series and single pickups

[33mcommit b117ea3deb518c6b66063a0b5d2b357eed8b1c1c[m
Merge: bd9bb33e 548bd06a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Feb 26 22:07:28 2017 +0100

    Merge pull request #348 from yunity/currentstores
    
    Use services to manage current group and stores

[33mcommit 4cb2b31fc33da1bd672d3965333b299312a80712[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sun Feb 26 14:15:56 2017 +0100

    collect uses of $translate and translate-filter

[33mcommit 5a75b77789c17cc237673c686015ab42243bd844[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sun Feb 26 13:38:33 2017 +0100

    fixes grep regex

[33mcommit f1585687df074ea2ff998b1ad846c499c13dcfa4[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sun Feb 26 13:34:31 2017 +0100

    created script for translation key check

[33mcommit f21e234fb2a0ad06dff27b845be76fc450e25bbe[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sun Feb 26 12:54:52 2017 +0100

    profilePicture: use $document

[33mcommit 2205e45a1df4de2111ea4270abc8f657a929ad92[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sun Feb 26 12:28:01 2017 +0100

    history.service: use of api instead of fixtures

[33mcommit bd9bb33e417a15d982f4a7ae0a0d99cca6709aab[m
Merge: 56b2c7a9 11f0d924
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Feb 25 23:33:40 2017 +0100

    Merge pull request #347 from yunity/editcreateform
    
    Rework editcreate forms

[33mcommit 56b2c7a96793de3eb249fc128a36392020649bf2[m
Merge: 9236b72a 25531b81
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Feb 25 23:33:10 2017 +0100

    Merge pull request #346 from yunity/localizeHttp
    
    localize: set language header to frontend language

[33mcommit 548bd06adc4a0227de59d08ec01c2e3a380554f0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Feb 25 16:50:15 2017 +0100

    feat: keep store list in one place
    
    allows for updating the store list on edit

[33mcommit 4f351fd43362b987a268d783fdcfa9af5effc5f4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Feb 25 16:18:57 2017 +0100

    fix: use CurrentGroup to hold group data
    
    avoiding $state, allows us to keep the group data in sync, e.g. on edit
    Now the group name in the topbar is always the same as on the group
    page.

[33mcommit 0d95e285d6fab36cd0a9be1c673d77c91898265e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Feb 25 15:27:16 2017 +0100

    fix: disable formatting features on signup and login
    
    so far, only autocapitalize was disabled

[33mcommit 11f0d924f410b8dabc6b03953c24d3dbd0191094[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Feb 25 15:22:31 2017 +0100

    fix: set minlength to 3

[33mcommit 2f41a8fcdd72855aa21729d117b68558321dc60b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 24 23:34:42 2017 +0100

    feat: block buttons while loading
    
    Just return a promise to ng-click and add `promise-btn` directive.
    https://github.com/johannesjo/angular-promise-buttons

[33mcommit dca227abedb224964103ff89bbfcfaa8e6a369f5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 24 20:51:52 2017 +0100

    test: submit fn

[33mcommit fe1645d9f0d691249586825cef55af586ae4ba1b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 24 20:23:55 2017 +0100

    feat(store): reduce min-length to 3 characters

[33mcommit fc0bbc98ac99c007ba5efd1972ad4e6bc8078c46[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 24 18:38:27 2017 +0100

    feat: move storeCreate to its own page
    
    Sharing the form with storeEdit

[33mcommit bc256ca9867f1ff03bf3b3d3102aa5a33d7b0b93[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 24 16:33:48 2017 +0100

    feat: check for group name length

[33mcommit 25531b810bcaf869969a72395f375aa7db599b23[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 24 11:16:40 2017 +0100

    localize: set language header to frontend language
    
    Override the default Accept-Language header of the browser. Most people
    should already get their preferred language, but now they are able to
    switch, which is also easier for testing.
    
    Benefits:
    
    - translated responses from the backend can be used directly
    in the frontend
    - mails triggered by frontend requests will get sent out in the
    appropriate language
    - no need to set accept-language for Nominatim

[33mcommit 9236b72acec8aa270b02dbc242c0716002bebc53[m[33m ([m[1;33mtag: v1.0.1[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 22 18:45:58 2017 +0100

    Create archive.tar.gz when releasing a tag
    
    Will be downloadable from URL/archive.tar.gz

[33mcommit 83215f3f31e86fc9ff6ebc95b83ab237fd89ed99[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 22 18:33:19 2017 +0100

    Add "owner" to circlci config
    
    Ensures it only runs for yunity org builds (i.e. not external PRs)

[33mcommit b2741050171c3b2cc7ecaa656948fd26e775e034[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 22 18:32:27 2017 +0100

    Remove production branch deployment
    
    Now uses tags for deployment "production" version

[33mcommit 1384febecdda4dc0a0f502ffbfac25a7ef0af00d[m[33m ([m[1;33mtag: v0.0.1[m[33m)[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Feb 22 18:25:23 2017 +0100

    Add tag deployment

[33mcommit 5d24c595b11f8c2220d28660e299390557db47d3[m
Merge: b840c3df 1b69636f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 22 16:17:39 2017 +0100

    Merge pull request #343 from yunity/deployUpdate
    
    deploy 'production' branch

[33mcommit 1b69636fe339a71b040adfb0e29b8fba1a2128da[m
Merge: 02782eef b840c3df
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 22 16:06:49 2017 +0100

    Merge branch 'master' into deployUpdate

[33mcommit 02782eef26b98354c09407849e5503b721ab8257[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Feb 22 15:03:12 2017 +0100

    removes 'dev' branch from deployment

[33mcommit c43b79832e4ae03fb6515ec5ef411d190c295371[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Feb 22 14:59:11 2017 +0100

    groupHistory: uses now data from history.service

[33mcommit bf12607b7e0c30e6b192100841f758627095b9db[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Feb 22 14:57:52 2017 +0100

    added first history locales

[33mcommit 2a5382b1224f8e57034da68f30f0e3e0d36b3052[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Feb 22 14:57:08 2017 +0100

    history.service: fake response

[33mcommit f333e89b0b9db76c547b5bd57a1092f197f25dcb[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Feb 22 14:55:19 2017 +0100

    profilePicture: added link and tooltip & retrieves data now from api

[33mcommit 7493c710ac30ade286ec31960c03a096bbce8d65[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Feb 22 11:18:36 2017 +0100

    profilePicture: deterministic generation

[33mcommit b840c3dfc6f06181603f676d4459ca9881aad71e[m[33m ([m[1;33mtag: v2.0.0[m[33m, [m[1;33mtag: r2[m[33m)[m
Merge: 21a479ec 628bcc48
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 22 09:43:36 2017 +0100

    Merge pull request #340 from yunity/dev
    
    Deploy final changes for Release 2

[33mcommit add8c3ee78d14a40ea9c3a6f187d9939bd298781[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Feb 22 01:09:01 2017 +0100

    deploy production branch

[33mcommit ad56f77cfc1c381040aff97a5c306a496b953bd6[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Feb 22 00:34:30 2017 +0100

    groupHistory: list design

[33mcommit a20bc60c34cd5b040d26896d6f160b6c277a0dcd[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Feb 22 00:32:50 2017 +0100

    created profilePicture component

[33mcommit 628bcc48757aee12c698a78b460a6cceec7f950f[m
Merge: 56a3c020 1e90322b
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 22 00:24:08 2017 +0100

    Merge pull request #337 from yunity/fixGroupMenu
    
    fix: groupMenu should go to home if no activeGroup

[33mcommit 56a3c0202be23e56bc445c6415419f14484405fb[m
Merge: 142a7492 437f06bf
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 22 00:23:50 2017 +0100

    Merge pull request #339 from yunity/release2
    
    Release 2

[33mcommit 437f06bf016c908630ae81b83898b2550884efdc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 21 23:47:07 2017 +0100

    chore: set release date

[33mcommit c190223e974f8156a75992cab81710c788e7665e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 21 23:42:01 2017 +0100

    chore: update CHANGELOG for Release 2

[33mcommit 142a7492cb42d3e5a274b1f9c43c7d6e001c9f59[m
Merge: 073e5274 8cb93ba6
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 21 23:42:45 2017 +0100

    Merge pull request #338 from yunity/updateTranslation
    
    update translations

[33mcommit 1e90322b9c413d36a3187fa03f28e8ced1c095de[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 21 23:34:20 2017 +0100

    test: groupMenu

[33mcommit 8cb93ba69ff20e9aa98708991b8061943a33c7b4[m
Author: Janina Abels <hopefullyunique@gmx.de>
Date:   Tue Feb 21 23:09:19 2017 +0100

    update translations

[33mcommit 073e52741b65f479f52cabf1f78be8cd9982392b[m
Merge: 4666d3ee c2f1be67
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Feb 21 22:27:12 2017 +0100

    Merge pull request #335 from yunity/removeXeditable
    
    refactor: remove angular-xeditable

[33mcommit 87bc541cc424899cb35cdf8deada56215736bd19[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 21 19:04:34 2017 +0100

    fix: groupMenu should go to home if no activeGroup
    
    closes #322

[33mcommit c2f1be670fa18fce0bc2328e5c2b4424b629ee56[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 21 18:27:47 2017 +0100

    refactor: remove angular-xeditable
    
    Closes #205

[33mcommit 4666d3eeb70a895030d5551f797b8721b64a6c05[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 21 18:17:18 2017 +0100

    feat: more fitting words for pickup series

[33mcommit d82456856e60dd4dbfa3a203b4462a650de2a659[m
Merge: 00c1f110 edbfb32c
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 21 18:08:13 2017 +0100

    Merge remote-tracking branch 'origin/dev' into dev

[33mcommit 00c1f110611e71309f9ccf65cda7c57832ab7dd4[m
Merge: e1bdc5eb b1a14a61
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 21 18:02:45 2017 +0100

    Merge branch 'storeEdit#310' into dev

[33mcommit edbfb32c0872e0126dcacaff8dc07cc80069b193[m
Merge: e1bdc5eb 682ba123
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Feb 21 17:37:37 2017 +0100

    Merge pull request #330 from yunity/markdownTranslate#309
    
    Added translation for markdown fields

[33mcommit e1bdc5ebd402c2a6b1a9efea0ce2f6d7d512cbfc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 17 17:28:48 2017 +0100

    fix: use $mdMenu.open
    
    Removes the usage of deprecated mdOpenMenu

[33mcommit 02543a9c63c199b8a7fb3107bf7327133f0cfc64[m
Merge: 42e79a77 a8d7c5bd
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 21 17:26:43 2017 +0100

    Merge branch 'content-nesting' into dev

[33mcommit 9a4059f5d1c33e4274b37e463e3fa4b67a32476b[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Tue Feb 21 13:21:34 2017 +0100

    groupHistory: created components

[33mcommit b1a14a6116a4892ce40c3561e07d09b799b98ef2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 21 00:24:51 2017 +0100

    Removed unused code

[33mcommit 45c3c0c3102019477fb34aa3a2162d4506615192[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 21 00:17:09 2017 +0100

    cleaned up storeDetail, added weeks-in-advance

[33mcommit b4f6bd7f1caa585e8f5e67aa71a40709879a601c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 21 00:04:30 2017 +0100

    Added storeEdit and storeEditCreateForm

[33mcommit 682ba12326f27bba10b34d4b760e2c6212b88c7d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Feb 20 21:31:21 2017 +0100

    Added translation for markdown fields

[33mcommit 42e79a7703b2ff098e1853c6e0d672852636627e[m
Merge: b3dea524 cccbc9dd
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Feb 20 21:17:12 2017 +0100

    Merge pull request #312 from yunity/httperrorhandling
    
    feat: add $mdToast for HTTP5xx and timeout

[33mcommit b3dea524397191cfb8d715888998131a7512ca49[m
Merge: cb5791cf 21a479ec
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 20 14:32:16 2017 +0100

    Merge pull request #329 from yunity/master
    
    update dev branch

[33mcommit 21a479ec680c7fb28c7400acef7d2770c2517246[m
Merge: b805b8d5 7f142c21
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 20 14:30:55 2017 +0100

    Merge pull request #316 from yunity/ngAria
    
    feat: use ngAria to fill some accessibility attributes magically

[33mcommit b805b8d57b48dc34c2f65ff89c5c36252b4021bd[m
Merge: b590a09e 51e5c099
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 20 14:29:50 2017 +0100

    Merge pull request #321 from yunity/planning
    
    Update changelog and roadmap

[33mcommit b590a09e4eca8c79bdec3c1ab4f7f90dc63d8949[m
Merge: 9ced9a27 cb5791cf
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 20 12:08:37 2017 +0100

    Merge pull request #328 from yunity/dev
    
    chore: add deployment of dev branch

[33mcommit 9ced9a27013e6c71c84debb91a206c49767fdda5[m
Merge: 4cd04e1e 59ba7a7c
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 20 11:57:39 2017 +0100

    Merge pull request #327 from itsmalk/master
    
    disabled auto-capitalization of email and password on mobiles

[33mcommit 59ba7a7c7b8f5e759566981fed0b84a17e57cf2d[m
Author: Joshua Levine <joshuapark95@gmail.com>
Date:   Sun Feb 19 17:25:27 2017 -0600

    disabled auto-capitalization of email and password on mobiles

[33mcommit cb5791cf76cd9635f1f644e76b7b2e638cfe0325[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Feb 19 12:57:22 2017 +0100

    chore: add deployment of dev branch
    
    dev.foodsaving.world, will access production backend
    devdev.foodsaving.world, will access dev backend with dev backend

[33mcommit 51e5c099145de83a52295432b3b9e4920ea904b4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Feb 19 01:57:07 2017 +0100

    chore: update ROADMAP

[33mcommit 4cd04e1ee2896d3781a9f62f35dd177b0f5ff4ec[m
Merge: 6718535f 66271ba6
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Feb 19 01:39:39 2017 +0100

    Merge branch 'singleBar'

[33mcommit 6718535f20212bd07f081d07e912645de775d3ee[m
Merge: 22e01889 69fe72a1
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Feb 18 18:16:21 2017 +0100

    Merge pull request #315 from yunity/titles
    
    fix: titles for login and passwordreset page

[33mcommit 22e0188902d1a815c64ecd1be013b549d4253baa[m
Merge: 730ebf44 1f647aa4
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Feb 18 18:14:04 2017 +0100

    Merge pull request #314 from yunity/restructure
    
    refactor: move modules to their usage

[33mcommit 1f647aa42535cfd670c606fbbcf810e787c8abd2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Feb 18 16:07:41 2017 +0100

    refactor: finalize renaming to services

[33mcommit cd0217ec3ae14a0aedd806cf6d86294f0952b22e[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 18 15:49:56 2017 +0100

    fix broken import in app.js

[33mcommit 7e0dacbaa6eaae7ebf22f007e5894904af929239[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 18 15:35:44 2017 +0100

    group: added missing depedency

[33mcommit ab0feff32c657f6637cf57f9562dd679adb0b9fd[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 18 01:08:07 2017 +0100

    fixes broken imports caused by moving modules

[33mcommit 935b62b51ab15ccce43a4d13e11e1601cbfb2ebe[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Feb 17 18:47:18 2017 +0100

    refactor: moved createStore & storeList

[33mcommit e1d27637e312e8e23ffe057bdfd8b1baab60be99[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 17 18:32:15 2017 +0100

    chore: update changelog

[33mcommit 66271ba677c383e895785695208d914b958eaeb2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 17 17:45:56 2017 +0100

    fix: don't use loading bar for Geocoding service
    
    prevents double loading bar in md-autocomplete

[33mcommit 7f142c2177ce1a7d4c50cf5c856cc94e5995c845[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 17 16:48:08 2017 +0100

    feat: use ngAria to fill some aria attributes magically
    
    https://docs.angularjs.org/api/ngAria
    useful for ngHide etc

[33mcommit 69fe72a135b4aadd2b5adc8492eda7d216cf5f15[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 17 16:41:29 2017 +0100

    fix: titles for login and passwordreset page

[33mcommit fac6836748347b8458cf2b69e29c391d808bdbf9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 17 16:32:34 2017 +0100

    refactor: move modules to their usage (WIP)
    
    This is just a demo, didn't fix any imports.

[33mcommit a8d7c5bdece16862bcd7f165c7f2c029f324746c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 17 15:42:55 2017 +0100

    refactor: don't nest md-content elements
    
    It would only be suitable for locations where we want to have multiple
    scrollbars (e.g. in dialogs, where the outer scrollbar is disabled)
    
    Reference: https://material.angularjs.org/latest/api/directive/mdContent

[33mcommit cccbc9ddc951dd24d8433873304df1a64d88929a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 17 14:14:30 2017 +0100

    feat: add $mdToast for HTTP5xx and timeout
    
    the parent container should not be scrollable, so I added a md-content
    below `<body>`

[33mcommit 730ebf44a4d324e9cfa32a81dd40f742c7cfddac[m
Merge: 7dff3f3e f322995e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Feb 17 13:14:51 2017 +0100

    Merge pull request #308 from yunity/markdown#210
    
    Markdown help & preview #210

[33mcommit 7dff3f3efe264918226c8ab59bade936791cc109[m
Merge: e5bead7b 43caccba
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Feb 17 13:08:38 2017 +0100

    Merge pull request #304 from yunity/signup
    
    feat: signup title and automated login after signup

[33mcommit f322995e8dac337ba45a5882cf500e90ee638324[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Feb 17 12:25:43 2017 +0100

    groupEdit: sorted inputs by type

[33mcommit 79207faaf1593d6d9ad67dc1fe0fc0b91be51af9[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Feb 17 12:23:22 2017 +0100

    groupEdit: normal textarea for public description field

[33mcommit e18374772a8f7f677a56868f9126a33ffbbfcd8c[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Feb 17 12:20:49 2017 +0100

    markdownInput: open help in new window

[33mcommit 43caccbac4e3a3ca3fc5ca4d4684af7fb66b1927[m
Merge: 4ef055d5 e5bead7b
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Feb 17 09:57:28 2017 +0100

    Merge branch 'master' into signup

[33mcommit c6761d43319707cefbdc93cbc93342495fb733e9[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 16 21:38:08 2017 +0100

    Added translation

[33mcommit 38f6d4ffe47051300b8ea560b351317f41489507[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 16 21:33:52 2017 +0100

    Added toggle test

[33mcommit b30de406f7de8de9a57850b7bab7ef2711148394[m
Merge: 322ee35a e5bead7b
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 16 21:18:18 2017 +0100

    Merge origin/master into markdown#210
    
    Conflicts:
            client/app/components/group/groupEdit/groupEdit.html
            client/app/components/group/groupEdit/groupEdit.js

[33mcommit e5bead7bbfe30420a4994d905302e095704ed549[m
Merge: c20222af b5271c4f
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 16 19:45:20 2017 +0100

    Merge pull request #307 from yunity/greenkeeper/file-loader-0.10.0
    
    chore(package): update file-loader to version 0.10.0

[33mcommit b5271c4fe463a5c54e872f809259fe19691b51ff[m
Merge: 36c87195 c20222af
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 16 19:28:03 2017 +0100

    Merge branch 'master' into greenkeeper/file-loader-0.10.0

[33mcommit c20222afb6c0452156f184084bcea6530599b000[m
Merge: 835edf68 68de15c9
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 16 19:21:22 2017 +0100

    Merge pull request #306 from yunity/faviconFix
    
    Show favicon

[33mcommit 68de15c9fef87c8faa3169dd73dafaf7f17cab0b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 16 19:05:02 2017 +0100

    fix: copy icon folder
    
    Closes #288

[33mcommit 835edf68482784fe933b88b4686df922b62eba05[m
Merge: 64b2e959 b58c9c40
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 16 18:43:05 2017 +0100

    Merge branch 'crhistianr-master'

[33mcommit 64b2e95961464e14fe2047230a4f2ead44ccfd4d[m
Merge: dc094849 d4053e9e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 16 17:18:29 2017 +0100

    Merge pull request #275 from yunity/recurring
    
    Frontend changes for recurring pickup dates

[33mcommit d4053e9e33f78a3b558a1c57f3e72bb0b5fe7906[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 16 16:59:19 2017 +0100

    refactor: load weekday translations from $locale

[33mcommit e17f88dd101467ef51acc8dda6234225ef41bf0c[m
Merge: f674fbdf dc094849
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 16 16:37:09 2017 +0100

    Merge branch 'master' into recurring

[33mcommit dc094849e74864cd379f23c690a625fee3f9b81a[m
Merge: b4263038 1fb6791a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 16 15:12:32 2017 +0100

    Merge pull request #294 from yunity/createGroup#291
    
    Fix: createGroup needs timezone

[33mcommit 1fb6791a456ad049d63cb129414f8625e9e732bf[m
Merge: 3d1e240c b4263038
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 16 15:05:32 2017 +0100

    Merge branch 'master' into createGroup#291

[33mcommit b42630388ea1ac0cb882cc75b04091a7b9270b07[m
Merge: dbb32087 c382213f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 16 14:38:43 2017 +0100

    Merge pull request #301 from yunity/mdDialogFix
    
    Fix: Height of joinGroup Dialog open by home.component

[33mcommit 4ef055d563df1a2f965480e3e4c07d2c0d1c4b74[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 16 14:34:17 2017 +0100

    feat: signup title and automated login after signup
    
    Logs user in with email and password for better UX.

[33mcommit dbb320878464b78b3e26664304ea7d12157a3ff9[m
Merge: 85e628cd 68c67489
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 16 14:06:26 2017 +0100

    Merge pull request #281 from yunity/addressLookup
    
    address autocomplete & map

[33mcommit 68c674893cc46f7a9136ce87470ce028ea15c5b2[m
Merge: 13c4e852 85e628cd
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 16 14:05:17 2017 +0100

    Merge branch 'master' into addressLookup

[33mcommit 13c4e8526266e0ebb1bf76da3ecb9466e24cf886[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 16 10:39:50 2017 +0100

    fix: correct parameter for deleteIfEmpty()

[33mcommit 546e9112152f3d9d976ef24ed6949c234a759232[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 16 10:23:32 2017 +0100

    groupEdit: removed padding of md-autocomplete

[33mcommit 04bfccfe7048d48f05df9cdced5a3f587e1a6b5f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 16 00:19:29 2017 +0100

    refactor: simplify route directions
    
    since group redirects to group.groupDetail.pickups, we can just use the
    group state for routing. It's much shorter.

[33mcommit 0c90d28dc5f840166deb8f922310871923df43f8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 7 14:36:26 2017 +0100

    feat: set and change timezone of group

[33mcommit d207cb577a6cc398eaba6a0a4ddfa2259e8d7fab[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Feb 15 23:44:26 2017 +0100

    fix: address selection

[33mcommit 322ee35abc6f9e81e5196cef5210470ee75073dc[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Feb 15 23:27:36 2017 +0100

    added markdownInput with help & preview

[33mcommit c382213f05b60e2114d763da54c9997e9ff3a0f4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Feb 15 21:35:52 2017 +0100

    Fix: Height of joinGroup Dialog open by home.component

[33mcommit 85e628cd018390f5592a17f80d1fbf12e7faef0f[m
Merge: edc07ebd 65961a4e
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Feb 15 21:29:16 2017 +0100

    Merge pull request #300 from yunity/localization
    
    fix: localization of dates

[33mcommit 65961a4e261e135e7c585cfe066cdc9745b8692e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Feb 15 20:21:34 2017 +0100

    fix: localization of dates

[33mcommit edc07ebdf8c83a9d81cddb0b335a30ccdc5be776[m
Merge: 4f327b30 249e6be4
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 15 13:56:02 2017 +0100

    Merge pull request #298 from yunity/russian
    
    localize: add russian

[33mcommit 249e6be49ec2f1ac2c4e14c12ed5aec65327d421[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Feb 15 10:36:52 2017 +0100

    localize: add russian

[33mcommit 4f327b30110af1ae4e2849bc51f6fa4dd34334e3[m
Merge: b30b71fd 64b5ca79
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 15 10:21:58 2017 +0100

    Merge pull request #297 from yunity/optimizeRequests
    
    PickupList: do a single request per store

[33mcommit 64b5ca79def8a8a8919f6a38d9bdaea5f83ef748[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Feb 15 10:16:02 2017 +0100

    refactor: simplify more

[33mcommit b30b71fd1eef88274b0c6ac613a23005772709cf[m
Merge: 3180c9ce 0dba9e60
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 15 01:35:48 2017 +0100

    Merge pull request #296 from yunity/storeListMobileImprovement
    
    storeList: toggle-button for map on mobile version

[33mcommit 3180c9ced97b4791ebf05abef98f15d3102cd301[m
Merge: 5845bf33 d263eb30
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Feb 15 01:25:11 2017 +0100

    Merge pull request #295 from yunity/pickuplistSpinner
    
    PickupList: Spinner while loading data

[33mcommit 3a89978c8329aa2466e6105f74430263354c1014[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 20:40:47 2017 +0100

    refactor: do a single request per store

[33mcommit 0dba9e60f024ec3fcc892e9dce269dd9566fd091[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 14 21:15:25 2017 +0100

    Built storeList map-toggler

[33mcommit d263eb3078de45df690d102b2d3fea65348f9930[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 14 20:53:40 2017 +0100

    Style: now in the middle

[33mcommit 097f5230aa4046f18108b819501499ee5850c412[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 14 20:51:28 2017 +0100

    Added loading spinner to Pickuplist

[33mcommit 5845bf337e41ff37daf4e83e2b36983bcce5d29f[m
Merge: cc3d4cf5 b9695eab
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 14 20:35:21 2017 +0100

    Merge pull request #292 from yunity/mddialogFix
    
    Fix: md-dialog height

[33mcommit b9695eab6c6bb401402b9b03ba52175081ea4139[m
Merge: f0baebeb cc3d4cf5
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 14 20:30:37 2017 +0100

    Merge branch 'master' into mddialogFix

[33mcommit cc3d4cf59b4670f1ea3a8b8403f324ce7199c012[m
Merge: f59746f0 7ddaa007
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 14 20:30:21 2017 +0100

    Merge pull request #293 from yunity/languageItalian
    
    added italian language

[33mcommit 3d1e240ce107541ddfcfc0030acfbcb91de22345[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 14 20:23:43 2017 +0100

    Added password and public description field

[33mcommit 7ddaa0072afad93ec21f938eb2dcb1709fb34bf6[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Tue Feb 14 20:20:25 2017 +0100

    fixed lint error

[33mcommit be069e8ec789d0eb342e1588827f2c40de3105d7[m
Merge: 3e84f55d f59746f0
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Tue Feb 14 20:11:41 2017 +0100

    Merge branch 'master' into languageItalian

[33mcommit 9a3d6f0f6ee114af4df136837b38811eef83f65f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 14 20:10:11 2017 +0100

    new design for createGroup

[33mcommit 3e84f55d0ce5d359e2bd88269c9d0b51be4dead7[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Tue Feb 14 20:08:57 2017 +0100

    added italian language

[33mcommit f0baebeb709ac4c41224e081b49abf32031fe52f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 14 19:56:09 2017 +0100

    Fix: md-dialog height

[33mcommit f59746f0e214915287fafa1319cde04ff728e086[m
Merge: bd57536c f2cf59c7
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Feb 14 18:55:02 2017 +0100

    Merge pull request #289 from yunity/groupEditing
    
    Fix group editing

[33mcommit 80144c1c017ad22073a9b8210de18d524e2c6295[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 15:24:34 2017 +0100

    test: fix all tests with a Geocoding stub

[33mcommit acd9b0f9a6bfc155c8aa2aa12a0c80270d9e51c0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 14:27:20 2017 +0100

    test: edit form using Geocoding mock

[33mcommit 41ac177b7dfd87a31bba7d3f289b0d154054ec71[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 14:15:45 2017 +0100

    test: load angular-translate for testing

[33mcommit 7e644e131a1d7eaed27b051eb82e938fc2652553[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 14:09:37 2017 +0100

    refactor: move form fields to common component

[33mcommit f1499f91147bb0239470457f88d55bfe22252c99[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 13:24:57 2017 +0100

    feat: address editing for groupEdit

[33mcommit f2cf59c7705d3dd6fa6b8982ce7f10fdc87c15f2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 13:02:21 2017 +0100

    fix: overlapping translation key

[33mcommit 04c6590b0d76af8d4c0c2dbfa9bf05c980192681[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 13:02:21 2017 +0100

    fix: overlapping translation key

[33mcommit 86a8162b2e21722d42480876494f80762f91b377[m
Merge: dd16fa34 2ae65ba9
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 12:56:27 2017 +0100

    Merge branch 'groupEditing' into addressLookup

[33mcommit 2ae65ba9a5b2561f821a02b75ace16b408e6fe66[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 03:05:17 2017 +0100

    refactor: use state for group editing
    
    Can be navigated with back/fwd buttons and has URL
    
    Closes #287.

[33mcommit b87671665fb5e1ebfab2b594c0c95b0c02667ee9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 14 01:57:34 2017 +0100

    fix: group editing

[33mcommit bd57536c7a77a3439e15cfa1590820581a9a15ca[m
Merge: 954796ee b8672efc
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 13 19:22:19 2017 +0100

    Merge pull request #286 from yunity/titleBarButton
    
    Hotfix: groupButton text-overflow: ellipsis

[33mcommit b8672efcb5ce94e21331dcbe4f1dafa59f8a44cc[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Feb 13 18:57:03 2017 +0100

    Hotfix: text of group is now ellipsing again

[33mcommit dd16fa34b4738ada33e5143000c2cf16e1fea81a[m
Merge: cda31d21 880e1a8a
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 13 17:19:17 2017 +0100

    Merge remote-tracking branch 'origin/addressLookup' into addressLookup

[33mcommit cda31d2108ad9f12569192fd29cc8692d42df354[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 11 18:07:23 2017 +0100

    createGroup: added delay for requests

[33mcommit d9e9bea91847d9163683524933c6543b70af762e[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 12:11:24 2017 +0100

    createGroup: address autocomplete with map

[33mcommit 659050c22c8c99e5d3de76e6ed341790e0b6bab0[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 12:06:18 2017 +0100

    geocoding: request with language

[33mcommit 235224cae596c83902e2003f1803a84961eeadf8[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 09:45:34 2017 +0100

    geocoding: cleanup

[33mcommit 0157b9225bdfce0f07da542eaf82afa23b755d13[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 09:44:31 2017 +0100

     geocoding: multiple address response

[33mcommit 954796ee4064842f2f3c07defabd085a5bf281b2[m
Merge: 3507dee7 ef007e24
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 13 16:25:19 2017 +0100

    Merge pull request #237 from yunity/storeDetailMultiview
    
    Store detail multiview

[33mcommit ef007e249c41cd3ab8ecb832f668ed71cb2f99ec[m
Merge: 8e0a2553 3507dee7
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 13 16:15:51 2017 +0100

    Merge branch 'master' into storeDetailMultiview

[33mcommit 3507dee76e44096e906e52cfb35ce48a70037bcd[m
Merge: e499345e 31ee911b
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Feb 13 15:20:00 2017 +0100

    Merge pull request #282 from yunity/designChanges
    
    Design changes

[33mcommit 8e0a2553d263aba10f6f49be5113a14d08b67e6a[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Mon Feb 13 14:08:11 2017 +0100

    storeDetailMap: zoomed to store

[33mcommit 31ee911bfb074bbbdaa5e678148e0754b3185160[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 13 14:03:51 2017 +0100

    refactor: remove unneeded $scope reference

[33mcommit d0c7b5831ebffe2f63dfb41c70862162522954e6[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Mon Feb 13 14:01:25 2017 +0100

    storeDetail: removed margin around map

[33mcommit 010267ec7441423aea9fa23bf9da8658c3761111[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Mon Feb 13 13:59:50 2017 +0100

    group: same toolbar height

[33mcommit fb7db2ac28e92c2a1f52f31b7b3f99e4e12fd0da[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Mon Feb 13 04:16:22 2017 +0100

    fixed lint errors

[33mcommit f4b291860683f4e8df7c4d9883761a686c3c17db[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Mon Feb 13 04:13:15 2017 +0100

    joinGroup: added linebreaks for preview description

[33mcommit 02b94b978cc2e65aa1b8dcf25176ad12c085e957[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Mon Feb 13 04:04:34 2017 +0100

    joinGroup: show error on wrong password

[33mcommit 552d7ba0b4151965aa9d1599fd9de6b23c550c1e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Feb 12 14:13:34 2017 +0100

    fix: remove commented code

[33mcommit ac746af893ef5c403daaa83b357b16e4f1f97070[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 11 23:51:11 2017 +0100

    joinGroup: fixed lint errors

[33mcommit 4d0960c02f40974066b67cd4cd3f4e62e2822326[m
Merge: 6bc31b14 ae9aa8b0
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 11 23:43:48 2017 +0100

    Merge branch 'designChanges' of github.com:yunity/foodsaving-frontend into designChanges

[33mcommit 6bc31b1461ab63b7eb429dd7577dc259c2143471[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 11 23:42:47 2017 +0100

    joinGroup: added tests

[33mcommit ae9aa8b05bbbcdaef695feb14801f1ac0613d6b6[m
Merge: 7b8bf914 e499345e
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 23:18:46 2017 +0100

    Merge origin/master into designChanges

[33mcommit 7b8bf914fbc691b8de0152c526ce2b2a0d0b704b[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 11 22:43:24 2017 +0100

    joinGroup: fixed test

[33mcommit 6e2f285f9762ca775b0d9628f141ab86c57b03c0[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 11 22:33:59 2017 +0100

    joinGroup: fixing lint errors

[33mcommit e2ed9b2daa6ddb3697005c320a1d1f6bde140195[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 11 22:25:39 2017 +0100

    joinGroup: fixed double scrollbars

[33mcommit 2be3214760038d17605cc69c404778d6cdb1e3c2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 19:29:49 2017 +0100

    joinGroup: fixed scrolling content on mobile. hopefully.

[33mcommit 2928e44be79effd6c665849128972dcdf2ad06e4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 18:46:18 2017 +0100

    design: improved userPage layout

[33mcommit f331df3179faaa3eed3cb8c4868b4bc8acf3a45c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 18:33:39 2017 +0100

    breadcrumbs: removed them for now (commented out, so that we can add them again if they make more sense eventually)

[33mcommit ac0d25da8a014716eefc13b0381e89113468378a[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 11 18:31:32 2017 +0100

    joinGroup: removed duplicate header

[33mcommit c30bc7df0a8de79e67a4ebafdd837b9712103f24[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 18:27:25 2017 +0100

    design: userPage is now in-style with the other design changes

[33mcommit 880e1a8abb0fcafd6176e2448aeb2ef633c9ba49[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sat Feb 11 18:07:23 2017 +0100

    createGroup: added delay for requests

[33mcommit 08f5b105ddeaa1e473e57634ded2d6d6f1b80145[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 17:59:08 2017 +0100

    joinGroup dialog: Toolbar and footer always fixed

[33mcommit 94ca7b495d1766cb157f252b0130160b5309fed7[m
Merge: 8f0495de e499345e
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 17:42:55 2017 +0100

    Merge origin/master into storeDetailMultiview
    
    Conflicts:
            client/app/components/passwordreset/passwordreset.styl

[33mcommit 8f0495de372416c984b5e652879dffeecf7c76c7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 17:38:04 2017 +0100

    groupDetail: removed topbar of pickuplist

[33mcommit 3c4c645b36dd8afdd6910247d37ecbe9c9e01098[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 17:30:53 2017 +0100

    design: made breadcrumbs smaller, removed margin of group's main view

[33mcommit 347b1a2e6e761392b49f34bd64f653ea7bfd77d9[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 11 17:16:41 2017 +0100

    design: made store list smaller

[33mcommit e499345ec97dcfb191ca13f4adfd2f0af5d23089[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Thu Feb 9 05:41:02 2017 +0000

    chore(package): update babel-plugin-istanbul to version 4.0.0
    
    https://greenkeeper.io/

[33mcommit e0668808244616f263ed791f112eb4f3e2dcaba6[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 18:46:49 2017 +0100

    smaller footer

[33mcommit 21af4a3b6776696750f0c18e91ba1ae9573403d0[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 18:14:49 2017 +0100

    languageChooser dropdown below button

[33mcommit 3c8fed31278b4530c03cbfb56c21122504935845[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 18:10:58 2017 +0100

    cleanup joinGroup

[33mcommit cd5f8ff28d84af766ddbb7e26459d6db0b695e15[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 18:08:35 2017 +0100

    cleaner joinGroup panel

[33mcommit d9a42820af8c9e4cdc873dfd6df3f397dfee013d[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 16:40:37 2017 +0100

    spinner for initial loading

[33mcommit 19cc1e4b36801d87a5ea1509b47d30ad633ebd9b[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 15:49:35 2017 +0100

    groupMenu: only one home button & aligned button

[33mcommit 77069368f5949e8eab78c9ded42c81cff7a33043[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 12:49:49 2017 +0100

    changed loading bar style

[33mcommit fb7afc4a95ca67caf020fcce9d962ae6dc017de8[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 12:42:21 2017 +0100

    splash topbar buttons aligned

[33mcommit e3004e6a877525de26c99db4ef332552317fe8bf[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 12:15:17 2017 +0100

    lint fixes

[33mcommit 0d79e78eb272d12fe8ebbde0ca7d92b478221f0e[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 12:11:24 2017 +0100

    createGroup: address autocomplete with map

[33mcommit b1668aa668fd1be85a5a3ecc056cd34439d5b2b9[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 12:06:18 2017 +0100

    geocoding: request with language

[33mcommit 44aa4b78ce6ddfffe82c42a5f1aa2e92eabd2909[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 09:45:34 2017 +0100

    geocoding: cleanup

[33mcommit 4e717e3111e6b4022d8d63934b8e972f7123e704[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 9 09:44:31 2017 +0100

     geocoding: multiple address response

[33mcommit f674fbdf5fd6c57b55aef8d3efe789427da6a4fc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Feb 8 12:23:02 2017 +0100

    feat: edit field for weeks_in_advance

[33mcommit 4e6f08474118edc5a04c49d6728fa2d2045f92b7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 7 16:18:30 2017 +0100

    test: new behavior

[33mcommit 30837239f9c05d9a87cfe0411a1f8066c7d80290[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 7 15:02:52 2017 +0100

    Added favicon (#276)

[33mcommit e91f62682cc9d29339b7d5d825c23097bb67a062[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 6 21:20:25 2017 +0100

    feat: add collaboration call to login page

[33mcommit 02276ee63b1cdff2c5f7139e7321ec53fa8490d4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Feb 7 14:36:26 2017 +0100

    feat: set and change timezone of group

[33mcommit 0b5627837dc393b6ab27ec66b706cbc72f06ebd2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 7 13:45:53 2017 +0100

    Added aria labels

[33mcommit 4b8b732134e68b745dd2bdef20494fec48b2fcd4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 7 13:34:10 2017 +0100

    Removed names of ui-view elements in group and groupDetail

[33mcommit 68e3c8c13b5695529e89c18fc392bc8914844578[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 7 13:22:29 2017 +0100

    renamed Group -> GroupService

[33mcommit fea8af6e47435388790e2eed5c097a11a61fab23[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 7 13:04:04 2017 +0100

    Fixed groupDetail.pickups's assign statement

[33mcommit 65a1859693ecad2b4c75d37462039d4d870495f1[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 7 12:55:00 2017 +0100

    Fixed currentNavItem and added a test for it

[33mcommit 9b77e4cad24922b23c399f315a1445ace18f7874[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Feb 7 12:37:45 2017 +0100

    Fixed group redirect test

[33mcommit 685864511d1c7c8aa8e0962bbff74ccd09ba51a9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 6 23:35:20 2017 +0100

    feat: option to delete pickup date series

[33mcommit b58c9c406b61e5ec4adfb50e9d6357fe1054556d[m
Author: Crhistian Ramirez <cramirez@four51.com>
Date:   Sun Feb 5 20:38:49 2017 -0600

    update translation strings to be used with leave group confirm modal.

[33mcommit 383ff7b5292e4847276b63a2a518d0aefbd12eaf[m
Author: Crhistian Ramirez <cramirez@four51.com>
Date:   Sun Feb 5 20:37:48 2017 -0600

    add confirm dialog before leaving a group

[33mcommit 9f2bd3a2169e6f1d37404d7808587c6caa49fff4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 6 00:42:53 2017 +0100

    fix: URL typo

[33mcommit 51d83b4e4a1c3b033b882d7f2dfefd0099b8ce74[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Feb 6 00:12:43 2017 +0100

    feat: add option to create recurring pickups

[33mcommit fd83a4e609fc05067959733250f1acbf45be8257[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Feb 4 13:47:06 2017 +0100

    style: move all constructor assignments to assign

[33mcommit b6ad3e64ac11e9b85822deca41835de5a7a4c7ad[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Feb 4 13:38:55 2017 +0100

    refactor: move state redirects to state definition

[33mcommit effd94f0669c9daa95a356c56800d3140223e002[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 4 12:25:28 2017 +0100

    Fixed lint errors

[33mcommit efa1693151ec6cf51bf7b80be238b22a56fa0560[m
Merge: 0bd4fba7 bbbd66a1
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 4 12:23:48 2017 +0100

    Merge origin/master into storeDetailMultiview

[33mcommit 0bd4fba76cadbbb02986ad877b1f767cf77c6bb8[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Feb 4 12:21:44 2017 +0100

    Added group redirection test

[33mcommit bbbd66a1298d2e5d446a4e0a08bc44202b08c7b6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 3 19:46:19 2017 +0100

    fix: title text for smaller screens

[33mcommit 03efc04b6999d9c89b0eaa3bb99e040adaf1974b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Feb 3 19:32:05 2017 +0100

    fix: layout of splash pages

[33mcommit 33ff70bce8c19bae9392b4d80a9ae739fd624ccd[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Feb 3 11:05:50 2017 +0100

    login: Fixed background image size #270

[33mcommit 4979efa00055fb7d9e48e7e28f4ab57a3e511025[m
Merge: 96153a41 48700343
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 2 23:56:32 2017 +0100

    Merge origin/master into storeDetailMultiview
    
    Conflicts:
            client/app/app.js
            client/app/app.styl
            client/app/app.translate.js
            client/app/components/_languageChooser/languageChooser.controller.js
            client/app/components/_pickupList/pickupList.html
            client/app/components/_pickupList/pickupListItem/pickupListItem.html
            client/app/components/passwordreset/passwordreset.html
            client/app/components/passwordreset/passwordreset.styl
            client/app/locales/locale-en.json

[33mcommit 96153a414f0aee50d5c0358922da3a506a59c795[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 2 23:39:21 2017 +0100

    Fixed group breadcrumb redirection

[33mcommit 7480bf4c7d56266b5f64d943d41f5f487b37c09a[m
Merge: a7fd3cda cb62b6e3
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 2 23:32:04 2017 +0100

    Merge origin/storeDetailMultiview into storeDetailMultiview

[33mcommit a7fd3cdac40ac8bc5e77ba8da21f231656efa2af[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 2 23:14:12 2017 +0100

    Fixed test & lint errors

[33mcommit 05f4c23d3f95f9642e3dc2fb8dc94ff4d13f7242[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 2 23:05:03 2017 +0100

    storeList: current store is now highlighted

[33mcommit cb62b6e326b8971432d5ecd1c854f4016af30613[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 2 22:33:17 2017 +0100

    Breadcrumbs & Pagetitle (#246)
    
    * Use more ES6-like style
    
    * Set max-height depending on the input
    
    * Added ncy-angular-breadcrumbs
    
    * Added correct names for breadcrumbs
    
    * Added Page Title
    
    * Fixed lint errors
    
    * Moved setPageTitle to rootScope
    
    * Add confirm dialog before deleting pickup
    
    Changed the icon to a trash bin.
    Use pre-rendered DOM for dialog, it seems easier if we don't need
    dynamic content in the dialog.
    
    * Move md-dialog on top of leaflet
    
    they have astronomic integers there...
    Closes #226
    
    * Extend test
    
    * Added simicolon to in app.js
    
    * Use dot as seperator and name Foodsaving
    
    dot has less ink than |
    I think foodsaving is the proper name of the tool.
    
    * Move title config to separate file
    
    Easier to keep the overview in app.js
    
    * Use ngInject instead of explicit annotation
    
    * Use provided directive to generate title
    
    It seems much easier. It's not so customizable, though. So it's reverse
    now.. maybe we fix this later.
    
    * Revert "Move md-dialog on top of leaflet"
    
    This reverts commit 97e845e186797f4c8bca6e83328ab30d04faa076.
    
    * Move leaflet controls below md-dialog
    
    * Extend group.join with a data parameter
    
    * Add lock icon
    
    * WIP: group join with password
    
    * Ask for group password and show public_description
    
    * Add group settings for public_description and password
    
    * Move toggle to HTML
    
    * Disable button if form is invalid
    
    Also requires that the server check status is reset after keypress
    
    * Fix generator
    
    Authentication is needed for the redirect hook
    
    * Mail verification page
    
    Tests still fail, I don't know why it doesn't find the route.
    
    * Add password reset
    
    TODO: three route tests are skipped, can't get it running
    
    * Password change field on user page
    
    * Fix tests
    
    HAH! Go away, httpBackend! It's not that I don't like you, but it's it
    simply didn't work and I still have no idea why. Plain promises to the
    rescue!
    
    * Empty controller for verifyMail
    
    * Add automatic loading bar
    
    Should enhance UX by showing the user that something is happening in the
    background
    
    Closes #200
    
    * Fix spelling
    
    * chore(package): update karma-webpack to version 2.0.0 (#261)
    
    https://greenkeeper.io/
    
    * Update German locale from transifex (#262)
    
    Thanks @djahnie for the Translation!
    
    * localize: swedish from transifex
    
    * localize: add swedish configuration
    
    * chore: change deployment to foodsaving.world
    
    * fix(package): update angular-material to version 1.1.3 (#269)
    
    Closes #267
    
    https://greenkeeper.io/
    
    * Breadcrumbs are now pretty (:

[33mcommit 487003431707d4885876881c1223c5cf241c6bf1[m
Merge: b14c9998 2bf122ab
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Feb 2 21:54:38 2017 +0100

    Merge pull request #83 from yunity/designImprovements
    
    Design Improvements

[33mcommit 2bf122aba36e71a459f3b946487ff1e86b6f23c0[m
Merge: 50ea2956 b14c9998
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 2 21:47:38 2017 +0100

    Merge branch 'master' into designImprovements

[33mcommit b14c99986d27d579af7fc88dd87b232e13237115[m
Merge: 4201a446 19b532b5
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 2 21:40:07 2017 +0100

    Merge pull request #268 from yunity/updateTranslations
    
    Update translations

[33mcommit c9bd328f9538e57b31a35b513b3322bac1bc06e9[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 2 21:36:48 2017 +0100

    group: fixed h1 linebreak and headersize

[33mcommit 19b532b5523ed2c41725a09cc6bb26f04b52bcf6[m
Merge: 835b938f 4201a446
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 2 21:32:14 2017 +0100

    Merge branch 'master' into updateTranslations

[33mcommit 0d80aa745ca8f7690e02e4b3359a50e55f4d9938[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 2 21:22:28 2017 +0100

    removed unused regulations on "currentNavItem" = description

[33mcommit d67ddd296cd8c940dc379659aed1885760dafd0c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 2 21:14:16 2017 +0100

    automatic redirection to pickups when group/stores or group/members is requested

[33mcommit 6d40f2ff49ed644a4f26170ae80c770b382ba1f9[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Feb 2 21:02:52 2017 +0100

    group page is now wider on mobile

[33mcommit 4201a446ae5f94ddd001bd1690d349603f0fd52d[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Feb 2 17:32:41 2017 +0100

    fix(package): update angular-material to version 1.1.3 (#269)
    
    Closes #267
    
    https://greenkeeper.io/

[33mcommit 835b938f31ec9ed6c7fb7bf7f71e803e27fa5ae4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 2 13:18:04 2017 +0100

    feat: link to translation helper page

[33mcommit 8c3b473ec358749107585372db2dd69f21945575[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Feb 2 13:06:39 2017 +0100

    chore: add Esperanto and Espanol
    
    Also show full language names in the chooser

[33mcommit 36c87195f5795db1ed80d89530dbe86805c522af[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Sat Jan 28 09:24:24 2017 +0000

    chore(package): update file-loader to version 0.10.0
    
    https://greenkeeper.io/

[33mcommit 50ea29565fc1d26aa27397011d56a1b18f3ea110[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Jan 27 15:13:19 2017 +0100

    Changed logo to colored version

[33mcommit c2367de333c9d1de624f4c6eaff5e1f3dd1848f5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jan 26 22:38:55 2017 +0100

    Add toolbar, logo and background image to splash page

[33mcommit c0d0d4f7852497383ea4adaac3ec77f4ed0394a4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jan 26 22:37:15 2017 +0100

    Move logo to own component

[33mcommit c1986adea44de0424a33f7558c536ef68b1da44f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jan 26 02:11:08 2017 +0100

    Move all coloring to md themes

[33mcommit 8d35d733c3a9d4ebe29b0cf34cfe4cc68e3f784f[m
Merge: ee99536b 5cd6057b
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jan 26 00:20:35 2017 +0100

    Merge branch 'master' into designImprovements

[33mcommit ee99536b7c98a7a46e14043d38d9fc93277579e3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jan 26 00:10:28 2017 +0100

    Use Angular-Material palette

[33mcommit 5cd6057babc9e4884323e340d2f9f50b1746f8b8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Jan 19 18:08:40 2017 +0100

    chore: change deployment to foodsaving.world

[33mcommit 149b2e76cff3c8ddc9e03f732666b572dd4b5ed3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jan 18 16:25:01 2017 +0100

    localize: add swedish configuration

[33mcommit cbf39f66b556a69bf8e4ef7daf79b79e1319b01b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Jan 18 16:15:46 2017 +0100

    localize: swedish from transifex

[33mcommit 87b7330358cfe29801bb9d5bc72d58c7d0bd83b1[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Jan 17 15:55:30 2017 +0100

    Update German locale from transifex (#262)
    
    Thanks @djahnie for the Translation!

[33mcommit 9247bd58a3f12f925d0cc5eae1a1e8d0c548f10e[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Thu Jan 12 09:25:45 2017 +0100

    chore(package): update karma-webpack to version 2.0.0 (#261)
    
    https://greenkeeper.io/

[33mcommit 7e9e53dcd203516a730ff17c627989866fcd6efe[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 30 18:00:10 2016 +0100

    Fix spelling

[33mcommit 1a525549a9f4f3a5fc5919bfa730943720476730[m
Merge: 9e0170e1 207639ec
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Dec 30 17:57:10 2016 +0100

    Merge pull request #254 from yunity/loadingbar
    
    Add automatic loading bar

[33mcommit 207639eca9b3ded5190975acb8fa4b6f96da59e9[m
Merge: 30ad8dc6 9e0170e1
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Dec 30 17:26:16 2016 +0100

    Merge branch 'master' into loadingbar

[33mcommit 9e0170e1209a11d7133b9ca77d3c86f45f7e28f9[m
Merge: 6e8ef30f 8c1a926f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Dec 30 17:08:19 2016 +0100

    Merge pull request #253 from yunity/mailing
    
    Mail verification, password reset, password change

[33mcommit 6e8ef30f22f4abe95d05f5c109cebb7224d595e3[m
Merge: b76341a5 1bfec2a0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Dec 30 17:05:30 2016 +0100

    Merge pull request #251 from yunity/groupPassword
    
    Group password and public description

[33mcommit 30ad8dc6a15b9d0e76c8e11677efeb18c021e633[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 30 12:43:35 2016 +0100

    Add automatic loading bar
    
    Should enhance UX by showing the user that something is happening in the
    background
    
    Closes #200

[33mcommit 8c1a926f17219d6072328b554261ae926184c937[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 30 09:38:47 2016 +0100

    Empty controller for verifyMail

[33mcommit 82c9fd44d52404f5e7d16047f761bdc3fa8104e7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 30 02:25:19 2016 +0100

    Fix tests
    
    HAH! Go away, httpBackend! It's not that I don't like you, but it's it
    simply didn't work and I still have no idea why. Plain promises to the
    rescue!

[33mcommit 1170f6b72d75cfb629e04761f3346b5f16835036[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 30 00:49:17 2016 +0100

    Password change field on user page

[33mcommit a90ee1ae656b9733ace5f5e491445d98ea6ecf18[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 29 23:45:03 2016 +0100

    Add password reset
    
    TODO: three route tests are skipped, can't get it running

[33mcommit 07bb856f6408171ba9cf22fdf6c1ba3ee0ded116[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 29 22:38:27 2016 +0100

    Mail verification page
    
    Tests still fail, I don't know why it doesn't find the route.

[33mcommit ed8995cee161103bc35d46df26622c81e49b5b52[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 29 21:18:08 2016 +0100

    Fix generator
    
    Authentication is needed for the redirect hook

[33mcommit 1bfec2a0700f61d89770250e513de123ae13089f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 29 20:23:14 2016 +0100

    Disable button if form is invalid
    
    Also requires that the server check status is reset after keypress

[33mcommit dde52f6c6f015798be87ba572f25ea9ddcca6e03[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 29 19:28:24 2016 +0100

    Move toggle to HTML

[33mcommit c354009e1e9582fe80361d677166f3079fe1997c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 29 19:24:30 2016 +0100

    Add group settings for public_description and password

[33mcommit 56d8bed3f1c6a7666c7378f21cae7691c9d44896[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 29 19:08:11 2016 +0100

    Ask for group password and show public_description

[33mcommit 3d767230f1f640c231cd44b2ff43f0b514eb7d3e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 28 13:20:04 2016 +0100

    WIP: group join with password

[33mcommit b3ab8da9759867c03ad7451aa2ebf26bc097e3fe[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 28 11:18:17 2016 +0100

    Add lock icon

[33mcommit c3130a11dbe26b52074c487a0084b011a052be54[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 28 10:05:16 2016 +0100

    Extend group.join with a data parameter

[33mcommit b76341a528621b765960c10f688935b879a5c1e5[m
Merge: 34e0ae5a ea2bc85d
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 27 18:45:11 2016 +0100

    Merge pull request #249 from yunity/fixDatepicker
    
    Fix datepicker

[33mcommit ea2bc85df3633535d4d41dec82b1546a12d249fa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 27 18:22:03 2016 +0100

    Move leaflet controls below md-dialog

[33mcommit dd155e2594897c67ab25d1ace58fbd59358f6abd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 27 17:56:11 2016 +0100

    Revert "Move md-dialog on top of leaflet"
    
    This reverts commit 97e845e186797f4c8bca6e83328ab30d04faa076.

[33mcommit 34e0ae5ac075af217fe0037f46c036a79afd9c78[m
Merge: 0c27670a 7ab1607c
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 27 17:28:25 2016 +0100

    Merge pull request #236 from yunity/improveExpandable
    
    Improve expandablePanel

[33mcommit 0c27670a45b4f258f64b8aa0bc132928618118e9[m
Merge: 6700acef 350c9e49
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 24 16:02:19 2016 +0100

    Merge pull request #240 from yunity/confirmDeletePickup
    
    Add confirm dialog before deleting pickup

[33mcommit 6700acef088e4e8be4032fbb388819eb9c140139[m
Merge: bd028976 97e845e1
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 24 16:02:04 2016 +0100

    Merge pull request #241 from yunity/fixMdDialog
    
    Move md-dialog on top of leaflet

[33mcommit 7a68a0eef9cd2aad3c383aefd1d337ac6cab8956[m
Merge: 832bf114 bd028976
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 23 20:14:07 2016 +0100

    Merge branch 'master' into storeDetailMultiview

[33mcommit 350c9e49ebe05c6e21f5233a567361aef281eebd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 22 16:43:01 2016 +0100

    Extend test

[33mcommit 97e845e186797f4c8bca6e83328ab30d04faa076[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 22 16:23:01 2016 +0100

    Move md-dialog on top of leaflet
    
    they have astronomic integers there...
    Closes #226

[33mcommit 7dc0afe0bd1d487df6189f28589485a8d035d685[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 22 16:08:37 2016 +0100

    Add confirm dialog before deleting pickup
    
    Changed the icon to a trash bin.
    Use pre-rendered DOM for dialog, it seems easier if we don't need
    dynamic content in the dialog.

[33mcommit bd028976d5ff1ba3ab52afe918730675ba74dda7[m
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Thu Dec 22 13:11:05 2016 +0100

    typo in CONTRIBUTE.md

[33mcommit 832bf11497c2aab51548c47d1ce14a92e2032c04[m
Merge: 5f30a880 1949c747
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 21 23:04:01 2016 +0100

    Merge branch 'master' into storeDetailMultiview

[33mcommit 5f30a880bdc007b34b111a3f2d32484a2ac660e1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 21 22:19:03 2016 +0100

    Move dependencies to their usages
    
    I think it's much better to understand if every module includes all the
    things it depends on.

[33mcommit df3080f88c6d5b7d097c77d6843f989dff08071d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 21 21:52:24 2016 +0100

    Equalize formatting

[33mcommit 1949c747b4be7a55d10d71a87493d4d0343fa463[m
Merge: 211f87a0 7b09401a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Dec 21 13:17:53 2016 +0100

    Merge pull request #234 from yunity/updateContributionmd
    
    Add messages/translation workflow

[33mcommit 7b09401a1ea088ae5517e0091b4f28e88e8c8757[m
Merge: 4a4646b6 211f87a0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Dec 21 13:17:46 2016 +0100

    Merge branch 'master' into updateContributionmd

[33mcommit a0afdf9f1e5c01b05c62f82ad6927744db65ea3d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Tue Dec 20 22:32:22 2016 +0000

    Fix store detail test to include parent route
    
    The test needs to load all modules which define parent routes
    or the route is not registered and will not be triggered.
    
    At the moment the routes do not have a hook to check for
    authenticated status, so I removed that part of the test too.
    
    Current backend will return group info without auth, but not
    store info. Not sure what is intended.

[33mcommit 7ab1607cbc98cc2dfbb778d57d3f1ad14dc399fb[m
Merge: 9edf83fe 211f87a0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 20 16:10:21 2016 +0100

    Merge branch 'master' into improveExpandable

[33mcommit 211f87a08f35e6e758315eacdbf7eb4dc63aac72[m
Merge: 0b692d24 518c2a47
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 20 16:10:01 2016 +0100

    Merge pull request #235 from yunity/storeMarkdown
    
    Add expandablePanel to storeDetail and fix editing

[33mcommit 90543bcb14dd31a1e66388d1a9a241a02a2154ad[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Dec 19 13:25:01 2016 +0100

    Fixed most tests again.

[33mcommit 38ebe209d8e9427a1f30c97270da09ff28087e19[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Dec 19 12:58:05 2016 +0100

    Desktop version now only shows one description on group/*/description (bottom one)

[33mcommit 7ac1dc38e6894b08cc8d0bcf61e29b0094a13eee[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Dec 19 12:53:33 2016 +0100

    Added whiteframe to userDetail

[33mcommit 9c9af30a08087673a157edffb52053bfcfca9d25[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Dec 19 12:51:32 2016 +0100

    Fixed directory structure

[33mcommit 67337f4c4c45a93ed3767831e2d9b17ea274b010[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Dec 19 12:33:07 2016 +0100

    Changed Routes

[33mcommit 0b692d2426aa676c505cbd4a414f7fd7ebe70f26[m
Merge: fd177f10 5b236ea5
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 18 22:41:50 2016 +0100

    Merge pull request #232 from yunity/sideNav
    
    Show current user + Side Nav

[33mcommit c3086052679c21007592efd234d80aa39f49e153[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 18 22:34:27 2016 +0100

    Fix most tests, add a dependency

[33mcommit cead33ba791194bb61340129bca7aa27432cab08[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 18 10:40:07 2016 +0100

    Fixed link in StoreList map

[33mcommit d9ad9a8f0575cc8f43fff6d2f365aac8c117cb0a[m
Merge: 219d5b51 fd177f10
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 18 01:28:52 2016 +0100

    Merge branch 'master' into storeDetailMultiview

[33mcommit 219d5b517bef0521a0371321d915a9fece759d02[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 18 01:27:24 2016 +0100

    Fixed some errors

[33mcommit 5b236ea5f0bf47aba082e113ad298c284f85e18e[m
Merge: 8175ad6c fd177f10
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 18 00:58:22 2016 +0100

    Merge branch 'master' into sideNav

[33mcommit 4a4646b6a496bce4130a33a55ed565b0412018ad[m
Merge: facd92ef fd177f10
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 18 00:58:08 2016 +0100

    Merge branch 'master' into updateContributionmd

[33mcommit 518c2a478ce600921b542417f606ce96bf051397[m
Merge: de1f5a2c fd177f10
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 18 00:57:59 2016 +0100

    Merge branch 'master' into storeMarkdown

[33mcommit 9edf83fec7378cdf7810e7967f35fe223ed5e480[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 18 00:43:43 2016 +0100

    Set max-height depending on the input

[33mcommit 1b47f178e16aff0e66269304f29c128d069627be[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 17 19:05:56 2016 +0100

    Use more ES6-like style

[33mcommit fd177f10271032bb9aa895f0cabf17d29ae9b993[m
Merge: 38dd6c74 d966f35c
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 18 00:42:45 2016 +0100

    Merge pull request #194 from yunity/updateAngular
    
    Upgrade angular to 1.6

[33mcommit 40ab5f2136b4730e35f391c0c2fb72c4847218a9[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 18 00:00:44 2016 +0100

    New Routes, with another nested state inbetween:
    groupDetail -> store
    groupDetail -> group -> members / description / pickups / stores

[33mcommit cf555e6ba8b2c6d9b3a70134f9555193c80acfdf[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 23:22:57 2016 +0100

    Moved StoreDetail to group
    Added description component for mobile version

[33mcommit de1f5a2c831e78484739b6dd1a87484f2c5a57cf[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 17 18:57:23 2016 +0100

    Add expandablePanel to storeDetail and fix editing
    
    Editing of title and description was broken since last change

[33mcommit facd92efe5c85b0a4ec39cadf39ebb27f4ff3735[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 17 17:51:27 2016 +0100

    Add messages/translation workflow

[33mcommit 8175ad6c21a9e99fb1acd2c7868cdb2b1a1771ec[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 16:40:57 2016 +0100

    Fixed unused var lint error

[33mcommit 167473afe4d1f12eb5ca103137dc700e8ad6efd6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 16:39:37 2016 +0100

    Added more aria labels to get $log.assertEmpty to work in view.

[33mcommit 982da2c4d6946afb9dcbca9b59e51e911a3a4ba7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 16:19:27 2016 +0100

    Added toggleRight test
    Fixed log error in groupMenu

[33mcommit f2a6c067b4b9bc0557dd90ff0a86fc4141104fe8[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 16:19:11 2016 +0100

    Moved toggle right from scope to Controller

[33mcommit a3d11d5481e722cfeae28e9dcd050b6724f9117f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 15:28:31 2016 +0100

    fixed lint errors

[33mcommit d2a654592ab835de3dadcb265f9b453f14784b86[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 15:20:07 2016 +0100

    Added aria Labels for pickupListItem

[33mcommit a172572de348b078a6b0e98be660977f084900a7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 15:18:55 2016 +0100

    Added default routing in groupDetail Controller

[33mcommit ef9e887caf9542a68b6366bf9196cf5b46d0033a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 15:06:29 2016 +0100

    Added mobile Store List
    Added tests

[33mcommit e60f44d24f4db04af24d00d069c4703bf6727b58[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 14:43:56 2016 +0100

    Fixed aria labels in pickupList

[33mcommit 07fe30fa0dabe8c0783016ce6ddd1a63b6c052b6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 17 13:57:06 2016 +0100

    Moved Member & pickup tabs to own pages

[33mcommit d966f35c0c790fdcf564c6374611c175f8cff311[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 17 12:15:52 2016 +0100

    Pin/downgrade angular-material to 1.1.0
    
    Resolves datepicker issue

[33mcommit 276a074d22c8b67c99e284ef39c5423255c8a9d4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 17 12:07:39 2016 +0100

    Move $onChanges to controller functions
    
    Consistency with $onInit

[33mcommit baa3740071fae39f5296e54a46e6a0d41f40da9c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 17 12:05:59 2016 +0100

    Move other init logic to $onInit
    
    For consistency with the init stuff that requires bindings to be valid

[33mcommit 30df34af8422c03b063c03471bbd895d5ec00c1a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 17 12:02:02 2016 +0100

    Move access to bindings to $onInit
    
    This is a breaking change in Angular 1.6, bindings aren't set when the
    constructor is called.

[33mcommit c9ae8c4564284ddd21b922c36d4f6c1d83238095[m
Merge: 63d63b33 38dd6c74
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 17 11:08:26 2016 +0100

    Merge branch 'master' into updateAngular

[33mcommit d72959be122388c371bc0734b523eff9e1de5863[m
Merge: b35838f7 38dd6c74
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 16 02:09:01 2016 +0100

    Merge branch 'master' into groupDetailMultiview

[33mcommit b35838f7caed57e43182467381e89cc0fcb28c37[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 16 02:08:53 2016 +0100

    Main UI View is now wider

[33mcommit 18649d6603bea2c0b2df73e8071554fa03503477[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 16 01:42:22 2016 +0100

    Made headline bigger

[33mcommit f4dcccb2c64c65d24f8d443149f6afa1744a1f9a[m
Merge: 0431e645 38dd6c74
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 16 01:30:17 2016 +0100

    Merge branch 'master' into sideNav

[33mcommit 0431e64535526386e253479c8812eb5d8c7a06ba[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 16 01:28:52 2016 +0100

    Translated Greeting in Sidenav Topbar

[33mcommit b0981e2c137110844d94d1f7de8474af2adabbcb[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 16 01:01:27 2016 +0100

    Fixed eslint errors

[33mcommit 42d5cc737aa931f0dc494811d8840246f3fdb7d8[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 16 00:58:32 2016 +0100

    Added SideNav to Topbar

[33mcommit 38dd6c747890bb5dedfeb5792e730873f0d9b40d[m
Merge: 29c0093a 19e75b74
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Dec 15 19:39:23 2016 +0100

    Merge pull request #227 from yunity/noEmptyMap#216
    
    Don't show empty map when store has no coordinates

[33mcommit 29c0093a3aeeb506d9599aef19f9cfabd62aaf07[m
Merge: 8b84cef3 9f33b35d
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Dec 15 19:38:50 2016 +0100

    Merge pull request #230 from yunity/greenkeeper/eslint-3.12.2
    
    Greenkeeper/eslint 3.12.2

[33mcommit 8aa5b7ccc5c8d769a08d04757e41b0b96d2cd0e2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 14 21:05:18 2016 +0100

    Remove unused var

[33mcommit 9f33b35d891b26270784fcf99874f19f18ee7032[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 14 21:04:18 2016 +0100

    Modify files to comply with eslint fix

[33mcommit a562393ad7ccabb76d8019356ad60d89f7a42d47[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 14 20:53:39 2016 +0100

    Add test

[33mcommit 1e0e7c9fae944ed80b2156530d59c2a49dcc1d4a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 14 20:41:43 2016 +0100

    Add user profile link to topbar

[33mcommit 0df034453e16cb556841ebbed59824ed44b30c78[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Wed Dec 14 19:29:32 2016 +0000

    chore(package): update eslint to version 3.12.2
    
    https://greenkeeper.io/

[33mcommit 19e75b744066ea4b3e5931edc7991f20e3f53865[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 14 20:09:10 2016 +0100

    Don't show empty map when store has no coordinates
    
    Closes #216

[33mcommit 8b84cef3da25d357d3000c164a4b9367a1c32b59[m
Merge: dd657166 37b19bfa
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Dec 14 13:41:32 2016 +0100

    Merge pull request #225 from yunity/changelogR1
    
    Add changelog and release 1

[33mcommit dd657166f7aee3743b40a9ab6bd799db1617ea5a[m
Merge: 549d4bb9 0b759a8d
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Dec 14 13:39:43 2016 +0100

    Merge pull request #222 from yunity/logoUpdate
    
    Logo update

[33mcommit 37b19bfa84ff58902d859863b92a66fad9d5e53b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 14 13:21:57 2016 +0100

    Add changelog and release 1

[33mcommit 549d4bb96923587845a19f3c80d16080500e7d5c[m
Merge: a95fb138 5e12632b
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Dec 14 12:50:52 2016 +0100

    Merge pull request #223 from yunity/roadmap
    
    First draft of roadmap

[33mcommit 0b759a8d50a5ef0188a689e73dce2ad62ab00aae[m
Merge: 62348e35 a95fb138
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 13 21:08:04 2016 +0100

    Merge branch 'master' into logoUpdate

[33mcommit a95fb138203ff840ddc488137c774421751e2410[m
Merge: dcea7bbf ce29a85f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 13 21:07:42 2016 +0100

    Merge pull request #219 from yunity/deletePickups
    
    Add delete button to pickupListItem in store view

[33mcommit 5e12632bc57cfc7eb8d9e4e2fc802533cf8ee6e9[m
Merge: 4b8ec7e0 c86d6e85
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Dec 13 15:29:27 2016 +0100

    Merge pull request #224 from djahnie/patch-1
    
    fixed layout of last line

[33mcommit c86d6e8575021e2cea98c49a162af58942e32f9e[m
Author: djahnie <hopefullyunique@gmx.de>
Date:   Tue Dec 13 15:28:10 2016 +0100

    fixed layout of last line

[33mcommit 4b8ec7e027ab8503c048188579f15fba23a7a4c7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 13 15:17:42 2016 +0100

    First draft of roadmap

[33mcommit 62348e35e908b78770d814874b63055b5456365d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 13 13:36:24 2016 +0100

    Add workaround for svg images
    
    As fonts and images can have a svg ending and the font files are not
    under our control, svg images should have the file ending "svgimage".

[33mcommit 58fbf36dd493a661667e2799af0ad6b4d23cbd6e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 13 13:35:48 2016 +0100

    Remove explicit loading of font files
    
    They will be loaded via css-loader

[33mcommit fd5ce9d87f79f1b82c4f68a239780c0dacfaf599[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 13 13:35:03 2016 +0100

    Add new logo
    
    inspired by Sandra's proposal

[33mcommit ce29a85f60a32b9b1811b6b151913da6753880ab[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 13 12:02:15 2016 +0100

    Add string

[33mcommit 365c414880b419a4ccc4df0cb84c53a908976a9c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Dec 13 00:09:06 2016 +0100

    Added number of members

[33mcommit 0b8faf7f9f71284e2c47ed74f4122f1cd57d13dd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Dec 13 00:05:38 2016 +0100

    Add delete button to pickupListItem in store view
    
    Using onDelete binding from parent controller
    calls updatePickups on each delete, because I had no idea where to
    remove the pickup in question (groupedPickups?)

[33mcommit 51ce4122f4b03c8324e4f32a6a2a2935cfdc5171[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Dec 13 00:05:29 2016 +0100

    Added Tabs again to show members

[33mcommit 316d72dc68155094cfef4b50e1e80976fe2e6bd3[m
Merge: da7bb888 dcea7bbf
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Dec 12 23:59:55 2016 +0100

    Merge branch 'master' into groupDetailMultiview
    
    # Conflicts:
    #       client/app/components/groupDetail/groupDetail.controller.js
    #       client/app/components/groupDetail/groupDetail.html
    #       client/app/components/userDetail/userDetail.html

[33mcommit da7bb888640e8a9177c40b8a9954fd2646b8090d[m
Merge: d975a1e6 2fae3818
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Dec 12 23:31:58 2016 +0100

    Merge branch 'master' into groupDetailMultiview

[33mcommit dcea7bbfe07a3e064e421ce999ca9edeabd65203[m
Merge: 043511f4 accce4f7
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Dec 12 13:45:27 2016 +0100

    Merge pull request #207 from yunity/userDescription
    
    User description and editable

[33mcommit accce4f7e417fa3e83be609dd6aa73b8c91410d2[m
Merge: 1cf5da37 043511f4
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Dec 12 13:45:19 2016 +0100

    Merge branch 'master' into userDescription

[33mcommit 043511f460e6b6c1d4005273adace909c8d2eb54[m
Merge: be04b389 25ceecf0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Dec 12 13:41:33 2016 +0100

    Merge pull request #198 from yunity/storeDetailEnhancement#183
    
    Editable address and map for storeDetail

[33mcommit 1cf5da37adb43353cf21bb69e006aa3ee349aea0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Dec 12 13:38:43 2016 +0100

    Add expandablePanel to user description

[33mcommit 4fc8519a9e909ad3115d734f03a10f98d136d0d5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Dec 12 13:37:50 2016 +0100

    Add collapse option to set max number of lines

[33mcommit 25ceecf0d51ecd8107a30d87dc7e6b07e779c711[m
Merge: 46f00d71 be04b389
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Dec 12 13:36:16 2016 +0100

    Merge branch 'master' into storeDetailEnhancement#183

[33mcommit 563b2df8ed20f5ec8febb77d40b743d081c44ba7[m
Merge: dab16a9d be04b389
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Dec 12 13:21:53 2016 +0100

    Merge branch 'master' into userDescription

[33mcommit be04b389bb458e5fa415ac4c8b75d9d0a65916c6[m
Merge: c11d7ec4 05b6dc7e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Dec 12 13:21:22 2016 +0100

    Merge pull request #203 from yunity/expandablePanel
    
    expandablePanel with markdown support

[33mcommit 05b6dc7ea5c273d88397c89e14f39c33bb25cc84[m
Merge: 7f930f13 c11d7ec4
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 11 19:13:23 2016 +0100

    Merge branch 'master' into expandablePanel

[33mcommit dab16a9d060dfd9e8e94b5fb75f4a8408cca34f8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 19:08:12 2016 +0100

    More tests for userDetail

[33mcommit 832157b6b9bab18d84e3c1e548dfd3ca03af7a03[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 18:41:11 2016 +0100

    Make userDetail editable and add description

[33mcommit 7f930f13e246f13ce1ec6b91cb9f03a7d6e71c06[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 16:04:09 2016 +0100

    Add test for collapsed text

[33mcommit ce3e7af5ca326af890c71a9bfd2590e73868f085[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 15:58:37 2016 +0100

    Remove collapse-again option, simplify css
    
    I think most people wouldn't want to collapse it again after they read
    it.

[33mcommit 0e5983cce7cac5f349b7570199866d82904dca60[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 15:43:23 2016 +0100

    Use inline toggle, use md-button

[33mcommit d975a1e62a56730e49f6fb2f53ffa4d05b81241d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 11 11:19:10 2016 +0100

    StoreList is now left

[33mcommit e2fb9bb69fc931bd84b8b9e444b505e8411b5da1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 11:01:05 2016 +0100

    Increase size of collapsed panel

[33mcommit 10880f0d2f8144b8a7cfb4d041bf3fe900ca6f08[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 10:56:45 2016 +0100

    Add tests and angular-sanitize
    
    Using angular-sanitize seems better for me than using $sce.trustAsHtml.
    It's basically another sanitization step after markdown-it.

[33mcommit 384bfe800e54786ecf587037872cc7f3c121ae4d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 10:35:53 2016 +0100

    Open links in a new tab, add rel attributes
    
    noopener prevents handing out window.location
    noreferrer does the same for old browsers
    nofollow tells google that we don't endorse the target (prevents use for
    spam)

[33mcommit e29e630fd6efd5eebba97b3b1ec8b9125f50da1d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 10:19:58 2016 +0100

    Use $onChanges to react to updated content

[33mcommit 4e304a26df5f9a01e6e30a6dcbf27aaf7fa8f6ef[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 10:14:15 2016 +0100

    Show at least 10 lines

[33mcommit 46f00d7110f77a5e5c33534ab24e88ada6e715e3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Dec 11 09:45:39 2016 +0100

    Add more tests

[33mcommit c11d7ec48f2650144ad5c1441a8e957c7c64c5b1[m
Merge: c582353e 95a5f589
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 11 09:23:37 2016 +0100

    Merge pull request #196 from yunity/hideEmptyGroups
    
    Don't request empty groups from the server

[33mcommit 95a5f5890916f73b2fd7e1de39fa1dc7010c358d[m
Merge: 08d4ceb1 c582353e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 11 09:23:28 2016 +0100

    Merge branch 'master' into hideEmptyGroups

[33mcommit c582353ee67983968962aca15e09322b281f9193[m
Merge: 21cc9bb8 87f3d6e2
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 11 09:23:13 2016 +0100

    Merge pull request #195 from yunity/leaveGroupHotfix
    
    Hotfix: use groupData.id instead of stateParams

[33mcommit 87f3d6e2d33b0422fa1acee3e0b7f098ea1908e7[m
Merge: 771a59a5 21cc9bb8
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 11 09:23:02 2016 +0100

    Merge branch 'master' into leaveGroupHotfix

[33mcommit 21cc9bb8f35c092a0e97dceac5b0586d0a7905f6[m
Merge: bdcf4582 5571efac
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Dec 11 09:22:42 2016 +0100

    Merge pull request #204 from yunity/noPickupMessage
    
    'No upcoming pickups' message

[33mcommit 5571efacea2d271001464b0815f13443478ffc81[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sun Dec 11 01:02:26 2016 +0100

    i don't like dots

[33mcommit 00c536b7723a5d5e345651ca3f473cf380f19d22[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sun Dec 11 00:59:31 2016 +0100

    show message when there are no upcoming pickups

[33mcommit 93404fc39bdd80ac97163ce2bf3c3af3c6a302e0[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sun Dec 11 00:13:04 2016 +0100

    wrapped group description into expandablePanel

[33mcommit d2e4db202286a898b901fb275421c23fa24db362[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Sun Dec 11 00:12:06 2016 +0100

    created expandablePanel with markdown support

[33mcommit 3d5e1c72eb2947c1fc7af6884e8543fbecfe8123[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 10 21:44:19 2016 +0100

    Make storeDetail map editable with address lookup
    
    Using a custom implementation of inline-editable fields, because the
    angular-xeditable doesn't provide enough control over behavior. Example:
    accessing the value of the edited address field for lookup, before even
    trying to save.

[33mcommit 85a77ba6872e6060760788d669719da835eafeb5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 10 18:37:17 2016 +0100

    Add map to storeDetail

[33mcommit 2c77a89503d10756b7b2ef2f3f69bd7ebbe989dc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 10 17:31:40 2016 +0100

    Add editable address field to storeDetail

[33mcommit 08d4ceb1729b826b6a2bbe516951db032414f1b6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 10 17:13:25 2016 +0100

    Don't request empty groups from the server
    
    They aren't shown in the joinGroup dialog anyways, so why request them?

[33mcommit 771a59a5909e487af210f110e3c83b815ea7bf15[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 10 17:02:52 2016 +0100

    Use groupData.id instead of stateParams
    
    There should only be one way how to get the group id. Somehow, this also
    broke the "leave group" functionality, always sending "undefined" to
    the backend.

[33mcommit 63d63b3352b2accacc3d03f0e0f936f9798543de[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 10 15:19:59 2016 +0100

    Upgrade to angular 1.6

[33mcommit bdcf458251915ffb565e4747eaabffb9aa1f5a95[m
Merge: 062beaac a87a7ef0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:53:52 2016 +0100

    Merge pull request #179 from yunity/transifex
    
    Transifex configuration and README

[33mcommit a87a7ef021adfa238109c6a3c43c8a5147d6e9ba[m
Merge: ba73b58e 062beaac
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:53:40 2016 +0100

    Merge branch 'master' into transifex

[33mcommit 062beaacedbc5f953ff4ea11e20ff6b86573cf67[m
Merge: e9800776 fc0b1d53
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:53:19 2016 +0100

    Merge pull request #182 from yunity/showUpcomingPickups
    
    PickupDate service only returns upcoming pickups

[33mcommit fc0b1d53ab56262944299528456101d025d99e65[m
Merge: e4c652bd e9800776
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:53:12 2016 +0100

    Merge branch 'master' into showUpcomingPickups

[33mcommit e98007768c0507d8dd1968db9a4a890f3af0b42c[m
Merge: 5f0a5e3a 3a0da715
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:52:51 2016 +0100

    Merge pull request #184 from yunity/contributeLinks
    
    Added contribute links

[33mcommit 3a0da715d92c41d51439825f5b9ca549e647a147[m
Merge: 52063a79 5f0a5e3a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:52:43 2016 +0100

    Merge branch 'master' into contributeLinks

[33mcommit ba73b58e2b684034430e5574cb690e673b543a46[m
Merge: bef83213 5f0a5e3a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:52:30 2016 +0100

    Merge branch 'master' into transifex

[33mcommit 5f0a5e3a34054b3d5609d81dfb36f845cf9eadf0[m
Merge: c610b3ef cb36af96
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:51:55 2016 +0100

    Merge pull request #180 from yunity/postcssConfig#164
    
    Move postCSS config to it's own file

[33mcommit cb36af96d03209eaf1d99e8cbf2a07036bf43bb4[m
Merge: dd643bbb c610b3ef
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:51:46 2016 +0100

    Merge branch 'master' into postcssConfig#164

[33mcommit e4c652bda1505e3d336373c49508b2ffbe369736[m
Merge: 274144ff c610b3ef
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:51:19 2016 +0100

    Merge branch 'master' into showUpcomingPickups

[33mcommit 52063a791b8e95f1e2019fbb3a8fbe2b2b6be2c0[m
Merge: 39bd7799 c610b3ef
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 10 14:50:30 2016 +0100

    Merge branch 'master' into contributeLinks

[33mcommit 39bd7799512e3c531c8eeb568055a525cfa5afd7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 7 23:26:43 2016 +0100

    Style improvements
    
        make the mail link clickable
        remove the DEVMAIL note (or as tooltip)
        use fa-heart instead of entity
        use fa-envelope also in main.html
        use normal font size, it's better to read
        use opacity instead of color changes, it adapts better

[33mcommit c610b3ef042e2b1ca974458093e5d8abb8c5f74c[m
Merge: 2fae3818 bc2dd3c1
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Dec 7 23:05:28 2016 +0100

    Merge pull request #178 from yunity/signupWarning
    
    Warn users on signup

[33mcommit bc2dd3c136a4c541f2b100ea9b3c1bc2a6483055[m
Merge: 9bc4a227 2fae3818
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Dec 7 23:04:27 2016 +0100

    Merge branch 'master' into signupWarning

[33mcommit ba0098fb6a716fad34d987bd45bd4cad6eea67c3[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Dec 7 19:07:19 2016 +0100

    contributeLinks: removed duplicated string

[33mcommit 11126665164d76abde228846d2bd308418574fae[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Dec 7 19:02:37 2016 +0100

    contributeLinks: use the translate attribute instead of filters

[33mcommit 44484d9a3bd23d35f16dc70873ba85c2f220a600[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Dec 7 18:51:07 2016 +0100

    contributeLinks: added footer

[33mcommit 7aead4885aa1209feeae2824fe655db344769294[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Dec 7 18:46:10 2016 +0100

    contributeLinks: added github & mail to splash

[33mcommit 274144ffb210de53e46041cfe75af92baa420c64[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 7 17:21:15 2016 +0100

    PickupDate service only returns upcoming pickups
    
    For now, we only need future pickups.

[33mcommit dd643bbbfb3b0e8292a32fa363fc4a90124447a7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 7 15:55:21 2016 +0100

    Move postCSS config to it's own file
    
    Fixes warning messages, don't know if they were serious.

[33mcommit bef83213e427ef28e936faf31766bb30071feee5[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Dec 7 15:39:29 2016 +0100

    Add transifex README

[33mcommit 9bc4a227af69b4d8a3781e4eeeadc20a945badb0[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Dec 7 15:34:36 2016 +0100

    signupWarning: copied to login

[33mcommit b863e3aca64437397ac1fd504b2854155d0de9ca[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Wed Dec 7 15:28:04 2016 +0100

    signupWarning: added title

[33mcommit ba38f9a910d72c52dc0bb0dc0ac4dbb37e18f01d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 7 15:22:59 2016 +0100

    Add Transifex CLI configuration

[33mcommit 25ebc2a96c3ed9388850f2038bc9ee651a2f23e5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Dec 7 14:59:20 2016 +0100

    Warn users on signup
    
    Closes #171

[33mcommit 2fae3818048cfd8760ecac8540dcdc700b376a47[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Dec 6 00:51:39 2016 +0100

    Hotfix: pickuplist - changed options->"pickuplist" to options->"filter"

[33mcommit 2ff42ec8c0e5a0eed18f90c89d59e094ccedcee2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Dec 6 00:43:52 2016 +0100

    Hotfix: storeDetail pickuplist - removed curly braces

[33mcommit 1a8468ba4b84c8aded468b5451e7c1e9b0e72dac[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Dec 6 00:39:38 2016 +0100

    Added more fancy headers

[33mcommit 5d7c584314cac5433790c1fec393f301a6abbf4e[m
Merge: bbf69cfb eb8f4ef5
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Dec 5 20:01:46 2016 +0100

    Merge pull request #175 from yunity/frenchTranslation
    
    French translation

[33mcommit eb8f4ef5d7b9592203e6bbb69b18162f282fb86e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Dec 5 19:38:34 2016 +0100

    French translation

[33mcommit 424f4a65f0dfbe2f8e138432bf32e570c49941fd[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 4 00:06:23 2016 +0100

    Fixed lint errors

[33mcommit 3aefce48b5930a8e85cffc31d1e4c34c391e95b4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Dec 4 00:03:45 2016 +0100

    Fixed Whiteframes and pickuplist errors

[33mcommit d3816135e042a27e8db79611346a019baf3c991c[m
Merge: 480022a2 bbf69cfb
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 3 23:54:00 2016 +0100

    Merge branch 'master' into groupDetailMultiview
    
    # Conflicts:
    #       client/app/components/groupDetail/groupDetail.html
    #       client/app/components/storeDetail/storeDetail.html

[33mcommit 480022a27b13c4a03aeba821836c1d7679b4c4da[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 3 23:38:52 2016 +0100

    Added Multiview, removed md-whiteframe class from standard layout and added it to *Detail pages

[33mcommit bbf69cfbb4153090cb66a65989fc1098d8499afc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 21:24:17 2016 +0100

    Changed bindings of pickupList to one-way

[33mcommit a1a53ea07ddf7c1733688f9417bd79d43c05f184[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 21:16:58 2016 +0100

    Load stores only when groupId is defined
    
    Otherwise all stores are shown, even which are not in group

[33mcommit ab0425c75a658a2715efc1b8ce8e39465577a50e[m
Merge: 859dd575 3bea26e5
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 3 19:46:25 2016 +0100

    Merge pull request #140 from yunity/editableFields#123
    
    Editable fields

[33mcommit 3bea26e5c8be323c4e0681aa7feea66a4e4e0d5b[m
Merge: 02354f86 859dd575
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 19:42:40 2016 +0100

    Merge branch 'master' into editableFields#123

[33mcommit 859dd575547c58242223efde1849bb87d4e92ec8[m
Merge: 520b8d1c 19c44964
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 3 19:30:28 2016 +0100

    Merge pull request #167 from yunity/nestStores#103
    
    Nest store into groups

[33mcommit 19c449646c0dd1c6a2611064d61460ebb181f8db[m
Merge: e849a95b 520b8d1c
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 3 19:26:36 2016 +0100

    Merge branch 'master' into nestStores#103

[33mcommit 520b8d1c8f8c9656f3a926fd065624c518993680[m
Merge: e5132f93 933f72cf
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 3 19:26:08 2016 +0100

    Merge pull request #172 from yunity/SmallDesignImprovements
    
    Small design improvements

[33mcommit e849a95b174da5d3c484e037920f8dc9f7cdeaac[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 19:24:24 2016 +0100

    Fix binding mistake

[33mcommit 0adf0ac06583da08238bcd3c8769a117d6fe1930[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 19:22:58 2016 +0100

    Fix ui-sref mistake

[33mcommit 11207782f9f33aeca4708e3578c2b8f85edb4fb6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 19:08:33 2016 +0100

    Fix tests

[33mcommit 933f72cf4ade1932753eaa67ce48300b0fff19dd[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 3 18:45:31 2016 +0100

    Added input field for pickup collectors

[33mcommit 478eb92ec663b25aad1aa876562d9ef000459e0d[m
Merge: 513a37e8 e5132f93
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 3 18:39:12 2016 +0100

    Merge branch 'master' into SmallDesignImprovements

[33mcommit cc4be6c47f4b85ff4ba876d12ad787b20eb69b47[m
Merge: 892b850d e5132f93
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 18:38:20 2016 +0100

    Merge branch 'master' into nestStores#103

[33mcommit e5132f93caebeb1bd1fe05025c606f7da521334d[m
Merge: 9e0ffde9 aff37354
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Dec 3 18:30:54 2016 +0100

    Merge pull request #168 from yunity/checkLogs
    
    Check $log output when running tests

[33mcommit 513a37e8ecf9f292e9c6c5b637adc19d969c641d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 3 18:16:43 2016 +0100

    Reduced margin of pickupList icons (better for mobile version)

[33mcommit 00269ff65b2822dc2775cf1468bba648a095a932[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 3 18:12:32 2016 +0100

    Fixed language chooser width, so that logout button is shown

[33mcommit 7acac6c899ac1878c38a0936f843bc44e248a2e6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 3 17:57:24 2016 +0100

    Improve createPickup dialog

[33mcommit 854e68bd3a58c96b677107823beb7560f3a0d82d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 3 17:36:07 2016 +0100

    Added icons to store & group page

[33mcommit 04844437b9aa51a3c57693d220d8e0d682608005[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Dec 3 17:25:26 2016 +0100

    Map is now responsive

[33mcommit aff373540c5152e69e608696fdef6722e292d960[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 00:51:32 2016 +0100

    Enhance groupDetail state test
    
    Now also the resolve function is covered.

[33mcommit a15731e030d31090fde408553570b4c177d202d2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 00:44:09 2016 +0100

    Remove leftover stores binding

[33mcommit 3263ace847e97288445308f6aabc5c0f78f066f6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Dec 3 00:30:14 2016 +0100

    Simplify storeList
    
    - rename storeData to storeList
    - only bind groupId, always retrieve stores from service
    - test everything

[33mcommit bdbbef8273f41c7ca86994055522466ff3177a93[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 2 23:27:59 2016 +0100

    Add log-checking to generators

[33mcommit 892b850d1f035a30d5cc216fba713b8b12f982b2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 2 22:15:33 2016 +0100

    Nested store into group url
    
    I did not nest the states (yet).

[33mcommit c920e271e0baefb560a6d8c3e8a3fbd48a6922a5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 2 21:23:22 2016 +0100

    Check angular log for messages when running tests
    
    Should be empty, otherwise fail. Will be helpful when testing templates.

[33mcommit 0e58c36e0787b57d6326f0764ac4684caff4c9d6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 2 21:23:02 2016 +0100

    Make karma reports nicer

[33mcommit 02354f86788e472ecaa1f5ae661f9526ea4a569a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 2 15:52:52 2016 +0100

    Use explicit edit button and material design

[33mcommit d2fd832dd14d2dd6789e034a505c04a44d56cb7d[m
Merge: 12041dd7 9e0ffde9
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 2 13:12:43 2016 +0100

    Merge branch 'master' into editableFields#123

[33mcommit 12041dd74d57795d9ef8b960485e5284a17f632d[m
Merge: 5282bf81 2b6c76a1
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 2 13:10:44 2016 +0100

    Merge branch 'master' into editableFields#123

[33mcommit 9e0ffde9885d52c0d7638c8ed355ef2ce94acca7[m
Merge: 2b6c76a1 f48f5ede
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Dec 2 11:50:47 2016 +0100

    Merge pull request #145 from yunity/mapIntegration#130
    
    Map integration

[33mcommit f48f5ede498674172d044ce84b0fcef6f521a290[m
Merge: 45163d67 2b6c76a1
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Dec 2 11:45:41 2016 +0100

    Merge branch 'master' into mapIntegration#130

[33mcommit 45163d679ae0cc91fe67d65673a7160ded2f300a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 2 11:43:01 2016 +0100

    Remove duplicate test
    
    This test covers a subset of the other test.

[33mcommit 94511a5badbc587eca473f11dd122f34f13f20a7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Dec 2 11:41:14 2016 +0100

    Test data change for createStoreMap

[33mcommit 63726fb232fc4217b8c90b28a81b7db94f18dfb7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 2 11:13:37 2016 +0100

    Removed max-content changes

[33mcommit b7007aee5ab348d50b087568f670e6fa3ddbe981[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 2 11:11:58 2016 +0100

    Fixed test for updateMarkers

[33mcommit e4ddc1d8e104665a8411cdd16c359bff4c6d6c1e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 2 10:43:31 2016 +0100

    fixed max-width error in groupMenu for other browsers

[33mcommit 86bbd558b19f9894d2d02075e2b07841c028f543[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 2 10:32:18 2016 +0100

    Added ng-blur to createStore Adress Lookup, so that it's run automatically when focus is lost
    CreateStore description is now multilined textBox

[33mcommit 2b6c76a1061298f9ffec1bed219ac0d5d98a1e99[m
Merge: cecb97af 545836ef
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Dec 2 10:25:10 2016 +0100

    Merge pull request #153 from yunity/geocoding
    
    Add geocoding service

[33mcommit 73126636f747172ec97ee16fb858f36319113a82[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Dec 2 10:12:43 2016 +0100

    Added ui-sref to storemap icons

[33mcommit 8f347f37c8bee401061c545621b3fad31497dff7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 1 22:15:24 2016 +0100

    Test geocoding fail

[33mcommit 1307d4f987bcbcc437351f29a201f411fbcb75a5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 1 22:09:25 2016 +0100

    Test the store map
    
    It was really tricky to test the onChanges function. I need a parent
    scope for the bindings, so a data change will hit the trigger.

[33mcommit 75a049d9763005801a4a1e35e1c425ad79158e45[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 1 18:05:58 2016 +0100

    Remove unneeded onInit

[33mcommit 1f603ab30eb42619fa170aae5ff3f1f02fd87452[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 1 18:01:57 2016 +0100

    Replace storeData change event with deep copy
    
    Change detection with $onChanges only compares references for speed.
    Triggering the update was done with an event, but this easily gets
    confusing. So I copy the array and reassign the changed one to trigger
    $onChanges (similar to Immutable.js)

[33mcommit 10c3fa28080c49583391ac00ccb10072bcebbfc9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 1 15:38:43 2016 +0100

    Mock Geocoding service

[33mcommit 0c022c9a9137534cec2a275b4e19f68019f6927e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Dec 1 14:29:26 2016 +0100

    Update node version for circleci
    
    Get the latest version, hopefully it fixes the block-scope error?

[33mcommit 63c36648920796ffb3fdbe40be3de8f196957145[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 30 18:30:59 2016 +0100

    WIP: improve address lookup when creating stores
    
    One test is skipped, needs better mocking.

[33mcommit a220db829b221e5ca3d70e753c8264dece711124[m
Merge: d1e539ab cecb97af
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 30 18:22:04 2016 +0100

    Merge branch 'master' into mapIntegration#130

[33mcommit 545836ef4bc19fe2e2932e7184020fe0e058436d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 30 18:13:05 2016 +0100

    Add geocoding service
    
    Lookup address via Nominatim
    Only use first result. Don't do error handling for now, promise seems to
    get rejected when no hit occurs (via exception).

[33mcommit d1e539ab65f87894a472d23709206594fba41925[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 30 18:13:05 2016 +0100

    Add geocoding service
    
    Lookup address via Nominatim
    Only use first result. Don't do error handling for now, promise seems to
    get rejected when no hit occurs (via exception).

[33mcommit cecb97af4ffa17bb0f9400ba1f44091556fae994[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Nov 30 14:49:47 2016 +0100

    Remove mention of first & last name

[33mcommit e846ebfa198466b6f327d06e6943b8b9dda4ee02[m
Merge: 7cf09bea 3613c801
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 29 19:04:05 2016 +0100

    Merge pull request #152 from yunity/greenkeeper/update-all
    
    Update dependencies to enable Greenkeeper 🌴

[33mcommit 3613c801a2fd2e0ecdd9b5eb849f60adffb3be74[m
Author: greenkeeper[bot] <greenkeeper[bot]@users.noreply.github.com>
Date:   Mon Nov 28 14:44:38 2016 +0000

    chore(package): update dependencies
    
    https://greenkeeper.io/

[33mcommit 40aca287c0c5bea3a9ca42239af186bbab136ba0[m
Merge: e8cbccf7 7cf09bea
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Nov 28 15:41:50 2016 +0100

    Merge branch 'master' into mapIntegration#130

[33mcommit 7cf09beadd2d5bf8f1fba6a37f3053555d3d4e2e[m
Merge: 676214a9 1fc8e5be
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Nov 28 15:40:33 2016 +0100

    Merge pull request #146 from yunity/userPage#128
    
    User page#128

[33mcommit 1fc8e5be076e6609119d60f74a73cccde5138d54[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 28 13:59:06 2016 +0100

    Add ui-sref to userList and remove unused code

[33mcommit 836334e5f2b3048514099a62c130930151775d85[m
Merge: 236d9b34 676214a9
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Nov 28 02:20:06 2016 +0100

    Merge branch 'master' into userPage#128

[33mcommit 236d9b343671f1ae620d283ee0c6a526d3686470[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 27 20:36:42 2016 +0100

    Shake loginContent
    
    Also remove the loginContainer, it doesn't seem needed.

[33mcommit 766f7c1cf13ad8295708f9edd899822bbeca84a5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 27 19:42:06 2016 +0100

    Set max-width property to max-content
    
    Ignore the "intrinsic" value for Safari, it's only mentioned in MDN, so
    I suppose it's outdated (or soon, when Safari catches up with CSSv3).

[33mcommit d8128aafcb0fc7604fc6472d1fe08950c6d493b8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 27 19:40:02 2016 +0100

    Add browserslist file
    
    Used for autoprefixer and maybe others. It uses the current default
    values from the browerslist github repo. Can be changed in future,
    depending on our target group.

[33mcommit 8a53903e0d869d4694210b675ecee90a274dafa6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 27 19:39:08 2016 +0100

    Add autoprefixer
    
    Allows us to never use browser css prefixes again in our codebase

[33mcommit fa5c971024976126546a35435c953e6e0516ea36[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 11:44:45 2016 +0100

    Small changes to layout of pickuplistItem

[33mcommit 80c3cc6225078ffc16edb8b3a40853021b068314[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 11:25:44 2016 +0100

    Simplified signup width & made it more pretty

[33mcommit 48c78ca86b549c039d692f9cf12d8c99da8b773f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 11:02:33 2016 +0100

    login now actually fits the screen size
    Also simplified width

[33mcommit 0f428649c28be2942d10931914cc8da3b101eb33[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 11:01:56 2016 +0100

    Huge improvements on mobile version of group picker

[33mcommit 36346ba77858390140984d1917203d91ecef1534[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 09:59:37 2016 +0100

    Changed all mdDialogs to width 90%, max-width 40em

[33mcommit 7311804242d213f22e5d665516c7d9eb945052a6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:49:18 2016 +0100

    CreatePickup Dialog now opens from button

[33mcommit 6e276426c2a0737649fd0f1c40c5608b308967b0[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:26:36 2016 +0100

    Added tooltip for logout button

[33mcommit 75f81576eee8efe56fa40e1df6e91cb8867639d9[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:19:04 2016 +0100

    Added tooltip for leave group button.

[33mcommit 003844172310c6c5af72db0eedbd8c4573abc0dd[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:13:29 2016 +0100

    Added margin on top of all pages (between topbar and page)

[33mcommit f6fdcb69ab5f4261a95e4dd8ebad239035627175[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:07:10 2016 +0100

    Improved layout of groupMenu

[33mcommit 66ef27b560ee40fcc22a7774ad68701c7c8d2c57[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 14:58:53 2016 +0100

    Moved language-picker to the side

[33mcommit 952c3232275e2f0060d17d7575251fb14668cf52[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 14:53:01 2016 +0100

    Added shake animation to login form

[33mcommit 24ea9e306ee2b7f30e86173d61569149dcccae8a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Nov 28 02:13:24 2016 +0100

    Add test to userDetail

[33mcommit 676214a9857e379eab863fbed4069a7f2d6fb619[m
Merge: 27d2baf8 36a9b92a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Nov 28 01:23:50 2016 +0100

    Merge pull request #148 from yunity/improvedDesign#147
    
    Design & Layout improvements

[33mcommit 36a9b92a127129ad1bbef2456e9cad5063c194b0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 27 20:36:42 2016 +0100

    Shake loginContent
    
    Also remove the loginContainer, it doesn't seem needed.

[33mcommit 21aa63616f3a6c9c2655359ccd0cd19d808b338f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 27 19:42:06 2016 +0100

    Set max-width property to max-content
    
    Ignore the "intrinsic" value for Safari, it's only mentioned in MDN, so
    I suppose it's outdated (or soon, when Safari catches up with CSSv3).

[33mcommit 509a575765310477e3dd5f4e379dc19d68fc38eb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 27 19:40:02 2016 +0100

    Add browserslist file
    
    Used for autoprefixer and maybe others. It uses the current default
    values from the browerslist github repo. Can be changed in future,
    depending on our target group.

[33mcommit 18527fcccbfeffbf4095a577f25c43dd7d855008[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 27 19:39:08 2016 +0100

    Add autoprefixer
    
    Allows us to never use browser css prefixes again in our codebase

[33mcommit 34eb93ff261c9443c73ad2aba524a72840f1be5f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 11:44:45 2016 +0100

    Small changes to layout of pickuplistItem

[33mcommit 592434d2e14eee4ef1bc8754a36fd7f6a99f13de[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 11:25:44 2016 +0100

    Simplified signup width & made it more pretty

[33mcommit 59c95e218ad0e2711ccbb8d9ad23e4dae6ef4c77[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 11:02:33 2016 +0100

    login now actually fits the screen size
    Also simplified width

[33mcommit 64184071db3fbe9d20f854299838ee379fff035f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 11:01:56 2016 +0100

    Huge improvements on mobile version of group picker

[33mcommit 3ebf4a5102bf41e55804effdd37f1ada7a40b381[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Nov 23 09:59:37 2016 +0100

    Changed all mdDialogs to width 90%, max-width 40em

[33mcommit 515468dfd16b5ddd56dd2eeeda6b7e62c8b8ceea[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:49:18 2016 +0100

    CreatePickup Dialog now opens from button

[33mcommit 9b3a2876edbb2aa14cb23ba0a28eb3ed02320113[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:26:36 2016 +0100

    Added tooltip for logout button

[33mcommit de3a778154a759ed2103917e64c9d3226fdf5587[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:19:04 2016 +0100

    Added tooltip for leave group button.

[33mcommit 25ab32758f91cfc3351987a02d811cf3f6ebb423[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:13:29 2016 +0100

    Added margin on top of all pages (between topbar and page)

[33mcommit 3d2c8098053ace745b4c2834d9f28848cd8377e9[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 15:07:10 2016 +0100

    Improved layout of groupMenu

[33mcommit 3acd04e7a9eb16505c3751377c88c002a313e8ed[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 14:58:53 2016 +0100

    Moved language-picker to the side

[33mcommit 153b0a1004c3c66f7c1065487b5dfff9c94884e7[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 14:53:01 2016 +0100

    Added shake animation to login form

[33mcommit 27d2baf8f9cf784e0afbb42cf2a2867434d14fda[m
Merge: 61c36ad0 1ec53255
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Nov 24 13:02:52 2016 +0100

    Merge pull request #150 from yunity/localeUpdates
    
    german locales for createStore

[33mcommit 1ec53255bf2693faff544ea4d9f36f437e70317d[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Nov 24 12:41:44 2016 +0100

    add german locales for CREATESTORE

[33mcommit ae172c5b2561371b5d0b36ba89ff16590c7d0889[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 13:10:37 2016 +0100

    Added Link (ui-sref) to pickuplist

[33mcommit 950852143610c1a59367d2f0107ccef359b76188[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 13:07:25 2016 +0100

    Added userDetail page

[33mcommit 61c36ad020f2fca36bad87dc590c744f7f48c3e3[m
Merge: 7808ab81 045ba5d7
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 12:41:59 2016 +0100

    Merge pull request #137 from yunity/modifyGenerator
    
    Adjust generators to follow current style

[33mcommit 045ba5d70bcc431052a30453b263f39379576c90[m
Merge: 5d896b8d 7808ab81
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Nov 22 12:37:23 2016 +0100

    Merge branch 'master' into modifyGenerator

[33mcommit 7808ab816af5e662173a24af98ec34ac2fbbdec9[m
Merge: 67dd75f4 5ac40c24
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 22:13:57 2016 +0100

    Merge pull request #136 from yunity/createGroup#126
    
    Create group page

[33mcommit 5ac40c244cce7c6e19a64127e9491fb0564a3013[m
Merge: 8438c12c 67dd75f4
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 22:07:18 2016 +0100

    Merge branch 'master' into createGroup#126

[33mcommit 8438c12c780de3b1ed5b14c6e81dde4b5b176e59[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 22:03:55 2016 +0100

    Added translation strings

[33mcommit e8cbccf7cde9e621bf1535a7e3449c143aa48d66[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 20 21:50:33 2016 +0100

    Remove unused bounding box code for nominatim

[33mcommit 67dd75f40a79afa3d0623cac4bb43071d71f07ce[m
Merge: eed94790 feffbbe5
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 21:49:21 2016 +0100

    Merge pull request #134 from yunity/joinGroup#124
    
    Join group component

[33mcommit e8dcc19cb5feeea4491d4be77e167e897b3645b4[m
Merge: 204d876c eed94790
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Nov 20 21:48:14 2016 +0100

    Merge branch 'master' into mapIntegration#130

[33mcommit feffbbe5fc38670efdcba669c06b3577dd4d2bdf[m
Merge: 09de0c60 eed94790
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 21:44:20 2016 +0100

    Merge branch 'master' into joinGroup#124

[33mcommit 204d876c69cf462faa133f78b4dd850632b79f26[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 20 21:19:14 2016 +0100

    Update webpack config for karma
    
    Should be always the same as in general webpack config

[33mcommit 09de0c60531641dbe1c9016eb2093260fae4a949[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 21:31:30 2016 +0100

    Changed allGroups to local variable

[33mcommit b0182393be9661c29a658a4556b3ab1ffd55d9aa[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 21:23:25 2016 +0100

    Removed usergroups from the list

[33mcommit 5886899e67069960443a6078dbe56c291dc74238[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 20:32:20 2016 +0100

    Changed translation bug MEMBERS -> NUM_MEMBERS

[33mcommit eed94790279e5f5a711efebaa45d40721eb5784a[m
Merge: a624919a 86955946
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 20:15:53 2016 +0100

    Merge pull request #142 from yunity/promisesAreAmazing
    
    Use returned promise to update pickupList

[33mcommit 869559462cac42b3aeb6f3e05a88f66ddf5c4302[m
Merge: f59672d9 a624919a
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 19:55:38 2016 +0100

    Merge branch 'master' into promisesAreAmazing

[33mcommit a624919aaa01f4418bc5b6a3d2eb9f39c01840f8[m
Merge: 98264829 723528ea
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 19:50:44 2016 +0100

    Merge pull request #144 from yunity/removeFirstLastName#105
    
    Remove usages of first_name and last_name

[33mcommit 723528ead885288d0de4116e6c879a728bd66669[m
Merge: 07020ce6 98264829
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Nov 20 19:46:35 2016 +0100

    Merge branch 'master' into removeFirstLastName#105

[33mcommit eb088a7fbf9f03fd6da2ce136adda449f090f825[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 20 00:20:03 2016 +0100

    Show map when creating store

[33mcommit 0dc1013135227a10e7b83e30ff34b1978c3ad5c3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 18 21:27:28 2016 +0100

    Add ui-leaflet
    
    Closes #130.

[33mcommit 98264829b2c9ce61818e99f212705fa9cf05400d[m
Merge: 9e3af5a5 85698e50
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Sat Nov 19 17:40:50 2016 +0100

    Merge pull request #141 from yunity/groupHomeButton1
    
    Add button to return to groupDetail

[33mcommit 561515ce2546d941fdc73a03c0c6505ca79971e8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Nov 19 11:29:25 2016 +0100

    Add file loader for images

[33mcommit 07020ce690c563a64297eeaa8ca913aff4fda1f7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 18 20:10:38 2016 +0100

    Remove usages of first_name and last_name
    
    They are not really needed for basic usage. Also, it seems to depend on
    the community what kind of "name" they need (just a user name, a serious
    name, the same as on the passport), so this should remodeled together
    with the potential users.
    
    Closes #105.

[33mcommit f59672d964c50ce638693ece34a50aa6c8373a8b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 21:34:41 2016 +0100

    Use promise to update pickupList
    
    Much simpler than forwarding the controller

[33mcommit d5a64849b44244b950dde35702639b781a718c68[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 21:33:09 2016 +0100

    Move dependencies to component definition

[33mcommit e1abbd34548c307c25bf8bdb7420ac5d60eabde2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 20:50:32 2016 +0100

    Simplify createPickup test
    
    Move the dependencies to the component definition

[33mcommit 85698e507c7fbf9cefa2fec9563ced4129db8a2e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 20:37:30 2016 +0100

    Add button to return to groupDetail
    
    When I click on the group name, I expect to see the group home page, not
    the group menu.

[33mcommit 5282bf818a15ec40b064f131d76ef88200404cb3[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 20:28:40 2016 +0100

    Improve multiline textarea

[33mcommit 04e7c88b2c33325be7b497dea2e66a10097c909c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 20:16:46 2016 +0100

    Add test for groupDetail

[33mcommit 4dcd5d2fd35d623148e10c1f18f0cbd83518fb4d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 20:04:30 2016 +0100

    Make storeDetail editable

[33mcommit 2de17d7bbdc75a59c560dd5d0121820f43a8338e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 19:54:53 2016 +0100

    Cleanup StoreDetail test

[33mcommit 71cd3f1bd93b52a9e1362f768b9b3165b0a19158[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 19:45:15 2016 +0100

    Make group data editable

[33mcommit 58b576831e8784f4b3a2e8fcff90f0eb08511ce5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 19:44:06 2016 +0100

    Add configuration and custom styling

[33mcommit 7e4add9f8ba537299e76ee43eb29e97e639f3283[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 14:06:21 2016 +0100

    Add angular-xeditable

[33mcommit 5d896b8d88f1ef2bd4d073a842a5936707bdeac6[m
Merge: 47f1f7f8 9e3af5a5
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Nov 17 13:07:33 2016 +0100

    Merge branch 'master' into modifyGenerator

[33mcommit f51453ab9c2225b356ccbc01b88929ed79be36f0[m
Merge: 9ec10c1b 9e3af5a5
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 13:06:15 2016 +0100

    Merge branch 'master' into createGroup#126

[33mcommit 6eaacad204308aba79c521b5dab99ce9bfc39ab2[m
Merge: 2e276ed9 9e3af5a5
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 13:02:25 2016 +0100

    Merge branch 'master' into joinGroup#124

[33mcommit 9e3af5a5e9869ec7c3022b6578eea0fa148dc024[m
Merge: c10db547 88869346
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Nov 17 12:59:50 2016 +0100

    Merge pull request #139 from yunity/rejigDeps
    
    Add missing file pages.js

[33mcommit 888693465c02b978aeb4546ea7ba0ebbc792f914[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 12:57:25 2016 +0100

    Add missing file pages.js

[33mcommit c10db54718ea4bbb7fa69111a42dadfaf52ad20f[m
Merge: 23486029 e6098f0a
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Nov 17 12:54:38 2016 +0100

    Merge pull request #132 from yunity/createStore#125
    
    Add dialog to create a store

[33mcommit e6098f0a77ad718e4ae895b53f0e6f4ce2dcc067[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 17 12:51:41 2016 +0100

    Complete test

[33mcommit 93ebc78b742781834768b95e93071b83048f9231[m
Merge: e568181d 23486029
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Nov 17 12:35:50 2016 +0100

    Merge branch 'master' into createStore#125

[33mcommit 2348602940b76440dc1fb6919827d848b8d5da43[m
Merge: 5a751d5f 25668568
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Nov 17 12:35:28 2016 +0100

    Merge pull request #138 from yunity/rejigDeps
    
    Move component deps to their immediate usage

[33mcommit 25668568485c3a2115b8eb0f2955c122d5f485b4[m
Merge: 10e17736 5a751d5f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Nov 17 12:34:45 2016 +0100

    Merge branch 'master' into rejigDeps

[33mcommit 5a751d5fe46b2d2770af1bcd9f2aa9121d65d694[m
Merge: 32fd586f 61f91ea0
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Thu Nov 17 08:47:14 2016 +0100

    Merge pull request #135 from yunity/translationIssue1611
    
    Small translation thing

[33mcommit 61f91ea071931435530ca71e8008954db12a479a[m
Merge: d2b9d642 32fd586f
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Thu Nov 17 08:35:34 2016 +0100

    Merge branch 'master' into translationIssue1611

[33mcommit 10e17736634108ac6fbce25a4e1561f683073198[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 17:49:43 2016 +0100

    Move component deps to their immediate usage
    
    Use central pages.js file only for page components (with URL). Each
    component should include their dependencies.

[33mcommit 47f1f7f8ab12694ffd0cdf8335c95d8cf6498d6d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 17:27:13 2016 +0100

    Adjust generators to my preferred style
    
    I hope you agree :)
    
    - use $injector.get() instead of underscores (_)
    - remove the tests that we don't use right now
    - ngInject is needed almost everytime
    - Object.assign is a simple shorthand to initialize the class

[33mcommit 9ec10c1bf676d4f89a669ac190276356497d4316[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 17:20:12 2016 +0100

    Add tests for create group page

[33mcommit 9cf51a40512a8edea0f316ff9ee3b8aa806e2f6c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 16:49:01 2016 +0100

    Add simple create group page

[33mcommit 2e276ed9fbad2e76a9bec73d16d9aa36f936f8a4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 14:16:45 2016 +0100

    Extend and minify tests

[33mcommit 32fd586f512124c785186f435f65ad7ac0f8c722[m
Merge: f8dc9e41 cd1e26dd
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Nov 16 13:47:26 2016 +0100

    Merge pull request #133 from yunity/updatePackagejson
    
    Update package.json

[33mcommit cd1e26dde2b53c64b097b1bde5f78d0497a1f5e3[m
Merge: 2e9ec520 f8dc9e41
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Nov 16 13:47:17 2016 +0100

    Merge branch 'master' into updatePackagejson

[33mcommit d2b9d642622c373954082cdfdb0b35900d9a0c84[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Wed Nov 16 13:10:22 2016 +0100

    members -> num_members
    
    fix

[33mcommit c6e00e384e923b9f5733a7c9f07cb85f652b05cc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 11:54:04 2016 +0100

    Add missing dependency
    
    Ok, I get it! Components are separate, need to have all their deps
    listed. Still, it looks like huge boilerplate.

[33mcommit e568181d140fc2ea7754f2e49e8609dca130b33f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 11:50:45 2016 +0100

    Add $event to have proper dialog open semantics
    
    mdDialog shows a fancy animation if you set the source event right

[33mcommit 73c94c4e785cb8d847a230cffa7e3e45ec082009[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 11:43:27 2016 +0100

    fix translation

[33mcommit 8574d0aaf44ec25040e55f847d617636d8acb484[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 11:42:05 2016 +0100

    Join group from GroupMenu

[33mcommit dc9422c5200c9b4f104ceec6cbd5dcb43771257a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 11:28:30 2016 +0100

    Add joinGroup dialog and open it from home
    
    Closes #124.

[33mcommit 834f1015e07adae9ce79d8c24a840fd17fe47a37[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 01:03:46 2016 +0100

    Add progress and error handling

[33mcommit 8b65d5d5c540820a37e1d2d8f96eb9368859e291[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 00:41:43 2016 +0100

    Fix spelling

[33mcommit a42e4fa12285ab780be5ffccad52fc037632abd5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 00:39:37 2016 +0100

    Update storeList using awesome promises
    
    ... instead of callbacks

[33mcommit bca8dc587e8e7b27bd705b84eae3b4b4714bbd11[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 00:26:51 2016 +0100

    Extend and clean storeList test

[33mcommit 6b174f18a9482b380f51e8fe76fac83a9015dab9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 16 00:02:17 2016 +0100

    Test for createStore

[33mcommit fe6d3d2bc15c8c695be540ef358ac1557c62bb0c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 15 22:39:45 2016 +0100

    Add English language strings

[33mcommit 9ed40a96a5c21b48092f1bc5f2a93104d0fd4544[m
Merge: ddcd2921 f8dc9e41
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 15 22:36:46 2016 +0100

    Merge branch 'master' into createStore#125

[33mcommit f8dc9e4132c70afab6e53e57c2b132155a3ff37d[m
Merge: 193ca302 8355184c
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 15 22:29:21 2016 +0100

    Merge pull request #121 from yunity/translateAll
    
    Make all pages translatable

[33mcommit 8355184c2c6e52ca57730013bd3c51931d47fbdb[m
Merge: 1e8d3fd5 193ca302
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 15 22:29:13 2016 +0100

    Merge branch 'master' into translateAll

[33mcommit 193ca302a7876504b67c4161aa017c630810d02c[m
Merge: f131b487 b5a59b42
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 15 22:28:51 2016 +0100

    Merge pull request #131 from yunity/noNewRootscope
    
    Remove unused new rootScope in tests

[33mcommit ddcd29219865486005157745175416fba5cd6f5f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 15 20:03:57 2016 +0100

    Made tests working
    
    Could be simplified more, will do later.

[33mcommit ccc95d855dbde67277fd5bcfabf73f1eb63b9cf5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 15 19:31:19 2016 +0100

    Add simple dialog to create a store

[33mcommit 2e9ec5209daf9173b4a246e67e5d3e12b8892b5f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 15 18:14:29 2016 +0100

    Update package.json
    
    Some descriptions were outdated

[33mcommit 1e8d3fd50b6618b52ba9ae977b5c0a9c8ef9dd3c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 15 17:45:29 2016 +0100

    Add English and German translation strings
    
    Keep them grouped to make the JSON more handily. Translation is done via
    Transifex [1]. Removed default text from templates, cause it's less
    flexible (multiple occurances of keys).
    
    [1] https://www.transifex.com/yunity-1/foodsaving-tool/

[33mcommit 07d981901ea2e84c954730efb6e2010d56b02675[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 15 16:44:53 2016 +0100

    Revert "Add webpack-angular-translate"
    
    This reverts commit 9d4801523c3d64a2a8a7a33b275a8fa9e42d8043.
    
    Reasons for removing webpack-angular-translate:
    
    - changed keys can't be added incrementally to the JSON
    - inline default values only for directives, not filters

[33mcommit c34ea3138685ff0fd444b679c9d7d795bb90c7fc[m
Merge: ba8de8bf f131b487
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 15 16:32:24 2016 +0100

    Merge branch 'master' into translateAll

[33mcommit b5a59b42ba3f47a51c393da452c071c970adedeb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Nov 15 14:29:21 2016 +0100

    Remove unused new rootScope in tests
    
    According to docs, the default behaviour creates an isolated scope. If
    we want to use the scope in the tests, we should define it as local var.
    https://puigcerber.com/2016/02/07/how-to-test-angular-1-5-components/

[33mcommit f131b4879aeb7b89922f49016d71f15088c5928c[m
Merge: 85bf41e5 ca6ce154
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 15 13:52:50 2016 +0100

    Merge pull request #129 from yunity/pickupList-displayName#120
    
    Rework PickupList

[33mcommit ca6ce1547525f5a8fbefc104f3faf414554dde32[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 13 18:03:17 2016 +0100

    Slightly minified test case
    
    I suggest to only insert the data into the testcase which are absolutely
    necessary. Also, removed the duplicate data, cause that makes it easier
    to modify the test in future.
    Could be tightened more, in my opinion. But I don't know the best way
    right now.

[33mcommit 5d4b6e14a453cdafcac6967e7ac04148b8dde2d5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Nov 13 17:54:01 2016 +0100

    Move init into one beforeEach block
    
    seems less clutter to me

[33mcommit 662276466e434d6df4383316ca7617b0a8122858[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Nov 5 20:01:14 2016 +0100

    Simplify PickupListItem controller
    
    Move conditionals to the template
    Use ui-sref to get proper URLs

[33mcommit 6d2706ff1c1a8e46358d3effba2139034969a9aa[m
Merge: cbf31ad1 85bf41e5
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Nov 5 15:50:10 2016 +0100

    Merge branch 'master' into pickupList-displayName#120

[33mcommit ba8de8bf135134836ebd0f32be82c7e854c3104c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Nov 5 15:39:38 2016 +0100

    Close span tags properly

[33mcommit 8be7bec4af0b1ac5e7e64faf418229eb9bb0cb0b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Nov 5 15:16:38 2016 +0100

    Use span element instead of any
    
    span is standard and fulfills the same purpose

[33mcommit 9d4801523c3d64a2a8a7a33b275a8fa9e42d8043[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 4 17:17:16 2016 +0100

    Add webpack-angular-translate
    
    Run `ǹpm run build` to export the language strings to
    `dist/locale_defaults.json`. This file should be used for translation.
    Text in filters doesn't have a default, so this is a problem right now.

[33mcommit 46fb0fbc7f9bbfc92e91355bd49f5d51c8d081f5[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 4 17:15:56 2016 +0100

    Fix translate-default attribute

[33mcommit f38c0fe50e01fcb0d93efe3d03a9178761f8ce5e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 4 17:12:09 2016 +0100

    Use 'any' element instead of 'translate'
    
    For standalone translations, use the otherwise unused 'any' tag, since
    the extract tool does not support the 'translate' element.
    https://github.com/DatenMetzgerX/webpack-angular-translate/issues/19

[33mcommit d3cabb722a53d1315ec76a75fd68996b04af6cfb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Nov 4 14:45:51 2016 +0100

    Don't use translate-namespace
    
    The extract tool doesn't support it:
    https://github.com/DatenMetzgerX/webpack-angular-translate/issues/18

[33mcommit 8e8bf2c53406a8c0ddc18f52d8ee2b59bd9f8093[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 3 19:51:21 2016 +0100

    Convert some attributes to tags
    
    Easier translation with directives instead of filters

[33mcommit 231dc71b241977a3695f18d998d833451c85b99b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Nov 3 18:43:07 2016 +0100

    Move all translations to namespaces
    
    Except for GroupDetail, cause filters do not respect the namespace

[33mcommit fbc7510ffe3e0b377080ca55a1fef15d25ea57aa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 20:47:31 2016 +0100

    Save chosen language in cookie

[33mcommit 9f5d2a608c3ce77017b593b14c785314d19d9776[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 20:11:47 2016 +0100

    Add partial German translation

[33mcommit 261a2b84309a49079dd42ede4ad89041b8922f98[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 20:10:56 2016 +0100

    Make groupMenu translatable

[33mcommit b420c669fe37cf8fbba1d3ab1492779d442f3eca[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 20:10:29 2016 +0100

    Make createPickup translatable

[33mcommit 8f137940d312596ec7350458af84d38cc19174d6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 19:58:05 2016 +0100

    Make pickupList translatable

[33mcommit 9e9ef739e49d3a4cdd8b523987a5050fc27066f1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 19:34:56 2016 +0100

    Make groupDetail.html translatable
    
    Default text is not supported in attributes.
    I didn't get "translate-attr" to work for the tabs, therefore using
    filters

[33mcommit 9d4fdabba8d217f8a8b9d8cc620d29fd0fce5110[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 19:34:07 2016 +0100

    Make home.html translatable

[33mcommit 59e6ce5605a9534a46781601da098b0793b46cd9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 19:33:40 2016 +0100

    Update index.html
    
    No translation, would need service

[33mcommit cdbb13bf3dae02d7a0700efcc9231b824f1d848d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 17:24:24 2016 +0100

    Make signup translatable

[33mcommit 7452ddd2bc1f1e759175f5bc325f4c11f5679022[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 17:08:43 2016 +0100

    Add default messages to login template
    
    Also use directive style only, use IDs in attributes

[33mcommit 85bf41e5dcc4c2ec7f6a02008978d655ebdcb921[m
Merge: b42901c3 2da85724
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Nov 3 16:43:17 2016 +0100

    Merge pull request #122 from yunity/ctrlInGenerator
    
    Use $ctrl in test generator

[33mcommit cbf31ad1e53524ad27cc91496377520e9934e675[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Nov 3 14:59:53 2016 +0100

    Solved filter bug
    Renamed methods

[33mcommit a291479a3b706058cde7c50e7f915064d1af6880[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Nov 3 14:47:02 2016 +0100

    Hide sticky headers when showDetail == date or default

[33mcommit b8f13995ef78f5ce8f768434f215b3a48be17b14[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Nov 3 14:39:43 2016 +0100

    Added possibility hide topbar

[33mcommit 460bb86dd07ea9f1d85bd41359cb4b78041b70ac[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Nov 3 14:30:09 2016 +0100

    Added possibility to set filter option
    Added cleaner default options

[33mcommit 20d187c80a7862852704d24e6a30a85d9fb26b73[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Nov 3 01:38:20 2016 +0100

    Remove headline of pickuplist on groupDetail

[33mcommit 7e02c7801acc71bcf8da2f47e3d866875b2cf543[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Nov 3 01:37:57 2016 +0100

    Show display_name instead of images in pickuplist

[33mcommit 2da85724d309f735a2b05133b4a190f79c6263d7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Nov 2 20:52:50 2016 +0100

    Use $ctrl in test generator
    
    Closes #117

[33mcommit b42901c36e2f0b8f5b7a137b569af2a5d08c77fd[m
Merge: eef9c0ad 397086a0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Nov 2 13:51:55 2016 +0100

    Merge pull request #116 from yunity/update-readme
    
    Add link to open chatroom

[33mcommit 397086a0361220e1279cf7ea9bf9e70b051463d7[m
Merge: bffedb66 eef9c0ad
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 1 22:09:04 2016 +0100

    Merge branch 'master' into update-readme

[33mcommit eef9c0ad549b7ca547640eb9c03f5c86fe127e3e[m
Merge: d459aba7 6a521ef1
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Nov 1 21:56:37 2016 +0100

    Merge pull request #112 from yunity/translation#90
    
    Integrate translation support

[33mcommit 6a521ef17de884a5e2c02af1f6e8993d3ea7a456[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 30 20:33:27 2016 +0100

    Call $translate.use() from template
    
    Gets rid of activeLang. Guess that's ok.

[33mcommit dfd346ca67b7c199c850991ea427a18f8fd2bb97[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 30 20:26:02 2016 +0100

    Use $ctrl in tests

[33mcommit bffedb660bc40fc1ad41f0001e88e1d9811e77cb[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Oct 29 23:56:40 2016 +0200

    Add link to open chatroom

[33mcommit 4b86e0f567578a67bf7dffbb61ab5f8aff2dafe0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 28 22:44:24 2016 +0200

    Set fallback language and alternative keys

[33mcommit 3ea70f382cffed111e0e4e605e531fbb0276e631[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 28 22:38:32 2016 +0200

    Move langchooser to splash layout

[33mcommit cc1156d6ad751c266a034b8bcacb7eec797d6bf7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 28 22:37:02 2016 +0200

    List available languages in chooser
    
    Currently hardcoded, cause $translate.getAvailableLanguageKeys() always
    returns null...

[33mcommit 0ed5dab93563f7317ea7852b6286e66b5b62fbfd[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 28 20:49:48 2016 +0200

    Better icon for chooser

[33mcommit e4efc19b007528b329503605e1feadb1787dee41[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 28 20:36:07 2016 +0200

    Beautify language chooser

[33mcommit ead9828aee661e9542d2e68efb2729e6dd01c64c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 27 21:50:37 2016 +0200

    Add a nice litte test

[33mcommit ec099cca22b16779579e8bc2466fcdd30bac6304[m
Merge: 732b6c0c d459aba7
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 27 19:46:01 2016 +0200

    Merge branch 'master' into translation#90

[33mcommit d459aba7ba0ed3d651417b27c44b1a151339ec33[m
Merge: 2dfeaedb e1b583e9
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Oct 27 19:24:06 2016 +0200

    Merge pull request #115 from yunity/improvedTemplateStructure
    
    Rejig template structure, add CurrentGroup service

[33mcommit e1b583e99f15cac3c68c93dc700b32b5ac6a88b5[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 17:52:12 2016 +0100

    Remove unused var

[33mcommit aa23bee0935ffb461759350c996e7a65fdf3a3a2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 17:51:20 2016 +0100

    Clear current group if you leave it

[33mcommit 8a87609db1a09275046ccdb8fc17445e208f8f63[m
Merge: cea3656f 2dfeaedb
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 15:49:18 2016 +0100

    Merge branch 'master' into improvedTemplateStructure

[33mcommit cea3656fd63bbba7060c73749aad4f287bb67bbe[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 15:14:56 2016 +0100

    Removed unused $resolve var

[33mcommit 38420056a39910343b75b60abddee02795e329e6[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 15:11:03 2016 +0100

    Add StoreDetail route test, specify module deps

[33mcommit 92b45bbd2123662e86add80dc21cae024d0c3ddb[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 13:42:30 2016 +0100

    Add splash abstract route into login test
    
    If using `parent` on a route/state definition but the parent is
    not defined, it will silently fail. The login module is used here
    but the "splash" route/state is defined in the app module, so we
    need to define it here in the test too.

[33mcommit 922478bcc1b62054e7be0124d5b7c501b5bd0d3a[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 13:14:14 2016 +0100

    Load the group when we load the store page

[33mcommit e490aa0b34eb46ee01b73eddc9f9781eb4eb5f4c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 13:06:44 2016 +0100

    Move main page panel into layout

[33mcommit dc703e10a86b85d529542158be8f64b04ad703dd[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 12:41:44 2016 +0100

    Add splash layout for login/signup pages

[33mcommit b95f875e40c865776aeebe06802612bfaf126a55[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 12:18:53 2016 +0100

    Remove unneeded check
    
    Not sure if it is needed actually. Will add it back if it is.

[33mcommit d2576be48d23c6ee92d974ba31dfcf90e18ebe2e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 12:18:39 2016 +0100

    Removed unused CurrentGroup.get()

[33mcommit f351509436ef66dcb48897bb20bcccaaed3e018e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 12:05:52 2016 +0100

    Add CurrentGroup service test like a good boy

[33mcommit 39d4dc2b33e2ad20df122f6c6ef0d5058a7e9f8d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 11:54:42 2016 +0100

    Make signup form look like login form

[33mcommit b63fd3084754d95f13fabc99cf14a046e18e2c2b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 11:51:08 2016 +0100

    Add back app.styl, apply app class to <body>
    
    Makes the login page have full yunity orange colour now as I
    removed the translucency from the login page (as it wasn't full
    page)

[33mcommit 569c20030a7dbec5685d040a610b7cab5d95f675[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 27 11:36:57 2016 +0100

    Rejig template structure, add CurrentGroup service
    
    Added concept of layouts. In the route/state config you can now
    set:
    
    ```
    parent: "main"
    ```
    
    And it will automatically get the topbar component added, and
    put the main content in a 70% width container so it's not too wide.
    
    This required decoupling the topbar from the page components by
    adding CurrentGroup service that holds the data of the currently
    selected group instead of passing in the group data via the template.

[33mcommit 2dfeaedbaafd794189e745104f009ccebce613d1[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Thu Oct 27 14:45:24 2016 +0200

    createPickup: handled maxCollectors below 1 error in the html
    
    it was possible to enter values below 1 by using the input field.

[33mcommit 049ea334a869adf041f4a814f1c772fdd9d56f00[m
Merge: 678612f9 9154f1e2
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Thu Oct 27 14:16:54 2016 +0200

    Merge pull request #113 from yunity/joinGroup
    
    dirty "join your first group" page

[33mcommit 9154f1e2f031b0d37d6566f7825f71167c08f1f0[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Thu Oct 27 03:19:33 2016 +0200

    added tests to group service

[33mcommit 3bb8d92aeb35179e0d88a12accecf5402ce620dc[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Thu Oct 27 03:15:39 2016 +0200

    added 'leave group' button

[33mcommit d4cc3c56dae7bf6befa7dd2fa5f42115eae0dcb6[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Thu Oct 27 01:58:55 2016 +0200

    dirty join-first-group-page

[33mcommit 678612f906dccafb708d844379b804353bd2bb51[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 27 01:56:20 2016 +0200

    Revert "Show collector names on pickupListItem"
    
    This reverts commit e7be4444aaeaf809dba07d8af4a8be22751c4573.

[33mcommit e7be4444aaeaf809dba07d8af4a8be22751c4573[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 27 01:49:21 2016 +0200

    Show collector names on pickupListItem
    
    Do a query for each pickup, style is very dirty, hits the server a
    thousand times. BUT it shows something!

[33mcommit 732b6c0c1706a3881ac0c941559fda0ad9192833[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 27 00:46:54 2016 +0200

    Add the possibly ugliest language chooser possible
    
    Well.. but you can click on it! *wink*

[33mcommit eb84d0ef1e1cc783205942f63a65d38ed53ef77a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 27 00:07:01 2016 +0200

    Add translation examples for login page
    
    Use directive "translate" whereever possible for speed [1], but fallback to translate filter (with "{{" things) is sometimes ok. E.g. md-button replaces the
    element, this prevents angular-translate from working correctly. Can add
    a <span> around the text, but the filter seems easier.
    
    [1]
    https://angular-translate.github.io/docs/#/guide/05_using-translate-directive

[33mcommit e032266d8965b0b428711e9aa96e63ba76b686f4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 27 00:05:01 2016 +0200

    Add angular-translate and json-loader
    
    Load json files individually from ./locales/ for each language for now.

[33mcommit cba9e261a887ad6c845858be54b185386b6072b8[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Wed Oct 26 23:24:37 2016 +0200

    handled case when user has no groups
    
    Prevented homescreen from showing an endless loading screen.
    It shows a default message instead.

[33mcommit 481bb45d2f7576931bf044449d2679e57f25a133[m
Merge: 1d8b7b80 3dad4e7f
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Oct 26 21:00:37 2016 +0200

    Merge pull request #96 from yunity/createPickups#87
    
    CreatePickup component

[33mcommit 1d8b7b805af65fbc812e7645d7ad80b5eb0520fd[m
Merge: 00a86720 3b4a8d19
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Oct 26 18:35:27 2016 +0200

    Merge pull request #102 from yunity/redirectGroup#100
    
    Redirect user to first group

[33mcommit 3dad4e7f725a081f41093ee2caeb7dc51879c4fc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 26 18:22:58 2016 +0200

    Require a time on the clock
    
    It would also accept durations (25:00), but that's not expected by the
    user

[33mcommit 00a86720f349cd64d032f3018685f6932b83bc0f[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Wed Oct 26 18:18:24 2016 +0200

    fixed #106

[33mcommit 9d5bd5cac9eba7a75c9e468ef9b74043e060ed46[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 26 18:03:14 2016 +0200

    Shift validation to template

[33mcommit a004ee43fce3e909754bd7264bdf4da5fa535178[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 26 16:57:31 2016 +0200

    Only show create button when form is without error
    
    This looks really cool!

[33mcommit eccc3c78be83f9500ad84b0ee1806cf2c87b58a4[m
Merge: 668c3af2 cd04f5c0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Oct 26 16:28:40 2016 +0200

    Merge pull request #84 from yunity/groupMenu
    
    integrated group menu into topbar

[33mcommit 668c3af22fbb3d6ea2e2796f573201bb0809bea6[m
Merge: 1cf161b3 c8ed6061
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Oct 26 16:28:16 2016 +0200

    Merge pull request #98 from yunity/errorHandling#91
    
    Login form error handling

[33mcommit 1cf161b31493bae602f383841ea0a31421a48efc[m
Merge: ec47c3aa 745c6581
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Oct 26 16:27:59 2016 +0200

    Merge pull request #101 from yunity/signupRework
    
    Signup rework

[33mcommit 745c65819c16bd03d0b947683e498e3cf5178ca8[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 25 17:00:54 2016 +0200

    added 'email exists' error handling

[33mcommit ec47c3aabe5654c0d32925e02d75f2ed2f0e5a62[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 25 16:12:26 2016 +0200

    fix: outdated usage of Store.get()

[33mcommit 08445fdcc063b336c893ec01f2d8b0cf1cb77a07[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 25 15:54:25 2016 +0200

    added error message

[33mcommit 3b4a8d1979603556b981e9622b476daa69f5c9e1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 04:07:57 2016 +0200

    Add redirection test
    
    Closes #5

[33mcommit 30006ab75538859721e07863b5f42877e22fdf4d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 03:46:08 2016 +0200

    Redirect user to the first group
    
    Currently the home page is empty, so the group page is the home page.
    Closes #100

[33mcommit cd04f5c0d43d5327ae9799fa3a86fdfeb4785ee0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 03:23:26 2016 +0200

    Hide active group in menu

[33mcommit 6b86ffd04a9df9d3bd4e3bd730eae2938c667ee9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 03:18:13 2016 +0200

    Show current group in topbar

[33mcommit 9dd95fe816f2102d12a8d93e13e1b4a180693538[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 02:51:43 2016 +0200

    Match group menu in CSS
    
    Click on the button opens the menu, but it's not child of group-menu.
    Workaround: use verbose css class

[33mcommit 6c0595d0a8c3c78ee85206bf4ffb197aea8c0d0e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 02:51:27 2016 +0200

    Use uirouter sref links

[33mcommit 8cd278487b370f7fe545973f0c8c93311077ef0e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 02:20:39 2016 +0200

    Add dynamic group loading

[33mcommit c8b0003c6e28305ae384e7e8abede32d49d5147c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 02:08:53 2016 +0200

    Add method to list groups of curent user
    
    Should reduce some amount of coding in components. Components don't need
    to know about the user id anymore.

[33mcommit 93d60dda82960af0f653beb3012f5eb86d0dfbe2[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 02:01:30 2016 +0200

    Add auth data cache in service

[33mcommit 668860f21b8356c769e5d6cbec934724a423bd72[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 01:15:00 2016 +0200

    Remove non-existing components from topbar

[33mcommit 6197ef0b74737c43166a805e6640bc2308d7d728[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 01:12:55 2016 +0200

    Move groupMenu template to component

[33mcommit 1d2c23194f7282571d81375b776bd692a4d4550a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 00:13:05 2016 +0200

    Add new groupMenu component skeleton

[33mcommit 2ad38a975acdba145d4581ce840e8bc57f650222[m
Merge: 393fccf5 fc0452a5
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 25 00:09:50 2016 +0200

    Merge branch 'master' into groupMenu

[33mcommit 2a6c436aef8c0e3dc1071d2feb5357c432867714[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 24 22:25:58 2016 +0200

    Remove username length check

[33mcommit 0d62ef45cefd90db2d8199db539da17c699f011b[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 24 22:25:37 2016 +0200

    Rework design

[33mcommit 59c1f62c8cca488998f76533c4553b807e015eff[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 24 22:19:16 2016 +0200

    Remove password checks
    
    Repeat is not necessary, a password reset should be added soon
    Password length checks are snake oil, could add a complexity check in
    future

[33mcommit 6a9f282d84ee0698df92a1ec80b68e107249f875[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 24 22:15:31 2016 +0200

    Improve todo

[33mcommit 6b109b5bc0f08e66c1bb5c872ac2b70add448523[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 24 22:13:45 2016 +0200

    Add more tests

[33mcommit 59b33d6dceade4be6ae18cfc0a7f6c357a1de298[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 24 21:42:06 2016 +0200

    Rework signup controller

[33mcommit 92be51e30c7d1568e92f5d9828a86d234092c581[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 24 20:06:07 2016 +0200

    Default max slots and design rework
    
    Set max slots to 2, which is a usual value from foodsharing.de
    Use a slider as easy main input method
    Change description to be shorter

[33mcommit 2de0dd3582890ba40b4891d6320d8a6969dafbe6[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 24 13:24:39 2016 +0200

    Use toISOString for testing
    
    Makes it simpler in my eyes. Factor out the assembleDate method (not
    sure about the style of having methods with _only_ side effects, but we
    are not in Haskell here..)

[33mcommit a8e79568d75d2604b2142c17e5225787469b62c5[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 24 01:41:13 2016 +0200

    Fixed local time error in test

[33mcommit 2422e1c480b9909dcefb93299e63a1f5772c43f2[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 24 01:26:03 2016 +0200

    Fixed lint errors

[33mcommit a357fa2c77c7bc7a1bf0bd3ffd5e26f113152a46[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 24 01:22:29 2016 +0200

    Added Pickup-Creation test

[33mcommit 8313ac9515dbfe6c8c1412071d74e6d1d5f82651[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 24 00:58:34 2016 +0200

    Fixed snake_case lint error by disabling the line

[33mcommit 4582ea22bf5a8ce4b3df8c6219183fcbb18d5e8c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 24 00:23:06 2016 +0200

    Fixed lint errors
    Pickuplist updates after pickup is created

[33mcommit 49828e82e4872ba64c406bc99838d6a290ee6188[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 24 00:07:55 2016 +0200

    Fixed Tests
    Pickup creation is now working

[33mcommit 6768c017ae1ab8e9a77991eee691bbe3a3807ff4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 23 23:33:13 2016 +0200

    Made dialog work
    Added createPickup button in storeDetail
    Added createPickup to components

[33mcommit fc0452a5e6a85b6689157f2b1a013beea7190a3c[m
Merge: 2caccf72 367c9460
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Oct 23 17:01:06 2016 +0200

    Merge pull request #97 from yunity/rewriteServices#92
    
    Rewrite services

[33mcommit c8ed606157ec176c5098c8a2a681b665f51ad415[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 23 16:08:08 2016 +0200

    Make error handling work
    
    Actually, it should have worked before. But now it's clean.

[33mcommit 8daaeb7d801d67c6bdb0a24d8309e31f227dbd9a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 23 12:23:05 2016 +0200

    WIP: add some error handling via controller
    
    This does not use the magic $error object from ng-model, so it's
    clearer.
    However, it does not work yet #@*!

[33mcommit 367c946083f9dcbeef04d7d9cbb68eb7ce280956[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 22 21:32:55 2016 +0200

    Add more service tests

[33mcommit 048fb7c7551a4e0f71b73bc4c8c84ddad5e48715[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 22 21:19:24 2016 +0200

    Remove Service suffix
    
    Changed my mind, just adding it locally is a half-hearted solution. Will
    leave it like it is and maybe we put a suffix "Service" after all
    service to make them distinct.

[33mcommit 849e0fed97c0d4b052d985654576803cc48ec54d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 22 20:47:43 2016 +0200

    Rework user service

[33mcommit 1454fb773490124d67d2feba1d406612d255f670[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 22 20:34:53 2016 +0200

    Refactor store and pickupDate service

[33mcommit 39f25fc807d41800e238f13c9e83d212043c8649[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 22 19:54:43 2016 +0200

    Refactor group service

[33mcommit 9170eb3bda4bfde1ae23868b63a408710308708a[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Sat Oct 22 14:17:02 2016 +0200

    created createPickup component
    
    html code from mvp-design

[33mcommit 2caccf72f78ce208b78d0134be9afca3d5516a73[m
Merge: c9d4a5a0 c016b1f2
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Sat Oct 22 13:46:08 2016 +0200

    Merge pull request #95 from yunity/formatting
    
    unified formatting

[33mcommit c9d4a5a0833f24456d5b7e2094b269783ed74565[m
Merge: 03eec21a a7ea3402
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Sat Oct 22 13:43:27 2016 +0200

    Merge pull request #82 from yunity/updateContributeMD#75
    
    closes #94
    closes #75

[33mcommit 03eec21a68ba35424dab7b3c4d344ca09b0b9d1f[m
Merge: ed485401 ff708231
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Sat Oct 22 13:41:32 2016 +0200

    Merge pull request #88 from yunity/storeDetail#68
    
    closes #68

[33mcommit ff7082313160206f32249fad58015df68d8cd337[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Sat Oct 22 13:09:52 2016 +0200

    changed formatting

[33mcommit c016b1f23c8091ef894a58656ce296fdcde899e4[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Sat Oct 22 12:33:32 2016 +0200

    unified formatting
    
    -no more use of window.module in .spec files (angular.mock.module instead)
    -unified identation in .html and .styl files (2 spaces indentation, see .editorconfig)
    -more stuff to adapt to .editorconfig

[33mcommit a7ea3402efc3851785d8bd2340ac30d2d1a21bea[m
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Sat Oct 22 00:45:15 2016 +0200

    style-related changes

[33mcommit c43d91412f4346450259f87a5327ce2f522ba674[m
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Sat Oct 22 00:37:51 2016 +0200

    changed routes description

[33mcommit de808efc801e65e55868eb3a66b494002ec7b290[m
Merge: 3a0d74e0 ed485401
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Oct 21 23:28:19 2016 +0200

    Merge branch 'master' into storeDetail#68

[33mcommit 3a0d74e03eb0526c0c46bfb5191ebec5db302e0a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Oct 21 12:41:12 2016 +0200

    Added Store Page

[33mcommit 393fccf58c12cdc278221b163633d25937b7e554[m
Merge: 535e4de7 ed485401
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 21 22:17:46 2016 +0200

    Merge branch 'master' into groupMenu
    
    Remove the static group list as well.

[33mcommit ed485401a59d1e77743fc89dd26822190cc9b877[m
Merge: 9d591242 9db791b9
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Fri Oct 21 21:44:58 2016 +0200

    Merge pull request #79 from yunity/groupIntegration
    
    Group integration
    
    Ignoring codecov

[33mcommit 535e4de72f1e5a19fd26e1416b5cee1e7e0e4c6a[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Thu Oct 20 22:51:14 2016 +0200

    integrated group menu into topbar

[33mcommit bc1560bdb38901d82ed942a31244018af53c4971[m
Author: Andreas Langecker <a.langecker@posteo.de>
Date:   Fri Oct 21 15:33:08 2016 +0200

    changed colors & logo

[33mcommit 9f7fedf639ce9968f733bfd16dcf45fddc59620a[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Wed Oct 19 22:08:43 2016 +0200

    updated gulp generator usage
    
    fixed description and gulpfile

[33mcommit 9db791b98d88ef00e2df22bc17343ade9e6b82e7[m
Merge: 6ec9bc82 9d591242
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 19 21:33:15 2016 +0200

    Merge remote-tracking branch 'origin/master' into groupIntegration

[33mcommit 9d5912427cd0bd53d80adbc84327f6cebde82ee8[m
Merge: b879740a c40ac528
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Wed Oct 19 21:16:59 2016 +0200

    Merge pull request #80 from yunity/no-trailing-spaces
    
    Enforce no trailing spaces also on blank lines

[33mcommit 6ec9bc828b29f2c3efc5aa2ca4779b1275f9e9d0[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 19 19:19:08 2016 +0200

    use additional storePromise field
    
    avoid overwriting store field

[33mcommit c40ac528b031b17a3bd2ba81f76e7a3cd991244f[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 19 19:00:52 2016 +0200

    Enforce no trailing spaces also on blank lines
    
    Differences between editors resulted in ugly diffs, which are annoying
    if you want to see the actual changes.

[33mcommit de9f57689920678e4d60c0cdde407e9daa0c7a6c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 19 18:58:59 2016 +0200

    Remove trailing whitespace on blank lines

[33mcommit 899d55050c50777018716c59eb732f951aff30f1[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Wed Oct 19 14:53:18 2016 +0200

    fix broken test

[33mcommit efc2fb2a196ce469a83332e333a86dc40970da66[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 19 14:29:52 2016 +0200

    check for outstanding requests & expectations
    
    also move flushes to afterEach, I guess that's ok to have less repeating
    code

[33mcommit 8b9da48924ded0fc61d9db5449cbdc38f8bb4eb6[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Wed Oct 19 13:57:33 2016 +0200

    fixed meaningless code
    
    when requires a httpMethod -> whenGET
    my editor removed some whitespaces...

[33mcommit ab20a2d76c8d69c05c0dde09e2096f7e2b4c6e7c[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Oct 19 10:44:08 2016 +0200

    Fixed lint error

[33mcommit 07bb384390646ec55713255ba0692237059a0aa4[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Oct 19 10:37:15 2016 +0200

    Added join/leave test for pickupListItem

[33mcommit 798ba6ec11905a8744d571ce278f50134bf8393b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Oct 19 10:19:46 2016 +0200

    Made pickupList tests prettier

[33mcommit f8c77b2ac78fe57671d6e4e9c0638ddaa11c0964[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Oct 19 10:11:42 2016 +0200

    Removed / Changed some comments

[33mcommit 0e65d5e41238c5c88e167e241215ff7e83bbd6bb[m
Merge: 27721929 b879740a
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 19 01:28:02 2016 +0200

    Merge branch 'master' into groupIntegration

[33mcommit 27721929260e3854124bc9f24a4fe84537de26c1[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 23:55:30 2016 +0200

    Removed all unnecessary Restrict "E"
    Changed 'Restrict "E"' on pages to 'Restrict ""'

[33mcommit a3f94d19b41a70c489f8e47556675769b2178e35[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 23:51:00 2016 +0200

    Changed Spec module injectors from strings to path

[33mcommit 62b84921408955fd54ebf4fec12d0f12e6c7d10f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 23:46:32 2016 +0200

    Added authentication huck

[33mcommit 137967fed5508817cf75c97caddf833ac8de6028[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 23:38:42 2016 +0200

    PickupListItem Component is now defined in pickupList

[33mcommit f438358b7eab5b94118741ce489e961a5c6864e6[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 23:33:59 2016 +0200

    Fixed style errors

[33mcommit 155ff1233fd07813d7589d2f910fe0fca8a5fa40[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 13:56:29 2016 +0200

    Added user and store list to groupDetail
    Added buttons on home page to open groupDetail pages

[33mcommit b879740a06960fc9fdba4c13d0e9e5254247a941[m
Merge: c481bdc6 4d4339ee
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Tue Oct 18 13:17:59 2016 +0200

    Merge pull request #78 from yunity/generator-naming-convention
    
    change naming convention

[33mcommit c481bdc629b76079ad51649c6f717412bfe4e38b[m
Merge: ebaf3d88 a608bdeb
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Oct 18 12:48:43 2016 +0200

    Merge pull request #72 from yunity/loginForm#71
    
    Rework login component

[33mcommit a608bdeb23191e6b19b4732883e6c3f778927093[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 18 12:14:12 2016 +0200

    added small testing stuff

[33mcommit 42c5fb122578fd4756ba1562314f9761425ecbf0[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 12:11:02 2016 +0200

    Renamed groups to groupDetail

[33mcommit a473370eb5d3dbbf6af7854ae90e397177dbdb22[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 11:54:50 2016 +0200

    Merge branch 'PickupList#34' into groupIntegration
    
    # Conflicts:
    #       client/app/components/components.js

[33mcommit 01b04a9aa1e24b7289537a83d6e4ef00918b87cd[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 18 11:49:00 2016 +0200

    using sinon.stub and expect

[33mcommit 5d12f8ccd15ba964999bec4ce31a472c671247b5[m
Merge: 9de1ef9f 98471871
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 11:38:58 2016 +0200

    Merge branch 'PickupList#34' into groupIntegration
    
    # Conflicts:
    #       client/app/components/components.js

[33mcommit 9de1ef9f20c7debb2fa3681682fec02e346cabc6[m
Merge: 2857cbc1 3358b1e9
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 11:38:04 2016 +0200

    Merge branch 'storeList#65' into groupIntegration
    
    # Conflicts:
    #       client/app/components/components.js

[33mcommit 2857cbc17792cea29b6cdc655750c167431796b3[m
Merge: 75888846 bdd8511f
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 11:36:50 2016 +0200

    Merge branch 'userList#66' into groupIntegration

[33mcommit 75888846bdf305881d4f797c94c7ca8fac81eadb[m
Merge: ebaf3d88 d7a428d8
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Tue Oct 18 11:36:44 2016 +0200

    Merge branch 'groupContainer#20' into groupIntegration
    
    # Conflicts:
    #       client/app/common/common.js
    #       client/app/components/components.js

[33mcommit 4d4339ee908cd4b678a6a323e7997ace179594a6[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Mon Oct 17 22:58:34 2016 +0200

    fixed page test, added empty restrict

[33mcommit 3bad2b4c797054c0857fcfb503e9b97838e7c2a3[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Mon Oct 17 22:42:14 2016 +0200

    added page to gulp

[33mcommit 1a132f49898860a1201ea06a19a706ea5b140c16[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Mon Oct 17 22:23:35 2016 +0200

    added config section

[33mcommit d82628e817c82960dc39f930af53dd2e964ed73a[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Mon Oct 17 22:22:46 2016 +0200

    added page generator

[33mcommit f6045c9b61af5fa8afa18bdde801a8a0407a7b32[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Mon Oct 17 21:48:56 2016 +0200

    changed naming convention

[33mcommit 4b532a73af63cf6114d9f91faa42b89b0e324382[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 17 21:23:06 2016 +0200

    Remove explicit controllerAs syntax

[33mcommit ebaf3d883f362f6ade32e8764bdce62769a1d511[m
Merge: fa9afb6c d995a8b5
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Mon Oct 17 21:14:30 2016 +0200

    Merge pull request #73 from yunity/componentGenerator
    
    Update component generator

[33mcommit fa9afb6c0ca4b3ae811cfdf584e1dd9e77d96595[m
Merge: 09f9d837 73dce051
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Mon Oct 17 21:14:13 2016 +0200

    Merge pull request #74 from yunity/serviceGenerator
    
    Update service generator

[33mcommit 73dce051bc332fb4f0c46f6d33d7bd62ec42ef26[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 22:29:01 2016 +0200

    Test skeleton

[33mcommit 728a211695cae3712d990ca7746a87b05aea3e12[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 22:08:45 2016 +0200

    Convert to double ticks

[33mcommit d995a8b59b68008cb832b50c75f1dcf2fa0f5b12[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 21:51:11 2016 +0200

    fix fuckup

[33mcommit c78534766420cbef2bc30ca0650ba054696d62f8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 21:49:34 2016 +0200

    remove name property from controller

[33mcommit d695693c2b75e90e64e9d533cfadd443d11b5b3a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 21:39:25 2016 +0200

    Remove explicit restrict statement

[33mcommit 8993f90876cf4a1279522ea1785212eeb5b5e715[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 21:38:09 2016 +0200

    Test module name

[33mcommit 88861458c94ca903aa22bb9f9f6909485f38eec7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 21:34:30 2016 +0200

    Use double tics

[33mcommit f3c7503e7c6e98b4acd760dbe258955b50ef2f86[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 21:32:09 2016 +0200

    Use componentController to load controller

[33mcommit 90b9c8684a8fe2e26c96617b27fbbe98131c4ab1[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 21:06:56 2016 +0200

    Remove call to window

[33mcommit 8a251c88e6c9280f49cdf8e26d3bcae981c3b363[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 18:22:26 2016 +0200

    Maybe just add sinon as global?

[33mcommit 7d4618deb854ec87d4442dcd57957f20344bfc69[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 16:59:28 2016 +0200

    Use karma-chai-plugins again
    
    Since circleci does not really like my previous change, I tried harder
    and got sinon working with karma-chai-plugins.
    Advantage: no need to import sinon in every file

[33mcommit 3364c0173d9d5fc3164598076949f7db19901012[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 16:35:05 2016 +0200

    Use implicit restrict and bindings
    
    An angular component is restricted to elements ("E") by default.

[33mcommit a4685c76b14902e385599cb2ed86ed855dd0bcd9[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 16:34:41 2016 +0200

    remove unused properties

[33mcommit 80885a0c01b3147b9b011144f0792f15240f0542[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 16:30:05 2016 +0200

    Test for login module
    
    The login controller was hard to test. @nicksellen and me tried mocking
    $state and Authentication, but it was quite hard (also due to the
    hookProvider). So I ended up using $httpBackend and a spy on $state.

[33mcommit 6244801194e93fc862f5f15a97f1408d5e40feab[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sun Oct 16 15:57:21 2016 +0200

    Remove karma-chai-plugins and use sinon@next
    
    @nicksellen and me experienced problems with using sinon, so we decided to go for
    sinon@next. This required us to remove karma-chai-plugins and replace it
    with karma-chai-as-promised.

[33mcommit 510ba1b74fae262da6faa08512e9a2dc1a03048a[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 15 17:45:09 2016 +0200

    Remove remember-me
    
    User session always stays, session drop is not implemented in backend

[33mcommit 11ae2610ebbfa850225c12b4bafbda1317a5a279[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 15 17:36:13 2016 +0200

    Move module import away from test

[33mcommit 8b90e45700538c910f527aacd213c8b9144c7afc[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 15 17:15:15 2016 +0200

    Replace loginForm directive
    
    Integrate it into the login controller
    Closes #71

[33mcommit 09f9d83751d84b70f6b556f41805979ca23f5929[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Sat Oct 15 14:42:55 2016 +0200

    Remove email length limitation from login form

[33mcommit af4e1c201ec6a6b6539822e9b4c212da5d2926e0[m
Merge: 641224a8 0ededb60
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Oct 15 13:33:48 2016 +0200

    Merge pull request #61 from yunity/hookProvider#60
    
    Hook provider#60

[33mcommit bdd8511f35a94157bc3f0444afca8e164708e81e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Oct 15 13:32:37 2016 +0200

    Added UserList

[33mcommit 0ededb60deed3ed3e6a4d0af5a9b7269f2a24f87[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 15 13:29:17 2016 +0200

    Replace Authentication string with import

[33mcommit 6dc833322ac556424b306afa73dae12badb6ddfc[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 15 13:25:17 2016 +0200

    Remove ngInject from hook

[33mcommit 45bc6280f961a4eaed696f50d67c4ea15cecd2f1[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 15 13:16:34 2016 +0200

    Fix tests

[33mcommit f1590e431a805d2e2eb8c26f028a8a47e7faf6c2[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 15 13:02:12 2016 +0200

    Remove named exports; test failures!

[33mcommit 641224a87b0f3572eb27c9b22c0387e84f432125[m
Merge: 5e9ef926 2b0ae386
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Sat Oct 15 12:12:43 2016 +0200

    Merge pull request #54 from yunity/topbar
    
    Topbar

[33mcommit 98471871e4be718892a2f990682c92ad71ff638e[m
Merge: 53193720 5e9ef926
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Oct 14 12:43:57 2016 +0200

    Merge branch 'master' into PickupList#34
    
    # Conflicts:
    #       client/app/components/components.js

[33mcommit 531937201a29a6845c12b19acf8dd74f822b9c41[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Oct 14 11:46:39 2016 +0200

    Fixed eslint errors, merged last changes

[33mcommit 97715fee6b0ca070e9ca7d59d319b306f9a943bc[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Oct 14 11:21:00 2016 +0200

    merged pickuplist specs

[33mcommit fe3692cc10a6fbe71c108f373b5bb1b36855d215[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Oct 14 03:06:50 2016 +0200

    GroupByDate is now a function
    Added test for GroupByDate

[33mcommit 7ef623b1bd41dc50533d7e05b01181885c9a078d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Fri Oct 14 01:40:49 2016 +0200

    Fixed pickuplist lint errors

[33mcommit 5e9ef926d5903e08793f24cb0277b614aefd1d59[m
Merge: 7b1f69f1 785301f4
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Oct 13 18:01:16 2016 +0200

    Merge pull request #64 from yunity/rewriteTests#62
    
    unify test style

[33mcommit 785301f477bcc1970e6ecccd81c8afd0b7fcc5e7[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 12 20:53:39 2016 +0200

    Test if promise is fulfilled

[33mcommit 3358b1e923d90eaf8dc5186e627c4a6303285d44[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Oct 12 18:56:56 2016 +0200

    Added store List to components.js

[33mcommit d7479dd636a5670bda942c537460dcba9ff8f746[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Wed Oct 12 18:56:29 2016 +0200

    Added store List

[33mcommit 7b1f69f1c4a6ca4f2913e81cec231312c9d10cd1[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Wed Oct 12 18:36:03 2016 +0200

    Add note about eslint editor plugins

[33mcommit 373e50b997d62957b69e53071d1ab333c2262666[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 12 17:12:38 2016 +0200

    Remove base class
    
    Closes #49

[33mcommit e2a7720208d0abc2b1bb4a2dc26e088e8d6a7017[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 12 17:03:23 2016 +0200

    Rewrite service style
    
    avoid `data.data`
    put `.then` and `.catch` on new lines

[33mcommit 1e6d225c314ff78c0da5a8f8509b984c5b22edf3[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Wed Oct 12 01:24:08 2016 +0200

    adjusted several tests
    
    group, store, user, authentication test rewrote using chai-as-promised

[33mcommit a48d6cadc9026e2fd6fe47296f3cf2a0b50211bf[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Wed Oct 12 10:26:52 2016 +0200

    Fix Snyk link

[33mcommit e4f6927cccfbde340636d20b863efd508be19ec0[m
Merge: 55311c49 6f2aa025
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Oct 11 23:17:42 2016 +0200

    Merge pull request #46 from yunity/PickupDateService#36
    
    PickupDate Service

[33mcommit 6f2aa0253d566d6403472ae2584007fe659957cb[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 11 22:58:46 2016 +0200

    Switch to chai-as-promised style

[33mcommit 08b6d319a6eae72da868e16963f3ffd1503a3aaf[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 11 22:47:46 2016 +0200

    Replace call to window.module

[33mcommit fbd0651bf46799f9b877746df961fe9598a1ce7e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 11 22:47:06 2016 +0200

    Remove base class

[33mcommit a27163eebac2c51005fcbd1cc6d415769f01d74d[m
Merge: 52d03e6d 5c7c3700
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 11 22:38:00 2016 +0200

    Merge branch 'master' into PickupDateService#36

[33mcommit 55311c4929ae35dca696e1c099420b43d1d7f0b2[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 11 22:01:45 2016 +0200

    coding style alignment

[33mcommit ac9f9266af0328df3d525fef486f5413bca656d8[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 11 18:54:01 2016 +0200

    created hookProvider and integrated it
    
    the hookProvider can now be loaded in the config section to set up
    router detours. closes #60

[33mcommit 8b9f91482471af30c514caa999c7ba28f8566151[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 11 13:51:31 2016 +0200

    removing unused code

[33mcommit 52d03e6d824b8519865e5af5f364d0a7056f9e87[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 10 13:16:14 2016 +0200

    Remove payload from logout

[33mcommit dcc335843755d63ca78dbafdefb30ea12dc18b4d[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 8 16:09:45 2016 +0200

    Remove authentication wrapper

[33mcommit 5c7c37009d478e278bde153a7003e78bf0bbba20[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 11 17:05:58 2016 +0200

    User service: test rejection

[33mcommit c425450a0af71bacef7430f21546c6633adda62a[m
Merge: 25a12fbe da67d19b
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Oct 11 16:43:35 2016 +0200

    Merge pull request #50 from yunity/enhanceDocumentation#44
    
    Better documentation

[33mcommit 25a12fbee017f323211798ef8c44f58252e3b7d9[m
Merge: e47f3c8f 6caccc7b
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Oct 11 16:43:07 2016 +0200

    Merge pull request #59 from yunity/userService#56
    
    User service#56

[33mcommit e70a95e1ae85237ca48a618237e95a6a9b0dd427[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 11 00:34:41 2016 +0200

    coding style change

[33mcommit 6caccc7b4436b5dc7510f3e4c1d2c6d07ff94628[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Tue Oct 11 00:20:24 2016 +0200

    changed tests to use chai-as-promised
    
    and some small stuff

[33mcommit 10dfb2bd31792dd12434781f90a919ae72447821[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Mon Oct 10 21:16:41 2016 +0200

    removed validation, changed tests

[33mcommit e47f3c8fa542edfc8b610ce50c01c693427287eb[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Mon Oct 10 21:48:22 2016 +0200

    add chai plugin "chai-as-promised"
    
    chai-as-promised helps to handle promises more easily.
    
    Added the npm package "karma-chai-plugins", which includes
    chai-as-promised and makes it possible to include it in the
    karma.conf.js as a framework.

[33mcommit d7a428d8b9fee589d0c6c66cbecde3e2afef6335[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 10 20:00:40 2016 +0200

    Fixed lint errors

[33mcommit 7a35d013fd5f3012183c9af0e53bf5b6bf148894[m
Merge: d1f1b3fd 969f1f3f
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Mon Oct 10 18:47:36 2016 +0200

    Merge pull request #51 from yunity/hooks
    
    -Remove duplicate hook implementation
    -Add tests for the new hook implementation

[33mcommit 3f1cc23425c596a17b22cc7a40648390db56c4a5[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 9 01:21:36 2016 +0200

    Added groupByDate filter and sticky headers

[33mcommit 4ef85f8103ed531ea5ebc7487972ddf49b644050[m
Merge: 16aee764 36e81c5f
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 10 17:46:05 2016 +0200

    Merge branch 'master' into groupContainer#20
    
    # Conflicts:
    #       client/app/common/common.js
    #       client/app/components/components.js

[33mcommit 16aee7649b1af62c074d0175fd3641586e368577[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sun Oct 9 02:04:33 2016 +0200

    Updated to new group service interface

[33mcommit 969f1f3f29c4592ac2e8d5f95c5beb4944263ded[m
Merge: 79f2ab07 d1f1b3fd
Author: Xbaal <becker.konrad@gmail.com>
Date:   Mon Oct 10 15:52:49 2016 +0200

    Merge remote-tracking branch 'refs/remotes/origin/master' into hooks
    
    Rebased the branch
    
    # Conflicts:
    #       client/app/common/authentication/authentication.js
    #       client/app/common/authentication/authentication.service.js
    #       client/app/common/authentication/authentication.wrapper.js

[33mcommit d1f1b3fd40b5beaa7fa91acc42ff01b7dfd9815a[m
Merge: 36e81c5f 804435b0
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Oct 10 13:20:03 2016 +0200

    Merge pull request #52 from yunity/authentication-services
    
    Authentication services

[33mcommit 804435b0a603f0555beb4a3836fcbbb02241244c[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 10 13:16:14 2016 +0200

    Remove payload from logout

[33mcommit 119324eaa8ce7e0fd666de9e3e0208b5f38a823a[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 8 16:09:45 2016 +0200

    Remove authentication wrapper

[33mcommit 4ffacdd093f96f4d45702a4ecd5390558a4324ab[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Sat Oct 8 11:47:01 2016 +0200

    Add badges

[33mcommit 2c5d105593730ac994504cbf95b1ac5bf4dc6616[m
Merge: 264abc8a 36e81c5f
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 10 12:49:34 2016 +0200

    Merge branch 'master' into PickupDateService#36

[33mcommit 264abc8a48fb0c33b4cf730dd941d25b4b7e4061[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 10 01:02:48 2016 +0200

    Add tests

[33mcommit d047b3a09215774c4deea6a6ae0dbd7b4c4eda2e[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Mon Oct 10 00:03:55 2016 +0200

    Remove wrapper

[33mcommit 79f2ab07a46fa4507fcad533e571db4af0d0b2ba[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Sun Oct 9 20:50:28 2016 +0200

    removed username and password from logout
    
    There is a currently a displaying error in SwaggerUI;
    /api/auth/logout/ does not need login data.
    See this issue (in the backend):
    https://github.com/yunity/foodsaving-backend/issues/203

[33mcommit 3c95db656c08aed664d81392534b57b61677b85d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 9 20:03:14 2016 +0200

    Fix authentication service tests
    
    A few issues prevented them from working correctly:
    * use of `Promise` inside service
    * use of `assert.done` (does not exist)
    
    We used the `expect` chai api, and async mocha style so that
    we can enforce the correct callback actually being called.
    
    with @Xbaal

[33mcommit d2ecd93b4606bd6fe15295f7536dd5c9acca0dff[m
Merge: 06e3926d bca4b68e
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 9 19:42:39 2016 +0200

    Merge branch 'hooks' of github.com:yunity/foodsaving-frontend into hooks

[33mcommit bca4b68e7323c51650ebcc9251e3fe1890499d8c[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Sun Oct 9 18:44:05 2016 +0200

    Revert "first fixes"
    
    This reverts commit baa12b7783709d0e07a07b75a9d54e89c3cde406.

[33mcommit 06e3926d14a5e45a176c822ad02149e748944315[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sun Oct 9 18:02:43 2016 +0200

    Add hookFactory tests
    
    Authentication tests fail at the moment as previously ES6 promises
    prevented the assert calls because executed, but they are incorrect.
    
    with @Xbaal

[33mcommit baa12b7783709d0e07a07b75a9d54e89c3cde406[m
Author: Xbaal <becker.konrad@gmail.com>
Date:   Sun Oct 9 14:33:19 2016 +0200

    first fixes

[33mcommit cb0d32474b561a15f77ef584f74cf500187a744e[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sun Oct 9 01:35:42 2016 +0200

    Fix linter errors in tests

[33mcommit 838b9e0c6f8c3212bdb77d543521a7c3d73b5cc9[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sun Oct 9 01:28:51 2016 +0200

    Add tests for authentication

[33mcommit 2b0ae3869a68c242f6316cf4ebb076fcf67efd7e[m
Author: maschaller <manuelschaller@gmx.de>
Date:   Sat Oct 8 18:06:03 2016 +0200

    fixed test

[33mcommit da67d19bfe7f44f78a1b96e81a5879125da98658[m
Author: Konrad Becker <becker.konrad@gmail.com>
Date:   Sat Oct 8 17:47:51 2016 +0200

    added exception for using ES6

[33mcommit 6f22e35d08e587b6c018c8a11da972b4afcd9988[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 8 16:46:26 2016 +0200

    Add topbar

[33mcommit d00315ab3e738f4fb0bc029f39a39cfb8098262b[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 8 16:04:30 2016 +0200

    Remove duplicate hook implementation

[33mcommit d4608478ed8933f6b7eaa2abb2225688d4cb9e71[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Oct 8 14:58:30 2016 +0200

    Don't avoid ng-click
    
    Rationale by @nicksellen - the rationale for avoiding them was to keep all logic in js and leave templates as simple templates so logic not spread everywhere. I suggested that this is not the angular-way and it is totally fine/usual/expected to use ng-click, etc. (use react et al if you want all logic in js).

[33mcommit ae61975b1311dd47997de78685284b118d455634[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Oct 8 14:55:21 2016 +0200

    Add backend description

[33mcommit dae4f6a15d269b28c76fa7f28a4c65393a84f04a[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Oct 8 13:55:46 2016 +0200

    Add current development goals

[33mcommit d93678efe25554b591c0f36f3257bfde0a924d23[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Oct 8 13:53:08 2016 +0200

    Fix formatting & spelling

[33mcommit 6691cb443016104af4b3b119e3d4ca178a9c9847[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Oct 8 13:50:58 2016 +0200

    Potential users and vision statement
    
    Taken from https://yunity.atlassian.net/wiki/display/HAC/Foodsaving+Tool - it's a proposal.

[33mcommit 82582e048bcde3057c1ebd7be3a68aa1f3321371[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sat Oct 8 13:41:58 2016 +0200

    Add development process description from wiki
    
    taken from https://yunity.atlassian.net/wiki/display/HAC/Foodsaving+Tool - it's a proposal

[33mcommit 36e81c5fbe4bb38ea06074618bc82b00e7751a38[m
Merge: e2387d0d 9ac25e71
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 8 11:55:17 2016 +0200

    Merge branch 'master' of https://github.com/yunity/foodsaving-frontend

[33mcommit 9ac25e7149d062fb3c1c8203428388be2918c814[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Sat Oct 8 11:47:01 2016 +0200

    Add badges

[33mcommit e2387d0d5d3dec9a3e1ac3f45cda7d3b238a25d4[m
Merge: b5a5d875 561de11d
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Sat Oct 8 11:06:22 2016 +0200

    Merge branch 'fonts'

[33mcommit b5a5d875f17cf65243ccdd356634e04ca12382a4[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 7 23:57:54 2016 +0200

    Remove empty flexbox
    
    Breaks on chromium

[33mcommit 754e39b82085ded131d6fe28b4499704c31f32a4[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Fri Oct 7 23:12:44 2016 +0200

    Fix code block formatting

[33mcommit 3fbaeaa9ff204e1edfeaec5617129a5a1a072185[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 7 23:10:56 2016 +0200

    Add setup instructions to README.md

[33mcommit 561de11d9ac6dce1a233611aad860c715cecf914[m
Merge: 1f84420c a8596f0d
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 7 15:30:39 2016 +0200

    Merge branch 'master' into fonts

[33mcommit a8596f0db65131f624b4a03ad89aa650c8b90036[m
Merge: 230902bb b8ade112
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 7 14:58:03 2016 +0200

    Merge branch 'storeService#37'

[33mcommit b8ade112b28e9177bac21614e2582e61e41db132[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 7 14:53:16 2016 +0200

    Fix linter errors

[33mcommit d315f64e09b91df713628b63130b7ffab3e81857[m
Merge: 923bf45c 230902bb
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 7 14:52:41 2016 +0200

    Merge branch 'master' into storeService#37

[33mcommit 923bf45c3812cd8d81833bc2a85557081e206240[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 7 14:46:49 2016 +0200

    Remove wrapper

[33mcommit 230902bb01b13479836f524e08e65ee77f9f7dc4[m
Merge: 51ddf7f3 81a96f2f
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Oct 7 14:17:52 2016 +0200

    Merge branch 'dev.yunity.org-backend'

[33mcommit 51ddf7f323667a488a1d6913d83ad3eb85f76d91[m
Merge: aa26e17b 5360fbee
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Thu Oct 6 19:25:04 2016 +0200

    Merge pull request #41 from yunity/refine-eslint-rules
    
    Tighten up style (inc. eslint rules)

[33mcommit e290f2c6c5c1bf2e57e2cd5e8e7a7327885b360d[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Oct 6 18:35:43 2016 +0200

    Added group page - currently only with pickup list

[33mcommit aa26e17b40b5d27b356f79318b836a230bd2228f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Oct 6 18:10:52 2016 +0200

    Fixed wrong simicolon in service generator

[33mcommit ac6c9ee39cf539a5cf5186ac44b248b3fca1284e[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Thu Oct 6 18:05:49 2016 +0200

    Fixed pickup item directive error message "fn expected function..."

[33mcommit 81a96f2fb6ad0a78c15b5c669c2fccb48b197a67[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Thu Oct 6 16:24:33 2016 +0200

    change backend to fstool.yunity.org

[33mcommit 5360fbee60a377226ec3973a6f6859e30417bbab[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 6 13:51:53 2016 +0200

    Disable eslint rules with TODOs to fix them

[33mcommit 4d2547b0b4c9e71e4972335ff90826e8cf4b0af2[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 6 13:49:19 2016 +0200

    Use angular.isArray

[33mcommit fa42e8087ae03abb6c3d409505427521fbada552[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 6 13:46:14 2016 +0200

    Disable angular window-service rule
    
    Lets us use `window` (used in tests). Should later either
    disable it just for the test, or find a way to not refer to
    window, and then re-enable this rule.

[33mcommit 473f920a7cf2311dd7584e23e252c53ca9523b54[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 6 13:45:20 2016 +0200

    Rebased to master and updated new files

[33mcommit 78a2cb9074ce7447d625a70052f5eac2271245d1[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 5 17:17:05 2016 +0200

    Require space around infix-ops

[33mcommit 815550b9fe796c82a0a6607e9ad67cd2d43d9f57[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Wed Oct 5 16:13:28 2016 +0200

    Allow angular service and double quotes

[33mcommit f3b6012ce39ae6ed5dcbf3c754b89d56d499579e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 3 16:29:39 2016 +0200

    Added extra eslint rules
    
    I did not change code to pass eslint with new rules in place

[33mcommit 71cc3154805d8687f9ed81db5f96980c86242c63[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 3 15:42:48 2016 +0200

    Use .json extension as recommended

[33mcommit 3e21f17a3f4f041e6856ed3eb1aee5cf0d5d938d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Oct 6 13:22:18 2016 +0200

    Use .env file to get BACKEND config loaded
    
    If no .env file is present it will default to dev.yunity.org
    If .env file is present with contents like:
    
    ```
    BACKEND=http://localhost:8080/
    ```
    
    It will proxy /api to http://locahost:8080/api

[33mcommit 03f113f1bb05cfd2c43149a86d3a3b985fc4326c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 3 14:45:55 2016 +0200

    Set https referer when using secure backend in dev
    
    Webpack server is running on http, if you have https backend
    server, django wants the referer to also use https.
    
    This fakes it and inserts the backend url as the referer for all
    proxy requests. It assumes django is not using the referer header
    for anything meaningful.

[33mcommit 0d0e840ac4f870347063631143d75436cf0dccd9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Oct 3 13:40:47 2016 +0200

    Add yConfig, dev.yunity.org as default backend

[33mcommit 2addf285c9cd26bf4380cca795e006853d5f042b[m
Merge: 59d793ce e5cb4fbb
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Oct 5 21:09:26 2016 +0200

    Merge pull request #35 from yunity/groupService#19
    
    Group service#19

[33mcommit e5cb4fbbde16aebce4a1a702817d5095d940f621[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Wed Oct 5 21:06:05 2016 +0200

    Remove wrapper from group service

[33mcommit 59d793ce6933e17677aae9ed2591abfc17b63b65[m
Merge: bdf2438d 11aadf62
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Oct 5 20:58:59 2016 +0200

    Merge pull request #33 from yunity/usertest#32
    
    User service tests and improvements

[33mcommit bdf2438d1a57243e271c91dc99cd9804c8b18394[m
Merge: bf61b704 fdb54558
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Wed Oct 5 20:58:23 2016 +0200

    Merge pull request #43 from yunity/wrapperremoval#42
    
    Remove wrapper from generator

[33mcommit 1f84420ced8cd9e67efa041bdf65cb0eb24029d2[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Tue Oct 4 22:27:17 2016 +0200

    add font-awesome as npm dependency

[33mcommit fdb54558af404abe9c53b7a4716aafcf9a173f02[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 4 21:50:46 2016 +0200

    Remove wrapper from generator

[33mcommit 11aadf624dce2698aadf02f70c72143072ff1efa[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Oct 4 20:50:45 2016 +0200

    User service: remove wrapper

[33mcommit 068b6fdf1614a90ee0fe81f91c3e0c97a94ca40b[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 3 17:48:19 2016 +0200

    Fixed directive error message "fn expected function..."

[33mcommit 1599db4e5d8c01b6af671bbe5dfe57c5a3d9d999[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 3 17:03:43 2016 +0200

    Changed group get syntax to make filtering is possible

[33mcommit f378875636d68db2ff6072e48581c748bfe38153[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 3 16:14:56 2016 +0200

    Added PickupList and PickupListItem components
    not perfectly working currently

[33mcommit 03673057ff49d89416e76347004ee0bfb7d4818f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 3 16:00:47 2016 +0200

    Added PickupDate Service
    -> Same get method like storeService
    -> No tests yet

[33mcommit a9cf1a5eadd43be58f58a8a2acf323a7885b2eef[m
Author: sneezoo <sneezoo@users.noreply.github.com>
Date:   Mon Oct 3 14:21:53 2016 +0200

    Add fontawesome

[33mcommit 7b931c02c9f8eb4d998634b70e5a2552fe2e5d6f[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Mon Oct 3 12:42:50 2016 +0200

    Added Store Service
    -> Implemented other style of get method: Is now get(params), e.g. get({id: 1})

[33mcommit bf61b704f577bfc15406d93471131edb94899364[m
Merge: 63933d63 de8ae3ba
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Oct 2 01:02:45 2016 +0200

    Merge pull request #31 from yunity/greenkeeper-css-loader-0.25.0
    
    Update css-loader to version 0.25.0 🚀

[33mcommit 63933d635baaf665623de6780c547ec1d4cee214[m
Merge: d81798c0 2b365590
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Oct 2 01:02:23 2016 +0200

    Merge pull request #28 from yunity/greenkeeper-babel-plugin-istanbul-2.0.1
    
    Update babel-plugin-istanbul to version 2.0.1 🚀

[33mcommit d81798c0ea4d5c0d35e6a9f578f1fc0cdb4691e3[m
Merge: 226334b7 d01f6088
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Oct 2 01:01:33 2016 +0200

    Merge pull request #23 from yunity/greenkeeper-karma-chrome-launcher-2.0.0
    
    Update karma-chrome-launcher to version 2.0.0 🚀

[33mcommit 226334b7e0e6c930ddc8ad993f332aebf8489a92[m
Merge: cb950f79 4f74849e
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Sun Oct 2 01:00:27 2016 +0200

    Merge pull request #21 from yunity/greenkeeper-yargs-5.0.0
    
    Update yargs to version 5.0.0 🚀

[33mcommit 0a1346ce48022446d26abffa488c039f6c813882[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Oct 1 23:26:10 2016 +0200

    Fixed Tests

[33mcommit f0b2a6b753799d69ac8edf70b3376c03b5e39b39[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Oct 1 23:07:19 2016 +0200

    Simplified group.service code

[33mcommit 6da339faef24bb0622a60ad4b4f2666b043feded[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Oct 1 22:45:23 2016 +0200

    Fixed unused data variable error

[33mcommit 4ba7228642f1f849ff5ba0ea5ee3ba3f58ad6c1a[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Oct 1 22:40:56 2016 +0200

    Fixed unused variable error

[33mcommit 39905971adfef71abf20c85b7c4c088733e7f496[m
Author: D0nPiano <spam-mails@abwesend.de>
Date:   Sat Oct 1 21:36:46 2016 +0200

    Added group service
    Only get method is tested yet, and wrapper still seems a little pointless.

[33mcommit 8be32977e13a825e17c740b392178ed276e2d089[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 23 21:35:28 2016 +0200

    Removed the additional promises
    
    They were not testable. Probably $httpBackend.flush() does not resolve the
    Promises, unless they are derived from Angulars' $q object. Removing
    them for now because they are not needed.

[33mcommit 68a74cc4c9891f03d02b259a5ca46b05080959fe[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 23 21:35:13 2016 +0200

    save method take id as separate argument

[33mcommit 676753643dcfb3a492991e465deec7ee0cbcc1ac[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 23 21:33:46 2016 +0200

    Remove users property
    
    It shadows the users function

[33mcommit 8d56eb4c5d19cdea94c8b0646d7a84a61c83a7fe[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 23 21:31:06 2016 +0200

    Completed tests

[33mcommit ae7b61ee469865b129597ef05a47b0345646602d[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Fri Sep 23 21:22:25 2016 +0200

    Add chai assert statement to linter

[33mcommit 39fffadf97b077f3cdeb9ac77440678836aa60e8[m
Author: Tilmann Becker <tilmann.becker@gmail.com>
Date:   Tue Sep 20 22:27:31 2016 +0200

    WIP: test for user service

[33mcommit cb950f7952af45f0465e8c6a88b62995b404f518[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Tue Sep 13 13:56:40 2016 +0200

    Rename to foodsaving

[33mcommit b767c8875c936574bde73dbfd850f9f2e52a8e1a[m
Author: ouya <alexander@andlabs.eu>
Date:   Tue Sep 6 15:04:19 2016 +0200

    FS-INT readme update - typo fix

[33mcommit 6b2f8de233877e432ba53470137eb83ee10a2cb6[m
Author: ouya <alexander@andlabs.eu>
Date:   Tue Sep 6 15:02:23 2016 +0200

    FS-INT readme update

[33mcommit 092171a3807ecfb8e01b27bc59e151836342b229[m
Merge: e1fc03ab 36fba7b9
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Mon Sep 5 20:24:29 2016 +0200

    Merge pull request #29 from yunity/contribute-fix
    
    Fix npm run lint command

[33mcommit de8ae3bac102940aebcd96f8fcadee67c64710a4[m
Author: greenkeeperio-bot <support@greenkeeper.io>
Date:   Mon Sep 5 18:09:33 2016 +0200

    chore(package): update css-loader to version 0.25.0
    
    https://greenkeeper.io/

[33mcommit 36fba7b9b1113fcae51d5728bc3ac887276e88af[m
Author: Tilmann Becker <tilmann.becker+github@gmail.com>
Date:   Mon Sep 5 04:59:05 2016 +0200

    Fix npm run lint command
    
    Need to execute npm run lint instead of npm lint

[33mcommit 2b365590e8748dc592fe3e19a510b6ef7da1a98b[m
Author: greenkeeperio-bot <support@greenkeeper.io>
Date:   Fri Sep 2 18:32:06 2016 +0200

    chore(package): update babel-plugin-istanbul to version 2.0.1
    
    https://greenkeeper.io/

[33mcommit e1fc03ab39da4640c8fc95dbf247918daf8b5272[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Mon Aug 29 21:27:17 2016 +0200

    Close #24

[33mcommit 697362b2e709b6f2b648f40161bc0d3e4dd42ac0[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Mon Aug 29 20:35:39 2016 +0200

    Close #26

[33mcommit cb205fd12ac0307bc877a16cf7350fd59dfa9930[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Mon Aug 29 20:28:47 2016 +0200

    Fix typo

[33mcommit d101666e90e90c3e32ebd10c58ce3fd21c13ad13[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Wed Aug 24 17:58:37 2016 +0200

    Fix authentication logout

[33mcommit 9b2b10a1877798996044ad893e356eb0efd9aaec[m
Merge: eb4cd05e f7300b5b
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Wed Aug 24 17:52:55 2016 +0200

    Merge branch 'robawi-master'

[33mcommit f7300b5bd55e097984849491620016b79a651d22[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Wed Aug 24 17:42:11 2016 +0200

    Reorganize code to fit in code style

[33mcommit d01f60881aea205052e590fbefaac1181f8ac5ab[m
Author: greenkeeperio-bot <support@greenkeeper.io>
Date:   Thu Aug 18 18:28:51 2016 +0200

    chore(package): update karma-chrome-launcher to version 2.0.0
    
    https://greenkeeper.io/

[33mcommit 836567f8c88dd9242b52aaf43ef0111cf07eed58[m
Author: Robert Bankwitz <robert.bankwitz@gmx.de>
Date:   Thu Aug 18 08:30:31 2016 +0200

    logout directive

[33mcommit 4f74849e00e658807bda3a65be557eb842c03a4a[m
Author: greenkeeperio-bot <support@greenkeeper.io>
Date:   Wed Aug 17 01:44:32 2016 +0200

    chore(package): update yargs to version 5.0.0
    
    https://greenkeeper.io/

[33mcommit eb4cd05ec0d5da2870ee2f2b7574226fbf5e59ee[m
Merge: 92325dce 55189322
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Mon Aug 8 13:43:04 2016 +0200

    Merge pull request #15 from yunity/greenkeeper-babel-preset-es2015-6.13.0

[33mcommit 55189322671dfe6c46aae30c3d1998312844fdb6[m
Author: greenkeeperio-bot <support@greenkeeper.io>
Date:   Fri Aug 5 03:44:53 2016 +0200

    chore(package): update babel-preset-es2015 to version 6.13.0
    
    https://greenkeeper.io/

[33mcommit 92325dcee5844aac58fa904721f9b3d7079502a7[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 22:58:14 2016 +0200

    Fix email patter in signup and login

[33mcommit 7fd5153a365c6df4813db5c0eae056a13010e15c[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 19:51:44 2016 +0200

    Add deployment stage to circleci

[33mcommit 2ff22ca9f682957a5e22ac58a8cb54e03121e3a9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 18:56:33 2016 +0200

    Add deployment to yuca

[33mcommit 111f94c15bd397a2af13db6538786ea944ddb538[m
Merge: a5c794bf 38dfdcec
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 18:34:49 2016 +0200

    Merge branch 'login#2'

[33mcommit 38dfdcec829b1cf5d58bade79bf7b9cbaadb51f7[m
Merge: fa75a350 a5c794bf
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 18:31:47 2016 +0200

    Merge branch 'master' into login#2
    Close #2

[33mcommit fa75a3508def5b23ac6ada41cb0b347314077bf3[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 17:23:52 2016 +0200

    Fix tests

[33mcommit a5c794bff95be1e5ab189e41865add58852accc7[m
Merge: ad273dc3 ffa45341
Author: donpiano <donpiano@schlepptopUbuntu>
Date:   Thu Aug 4 10:57:26 2016 +0200

    Merge origin/master

[33mcommit ad273dc33c5ae79791fda2bd868e1fc4a7bb206c[m
Author: donpiano <donpiano@schlepptopUbuntu>
Date:   Thu Aug 4 10:56:02 2016 +0200

    Differentiate login / app style

[33mcommit ffa453412ebe8e6c0ca588d6478138a89c6073dd[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 10:43:30 2016 +0200

    Configure angular to use django csrf token

[33mcommit 1ea0bcd38e6b013b598ffe7f1fbd16ec30022bc7[m
Merge: 08921adf 33b8df4f
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 10:40:27 2016 +0200

    Merge pull request #13 from yunity/greenkeeper-mocha-3.0.1
    
    chore(package): update mocha to version 3.0.1

[33mcommit c54d1ce7e20c4d15b72c82691a419cd667c1a63f[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 10:40:10 2016 +0200

    Replace alerts with ng-messages

[33mcommit 08921adf82b0deb54f75fbb48d484e8609c8321d[m
Author: donpiano <donpiano@schlepptopUbuntu>
Date:   Wed Aug 3 19:11:43 2016 +0200

    Added style info for login page

[33mcommit 33b8df4fb70e09e4c19e7e3e04b9d3a4430a2e41[m
Author: greenkeeperio-bot <support@greenkeeper.io>
Date:   Thu Aug 4 10:07:00 2016 +0200

    chore(package): update mocha to version 3.0.1
    
    https://greenkeeper.io/

[33mcommit 8e2c7d65e28951e318dd318255c8ebb25a592940[m
Merge: 13ff9fba d16ebc55
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 02:35:27 2016 +0200

    Merge pull request #12 from yunity/add-snyk-badge
    
    Add snyk badge

[33mcommit d16ebc553b12a9bce0317c46eed1ffbad1f2144d[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 02:32:39 2016 +0200

    Add snyk badge

[33mcommit 13ff9fba547cd2f95ed56709e5a18c8c13345ab2[m
Merge: b158b2a1 8804ad39
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 02:22:43 2016 +0200

    Merge pull request #11 from yunity/coverage
    
    Add coverage reporters and circleci/codecov setup

[33mcommit 8804ad39b9afb3454da1f5a3000fbdaf2300cb38[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 02:18:11 2016 +0200

    Add coverage reporters and circleci/codecov setup

[33mcommit b158b2a1b846da8edb708591ad5df19673a51820[m
Merge: afa65c81 b0fb513a
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 01:41:55 2016 +0200

    Merge pull request #10 from yunity/junit-format-tests
    
    Test output in junit format for circleci

[33mcommit b0fb513a37e9c4d8cd8880ea5b22a99864356698[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 01:35:47 2016 +0200

    Test output in junit format for circleci

[33mcommit afa65c81cdc6f1d1e41ffb0ce47f55455d2b8ceb[m
Merge: 8458e64c 729a064d
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Thu Aug 4 01:19:48 2016 +0200

    Merge pull request #9 from yunity/greenkeeper-update-all
    
    Update all dependencies 🌴

[33mcommit 729a064dfe724adeaf63cdd7bc4c731497a6cd4d[m
Author: greenkeeperio-bot <support@greenkeeper.io>
Date:   Thu Aug 4 01:12:50 2016 +0200

    chore(package): update dependencies
    
    https://greenkeeper.io/

[33mcommit 5499dcab3c3a6a0792757be0b90d35a9806d694d[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 00:30:29 2016 +0200

    Fix linter errors

[33mcommit e39a04cdf217388644ccaab2f1c70946c8550032[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 00:21:39 2016 +0200

    Add sign up

[33mcommit f16edd86b83aef337c3c6a4d6101cba807605d11[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 00:20:31 2016 +0200

    Add User service

[33mcommit d720f6b3f4d49f61ddd39f5ad0d9d0623453ec75[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Aug 4 00:18:46 2016 +0200

    Little Login fixes

[33mcommit 8458e64cce6fd4e458970af4efc9a73aea984714[m
Author: donpiano <donpiano@schlepptopUbuntu>
Date:   Wed Aug 3 19:04:29 2016 +0200

    Revert "Added style info for login page"
    
    This reverts commit ac792de6cbae6d9ec9ab43d822f2dd9461f002ae.

[33mcommit ac792de6cbae6d9ec9ab43d822f2dd9461f002ae[m
Author: donpiano <donpiano@schlepptopUbuntu>
Date:   Wed Aug 3 18:56:56 2016 +0200

    Added style info for login page

[33mcommit 4108af6651893e7de22a2be1e47d49ed785e3e36[m
Merge: a0b12a33 9a0ccf6e
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Wed Aug 3 17:12:30 2016 +0200

    Merge branch 'master' of https://github.com/yunity/yunity-angular

[33mcommit a0b12a33a8a7dd9ead37bb122cce66230467dc15[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Wed Aug 3 17:11:44 2016 +0200

    Remove rootScope injection

[33mcommit d787e0193026194076de2d4395e932b3d14a33b0[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Wed Aug 3 17:02:49 2016 +0200

    Make login button working

[33mcommit 9a0ccf6eab839c4742e99e7d69c9efae4b96c6d6[m
Merge: ff832d4a 18c6563a
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Sun Jul 31 05:58:53 2016 +0200

    Merge pull request #7 from waffle-iron/master
    
    waffle.io Badge

[33mcommit 18c6563aae34f40cd208ff3b34eb1ff00d2af2d3[m
Author: Making GitHub Delicious <iron@waffle.io>
Date:   Sat Jul 30 21:57:53 2016 -0600

    add waffle.io badge

[33mcommit ff832d4aebaf219bf7cff49c5e6078c72cd039e4[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Sun Jul 31 05:51:04 2016 +0200

    Fix linter errors

[33mcommit 59981fd908c53430c5ebd686677611bd1f814b3a[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Sun Jul 31 05:44:25 2016 +0200

    Clean predefined tests

[33mcommit ca846ed422c576b5afe32f6c59ba3dd6e434c46f[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Sun Jul 31 05:24:23 2016 +0200

    Fix #6 by replacing $rootScope broadcasts with Promises.
    Split authentication service in to seperate services.
    Fix validation errors.

[33mcommit 6d5354ae48c60de08513ca5b3952e324c01756d9[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Jul 30 01:40:36 2016 +0200

    Add test watching mode
    
    Start it with `npm run test:watch`

[33mcommit 9d12765fc8f92d4eda4d7b0ebb06c24333711a3b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Sat Jul 30 01:36:19 2016 +0200

    Simplify lint config
    
    ...by using es6 import without assigning it to var
    angular is a bit oldschool and uses global variables internally
    and so doesn't need to be passed around as modern libs would do

[33mcommit 660bb79105839b21f755b787b56f00b2edbbf658[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Sat Jul 30 00:04:49 2016 +0200

    Fix linter errors

[33mcommit 3f7ed5ce0b65859d70dea0a3d81a05dd8c98478f[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Fri Jul 29 23:58:37 2016 +0200

    Update Linter configuration

[33mcommit df14e7749315712bd98b95584669b6438e5d458f[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 29 20:27:51 2016 +0200

    Run linting after dependencies

[33mcommit b5bb386a1f3f3963c381b40f2f62560babf90bee[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 29 20:27:22 2016 +0200

    Run linting before build

[33mcommit b0cb9cc03a10234faac8af0e8419a8217e876b64[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 29 20:25:21 2016 +0200

    Added circle badge

[33mcommit b62bc0b059d34c22c1b4a45e3bd0749daf9ee67b[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 29 20:22:57 2016 +0200

    Add eslint
    
    Run via `npm run lint` or `gulp lint`.
    
    Will fail builds.
    
    Has errors for now...

[33mcommit faecda2de9f0c3eaba9168af52a1ef65550ba5ec[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 29 19:54:40 2016 +0200

    Added initial circleci config
    
    Add `npm run build` command too, which prepares everything for
    production and puts it in `dist/`

[33mcommit 4a941a28a18d439328da59fd7082c8c9316bb7a1[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Fri Jul 29 17:38:09 2016 +0200

    Fix validation always beeing true and authentication check failing

[33mcommit f59ab2bd63898f655d37a0acac9af40b32294acc[m
Merge: d67f5df1 8c588d23
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Fri Jul 29 17:33:24 2016 +0200

    Merge branch 'proxy-to-backend'

[33mcommit 8c588d234d0ad7cfe796a8a7215d6a7c79c9988e[m
Author: Nick Sellen <git@nicksellen.co.uk>
Date:   Fri Jul 29 01:00:42 2016 +0200

    Added setup to proxy requests to backend
    
    Proxies relevant requests to yunity-core and yunity-sockets

[33mcommit d67f5df16baba190510c7a78cb01ab4dd8d50112[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Jul 28 22:54:50 2016 +0200

    Add basic login functionality

[33mcommit 4c80c4154b5685cbcf6c599d2b2e2d4f52ec87e7[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Jul 28 22:33:34 2016 +0200

    Add Angular-Material and fix #1

[33mcommit 5bb9dc2be896db62ae9d41c420631db243e207cc[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Jul 28 22:00:16 2016 +0200

    Fix dependencies and migrate to MIT License

[33mcommit d77b4f0e3f5ecbc19565336c95fa487b641b0aa5[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Sat Jul 23 12:40:39 2016 +0200

    Small fixes

[33mcommit 7815dacf70310867d06e3448c10d5f6fb14a99ec[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Fri Jul 22 17:42:43 2016 +0200

    Add authentification backbone

[33mcommit eb2e48a9b85b7b1544d090a72eb413689f29bfb6[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Fri Jul 22 17:20:40 2016 +0200

    Add base application

[33mcommit 7d2213ed304b445e6d2fdc7d4240b39f2572c2f2[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Fri Jul 22 15:35:23 2016 +0200

    Fix setup

[33mcommit a46008e7f1e9428c52dad254d9b31fb0702e6fae[m
Author: Sneezoo <Sneezoo@users.noreply.github.com>
Date:   Thu Jul 21 20:10:17 2016 +0200

    Project setup
