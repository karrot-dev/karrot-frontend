# Android Setup

Android dev stuff is a bit annoying, you need to get an android sdk from somewhere. The easiest approach is to install [Android Studio](https://developer.android.com/studio/index.html).

Then you need to install sdk platforms/images/apis and one or more emulators. You can do it via the Android Studio GUI, or command line.

### archlinux

If using archlinux there is a [nice page about it](https://wiki.archlinux.org/index.php/android).

In summary, install these aur packages:

```
android-platform android-platform-25 android-sdk android-sdk-build-tools android-sdk-platform-tools
```

Then setup env/path stuff:

```
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/tools/bin:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

It's a good idea to use an `sdkusers` group to own the /opt/android-sdk files (follow the instructions on the wiki page linked above).

Then install some sdk stuff:

```
sdkmanager "system-images;android-25;google_apis;x86"
```

(Update every now and then with `sdkmanager --update`)

See https://developer.android.com/studio/releases/platforms.html for some more info.

Create an emulator, e.g.:

```
avdmanager create avd --device "Nexus 6P" --name FOO --package "system-images;android-25;google_apis;x86" 
```

Start the emulator:

```
$(which emulator) -avd FOO -use-system-libs -gpu host -skin 1440x2560
```
