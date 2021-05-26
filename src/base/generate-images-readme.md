# Generate Landingpage Images

**TL:DR**
- put new images in designated `_raws` folder
- run `yarn generate-landing-images`
- if you want to control the ordering of some images in a folder, go to `Landing.vue` and update `sortingArr` for that folder

<br />

## Requirements

There is a `_raws` folder under `src/base/pages/images` with four subfolders where screenshots must be put.

Requirements of each folder inside `_raws`:

- `app-screenshots-browser`
  - must contain exactly ***one*** image
  - file-type: `png`
  - file-name: `karrot-screenshot-browser.png`
  - image dimensions: 2644 x 1726

- `app-screenshots-phone`
  - must contain exactly ***one*** image
  - file-type: `png`
  - file-name: `karrot-screenshot-phone.png`
  - image dimensions: 750 x 1624

- `feature-screenshots`
  - must contain exactly ***three*** images
  - file-type: `png`
  - file-names:
    - `karrot-feature-activities.png`
    - `karrot-feature-groups.png`
    - `karrot-feature-offers.png`

- `random-imgs`
  - no specific requirements
  - images will be cropped to square -> pre-crop the image to the desired view
  - if an image is smaller than 600x600, it will get scaled-up to that size

<br />

## Taking screenshots with browser devtools

Screenshots for all folders (expect `random-imgs`) have to be taken with browser devtools. Here is an example of how it has to be done in Chrome. Firefox is about the same.

<figure style="margin: 0; padding: 0;">
  <video controls="true" allowfullscreen="true" width="400">
    <source src="assets/generate-images-readme/taking-screenshots-example.mp4" type="video/mp4">
  </video>
  <figcaption><i>Example: taking screenshot for "karrot-screenshot-browser.png"</i></figcaption>
</figure>

<br />

<strong style="color: red;">NOTE:</strong> For each screenshot, make sure to
- first go into device mode
- select "Responsive" profile (not iPhone 6 etc)
- set DPR to 2

<br />

**`app-screenshots-browser`** (see video above)
  - set width/height to 1322 x 863
  - take screenshot
  - width/height of generated screenshot should be 2644 x 1726

**`app-screenshots-phone`**
  - set width/height to 375 x 812
  - take screenshot
  - width/height of generated screenshot should be 750 x 1624

**`feature-screenshots`**
- `karrot-feature-activities.png`
  - set width/height to 1600 x 1600
  - follow these steps:

    <video controls="true" allowfullscreen="true" width="400">
      <source src="assets/generate-images-readme/karrot-feature-activities.mp4" type="video/mp4">
    </video>

- `karrot-feature-groups.png`
  - set width/height to 1200 x 773
  - follow these steps:

    <video controls="true" allowfullscreen="true" width="400">
      <source src="assets/generate-images-readme/karrot-feature-groups-1.mp4" type="video/mp4">
    </video>
    <video controls="true" allowfullscreen="true" width="400">
      <source src="assets/generate-images-readme/karrot-feature-groups-2.mp4" type="video/mp4">
    </video>

- `karrot-feature-offers.png`
  - set width/height to 860 x 820
  - follow these steps:

    <video controls="true" allowfullscreen="true" width="400">
      <source src="assets/generate-images-readme/taking-screenshots-offers.mp4" type="video/mp4">
    </video>
<br />

## Run the script

Run this command after putting your generated screenshots in the corresponding folder(s) under `_raws`:
```js
yarn generate-landing-images
```

Generated images are saved to the same folder structure as in `_raws`, but one level higher (`src/base/pages/images`).

<br />

## Updating `Landing.vue`

Manual action in `Landing.vue` is required for some cases:

### 1. Ordering

If you want to control the ordering of `feature-screenshots` or `random-imgs`, go to the `enrichImages()` method and update `sortingArr` for that folder. Array Elements should be the image names (without extension) in the desired order.

### 2. Additional properties for feature screenshots

In the `enrichImages()` method the two properties `ident` and `extendOffsetPx` get added to each feature screenshot object.

- `ident` *(String)* is needed to grab the features title, description etc from locales
- `extendOffsetPx` *(String)* is a value that describes by how many pixels the feature screenshot should be additionally pushed off the screen. Some screenshots may not look completely cut-off visually. With `extendOffsetPx` this illusion can be achieved. **NOTE:** apply the same offset to all images on the same site.
