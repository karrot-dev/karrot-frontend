# Change Log
All notable changes to _karrot_ will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased]
### Added


### Changed


### Removed


### Fixed

## [Release 4] - 2017-12-27

Complete frontend rewrite with [VueJS](http://vuejs.org/) and [Quasar](http://quasar-framework.org/)
### Added
- Group conversations
- Store statuses
- Pickup and series description field

### Changed
- Broad design and UI changes; more colors
- Rename from `foodsaving tool` to `karrot`


### Removed
- AngularJS


### Fixed
- Lots of stuff


## [Release 3] - 2017-07-03
### Added

- Landing page with a map of all groups, new title font (Cabin Sketch)
- User action history for groups and stores, with extensive filtering capabilities
- Store management page with overview of all pickup date settings, incl. editing/deleting of pickup dates and series, and even pickup dates that are part of a series
- Updated locales: German, Esperanto, Spanish, French, Italian, Russian, Swedish
- New locale: Chinese
- We do regular off-site backups now :)
- Public group page for groups to show their information
- Proper translatable e-mail templates, makes integration of HTML mails easier
- Walkthrough page (to be found in the blog)
- Link to our facebook group in the topbar
- Translation progress indicator in the menu

### Changed

- Store editing with markdown preview
- Store create now uses the same form as store editing, incl. nice address input
- Minimum group & store name length (5 resp. 3 characters)
- Group names have to be unique, and store names have to be unique within their group
- Changes to group and store name will do immediate updates throughout the page
- Locations can be set by clicking on a map and by dragging the marker around
- During creation, give feedback if a group name or a store name within a group is already taken
- Remember chosen group and chosen language acrosss browsers and devices
- On the store page, the create pickup button has been replaced with a "manage pickup dates" button, increasing the reachability of that page
- Date selector only allows today and dates in the future

### Removed

- Inline editing. Now all editing happens on separate edit pages with URLs

### Fixed

- Removed nested scrollbars
- Translatable markdown help
- Translated backend error messages
- Removed unused translation keys
- Disable autoformatting features on login and signup page
- Disable buttons when a request is in progress
- Mail change now happens after the new mail is verified
- Fix missing aria-label causing test to fail
- After changing email addresses, show new addresses in the verification interface


## [Release 2] - 2017-02-21
### Added

- Pickup dates can now be created as weekly series
- Translations: German, French, Swedish, Spanish, Italian, Russian and Esperanto
- Show group information before joining
- Groups can ask for a password
- Mail verification on sign-up
- User can change password and mail
- Users can request a new password via mail
- "Call for collaboration" on front page
- Favicon
- Loading bar to show when server requests are in progress
- Nice loading dots
- Automated login after signing up
- Small popup to inform users about timeouts and server errors

### Changed

- Main deployment to foodsaving.world
- Two-column layout for groups and stores
- New brown-ish color scheme
- Dynamic page title
- Group and store info field (description) supports markdown formatting
- Groups need a timezone setting (defaults to Europe/Berlin)

### Removed

- Inline-editing with angular-xeditable

### Fixed

- Hide map when there is no location
- Dialog is hidden by map
- Scrolling issues
- Less server requests for showing pickup dates
- Disabled auto-capitalization on login page
- many small issues...


## Release 1 - 2016-12-14
### Added

After months of planning and programming, the first version of ~the foodsaving tool~ _karrot_ is ready!

- **user**: sign-up with name, password and email address
- **group**: create a group, add yourself to a group, leave a group, set up name and description
- **store**: create a store which belongs to a group, set up name, description, address and position of a store
- **pick-up dates**: create a pick-up date which belongs to a store, set time and max. amount of people who can collect food, user can join/leave a pick-up date

[Unreleased]: https://github.com/yunity/karrot-frontend/compare/v4.0.0...HEAD
[Release 4]: https://github.com/yunity/karrot-frontend/compare/v3.0.0...v4.0.0
[Release 3]: https://github.com/yunity/karrot-frontend/compare/r2...v3.0.0
[Release 2]: https://github.com/yunity/karrot-frontend/compare/r1...r2
