# foodsaving.world cordova app

Initial cordova app :)

A few points:

* you need to get a `google-services.json` file from somewhere and put it in this directory
* it uses crosswalk, although it is being discontinued, still seems wise for now, not sure though
* I have modified `plugins/cordova-plugin-cookieemperor` to load the cookies when using crosswalk, should put it online somewhere
* I have probably added too many files to the repo, not sure what I can leave out right now
* I run this outside of the docker-compose setup, it would take some fiddlying around to get it working in docker (esp if you want to use the emulator)
