// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

export const dirNames = {
  APP_SCREENSHOTS_BROWSER: 'app-screenshots-browser',
  APP_SCREENSHOTS_PHONE: 'app-screenshots-phone',
  FEATURE_SCREENSHOTS: 'feature-screenshots',
  RANDOM_IMGS: 'random-imgs',
}

export const dirs = {
  [dirNames.APP_SCREENSHOTS_BROWSER]: {
    imagesAreSquare: false,
    widths: [400, 600, 800, 880, 889, 1200, 1600, 1760, 1776],
    maxWidth: 1776,
    requiredImageDimensions: [2644, 1726],
    requiredImages: ['karrot-screenshot-browser.png'],
    sizes: `
          (max-width: 386px) 400px,
          (max-width: 583px) 600px,
          (max-width: 699px) 800px,
          (max-width: 760px) 600px,
          (max-width: 960px) 800px,
          (max-width: 1049px) 889px,
          880px
          `,
  },
  [dirNames.APP_SCREENSHOTS_PHONE]: {
    imagesAreSquare: false,
    widths: [100, 120, 130, 160, 200, 211, 240, 245, 260, 320, 422, 490],
    maxWidth: 490,
    requiredImageDimensions: [750, 1624],
    requiredImages: ['karrot-screenshot-phone.png'],
    sizes: `
          (max-width: 340px) 100px,
          (max-width: 401px) 120px,
          (max-width: 432px) 130px,
          (max-width: 544px) 160px,
          (max-width: 699px) 211px,
          (max-width: 716px) 160px,
          (max-width: 929px) 211px,
          245px
          `,
  },
  [dirNames.FEATURE_SCREENSHOTS]: {
    imagesAreSquare: false,
    widths: [240, 270, 300, 330, 354, 370, 380, 429, 489, 480, 540, 600, 660, 708, 740, 760, 858, 978],
    maxWidth: 978,
    requiredImages: [
      'karrot-feature-activities.png',
      'karrot-feature-groups.png',
      'karrot-feature-offers.png',
    ],
    sizes: `
          (max-width: 340px) 270px,
          (max-width: 400px) 330px,
          (max-width: 440px) 370px,
          (max-width: 539px) 429px,
          (max-width: 599px) 489px,
          (max-width: 720px) 240px,
          (max-width: 860px) 300px,
          (max-width: 988px) 354px,
          (max-width: 1049px) 380px,
          354px
          `,
  },
  [dirNames.RANDOM_IMGS]: {
    imagesAreSquare: true,
    widths: [100, 150, 200, 250, 300, 400, 500, 600],
    maxWidth: 600,
    sizes: `
          (max-width: 372px) 100px,
          (max-width: 560px) 150px,
          (max-width: 599px) 200px,
          (max-width: 640px) 150px,
          (max-width: 790px) 200px,
          (max-width: 940px) 250px,
          (max-width: 1049px) 300px,
          250px
          `,
  },
}
