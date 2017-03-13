# Change Log
All notable changes to the foodsaving tool will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased]
### Added

- Landing page with a map of all groups, new title font (Cabin Sketch)
- User action history for groups
- Store management page with overview of all pickup date settings, incl. editing of pickup dates and series
- Updated locales: German, Esperanto, Spanish, French, Italian, Russian
- We do regular off-site backups now :)

### Changed

- Store editing with markdown preview
- Store create now uses the same form as store editing, incl. nice address input
- Minimum group & store name length (5 resp. 3 characters)
- Group names have to be unique, and store names have to be unique within their group
- Changes to group and store name will do immediate updates throughout the page

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

After months of planning and programming, the first version of the foodsaving tool is ready!

- **user**: sign-up with name, password and email address
- **group**: create a group, add yourself to a group, leave a group, set up name and description
- **store**: create a store which belongs to a group, set up name, description, address and position of a store
- **pick-up dates**: create a pick-up date which belongs to a store, set time and max. amount of people who can collect food, user can join/leave a pick-up date

[Unreleased]: https://github.com/yunity/foodsaving-frontend/compare/r2...HEAD
[Release 2]: https://github.com/yunity/foodsaving-frontend/compare/r1...r2
