<div align="center">
  <img width="200" src="https://karrot.world/statics/carrot_logo.png">
</div>
<br>
<br>

> _A web platform to support foodsaving groups worldwide._ :computer: :apple: :earth_asia:

# karrot


[![CodeCov](https://codecov.io/github/yunity/karrot-frontend/coverage.svg)](https://codecov.io/gh/yunity/karrot-frontend)
[![CircleCI](https://circleci.com/gh/yunity/karrot-frontend.svg?style=shield)](https://circleci.com/gh/yunity/karrot-frontend)
(Frontend)

[![codecov](https://codecov.io/gh/yunity/karrot-backend/coverage.svg)](https://codecov.io/gh/yunity/karrot-backend)
[![CircleCI](https://circleci.com/gh/yunity/karrot-backend.svg?style=shield)](https://circleci.com/gh/yunity/karrot-backend)
(Backend)

<div align="center">
  <img height="300" src="https://user-images.githubusercontent.com/4410802/42418936-4b29eb8c-82ab-11e8-9fd6-329952c73800.png">
  <img width="20" src="https://user-images.githubusercontent.com/4410802/42418563-705d917c-82a3-11e8-91d8-8a234af008e4.png">
  <img height="240" src="https://user-images.githubusercontent.com/4410802/42418974-ec3a8e6e-82ab-11e8-935c-83d158e5034d.png">
</div>
<br>
<br>

This is the frontend repository, i.e. the browser-side software that powers [karrot.world](https://karrot.world). Have a look at our server-side code at [karrot-backend](https://github.com/yunity/karrot-backend), too!

## Features

- manage information about store cooperations :apple:
- schedule one-time and recurring food pickups :calendar:
- gather feedback about pickups :mag:
- communicate with your team with built-in messaging support :speech_balloon:
- receive notifications via e-mail, Android app and web browser push :loudspeaker:
- use karrot in your preferred language :globe_with_meridians:

## foodsaving worldwide

The [foodsaving worldwide team](https://foodsaving.world/team) provides additional resources to build up foodsaving, e.g. an infopage on [foodsaving.world](https://foodsaving.world), where all the intel is gathered.

## Development goals

Our current development goals are prioritized and written down in our [elaborate roadmap](ROADMAP.md).

We are keeping the features down to a minimum, in order to progressively build up useful software.

## Releases

Look into our [change log file](CHANGELOG.md) for a quick overview of past versions and recent changes.

## Translation

We are using [Transifex](https://www.transifex.com/) to provide _karrot_ in many languages. To help us with translation, please [create an account](http://transifex.com/signup) and [apply for the _karrot_ group](https://www.transifex.com/yunity-1/karrot/frontend/).

After selecting your target language and choosing the resource file, go ahead to start translating!

## Setup

- [Node.js](https://nodejs.org/) and [yarn](https://yarnpkg.com/en/docs/install)

To clone and install:

```
git clone https://github.com/yunity/karrot-frontend.git
cd karrot-frontend
yarn
```

To run the local dev server:

```
yarn dev
```

To lint and run the tests:

```
yarn lint
yarn test
```

If you want to use an eslint plugin for your editor, please keep in mind that you either have to install all eslint plugins listed in package.json globally or you run `yarn install`. Otherwise your eslint plugin may not work.

## Start contributing?

Be sure to join us in the #karrot-dev [chatroom on slack](https://slackin.yunity.org/) and get in contact!
The most important information is written down in our [contribution guidelines](CONTRIBUTE.md).

The [backend](https://github.com/yunity/karrot-backend) is developed to support this frontend. If you find a bug or miss something in the API, please file an issue in the backend repository.

## Contributors

These people contributed to karrot in a significant way:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/4410802?v=4" width="100px;"/><br /><sub><b>Tilmann Becker</b></sub>](https://github.com/tiltec)<br />[💻](https://github.com/yunity/karrot-frontend/commits?author=tiltec "Code") [🤔](#ideas-tiltec "Ideas, Planning, & Feedback") [🚇](#infra-tiltec "Infrastructure (Hosting, Build-Tools, etc)") [👀](#review-tiltec "Reviewed Pull Requests") [⚠️](https://github.com/yunity/karrot-frontend/commits?author=tiltec "Tests") [💬](#question-tiltec "Answering Questions") | [<img src="https://avatars2.githubusercontent.com/u/31616?v=4" width="100px;"/><br /><sub><b>Nick Sellen</b></sub>](http://nicksellen.co.uk)<br />[💻](https://github.com/yunity/karrot-frontend/commits?author=nicksellen "Code") [📖](https://github.com/yunity/karrot-frontend/commits?author=nicksellen "Documentation") [🚇](#infra-nicksellen "Infrastructure (Hosting, Build-Tools, etc)") [👀](#review-nicksellen "Reviewed Pull Requests") [⚠️](https://github.com/yunity/karrot-frontend/commits?author=nicksellen "Tests") | [<img src="https://avatars0.githubusercontent.com/u/17573771?v=4" width="100px;"/><br /><sub><b>Janina Abels</b></sub>](https://github.com/djahnie)<br />[🤔](#ideas-djahnie "Ideas, Planning, & Feedback") [🐛](https://github.com/yunity/karrot-frontend/issues?q=author%3Adjahnie "Bug reports") [💬](#question-djahnie "Answering Questions") [📋](#eventOrganizing-djahnie "Event Organizing") | [<img src="https://avatars0.githubusercontent.com/u/16825880?v=4" width="100px;"/><br /><sub><b>D0nPiano</b></sub>](https://github.com/D0nPiano)<br />[🎨](#design-D0nPiano "Design") [💻](https://github.com/yunity/karrot-frontend/commits?author=D0nPiano "Code") [🤔](#ideas-D0nPiano "Ideas, Planning, & Feedback") | [<img src="https://avatars0.githubusercontent.com/u/16634824?v=4" width="100px;"/><br /><sub><b>Lukas Gebhard</b></sub>](https://github.com/mr-kojo)<br />[💻](https://github.com/yunity/karrot-frontend/commits?author=mr-kojo "Code") [🤔](#ideas-mr-kojo "Ideas, Planning, & Feedback") [👀](#review-mr-kojo "Reviewed Pull Requests") [📖](https://github.com/yunity/karrot-frontend/commits?author=mr-kojo "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/7449720?v=4" width="100px;"/><br /><sub><b>mrkvon</b></sub>](https://mrkvon.org)<br />[💻](https://github.com/yunity/karrot-frontend/commits?author=mrkvon "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars2.githubusercontent.com/u/25362020?v=4" width="100px;"/><br /><sub><b>Ines Dorian Gütt</b></sub>](http://danke.fish)<br />[💻](https://github.com/yunity/karrot-frontend/commits?author=id-gue "Code") [📖](https://github.com/yunity/karrot-frontend/commits?author=id-gue "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/18111928?v=4" width="100px;"/><br /><sub><b>Marie Dedikova</b></sub>](https://github.com/mddemarie)<br />[💻](https://github.com/yunity/karrot-frontend/commits?author=mddemarie "Code") [📖](https://github.com/yunity/karrot-frontend/commits?author=mddemarie "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/10246027?v=4" width="100px;"/><br /><sub><b>Andreas Langecker</b></sub>](https://gitlab.com/alangecker)<br />[💻](https://github.com/yunity/karrot-frontend/commits?author=alangecker "Code") | [<img src="https://avatars3.githubusercontent.com/u/19744774?v=4" width="100px;"/><br /><sub><b>djembejohn</b></sub>](https://github.com/djembejohn)<br />[💻](https://github.com/yunity/karrot-frontend/commits?author=djembejohn "Code") [🤔](#ideas-djembejohn "Ideas, Planning, & Feedback") | [<img src="https://avatars0.githubusercontent.com/u/861660?v=4" width="100px;"/><br /><sub><b>Matthias Larisch</b></sub>](https://github.com/NerdyProjects)<br />[💻](https://github.com/yunity/karrot-frontend/commits?author=NerdyProjects "Code") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.

# Attribution

_Karrot_ is built with open-source software. Here is some of them:

- [Django](https://www.djangoproject.com/)
- [Django REST framework](http://www.django-rest-framework.org/)
- [VueJS](https://vuejs.org/) + vuex
- [Quasar Framework](http://quasar-framework.org/)
- [Twemoji](https://github.com/twitter/twemoji)

