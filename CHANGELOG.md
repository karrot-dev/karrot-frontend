# Change Log

All notable changes to _Karrot_ will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

Types of changes:

  - `Added` for new features.
  - `Changed` for changes in existing functionality.
  - `Deprecated` for soon-to-be removed features.
  - `Removed` for now removed features.
  - `Fixed` for any bug fixes.
  - `Security` in case of vulnerabilities.


Please document your changes in this format:

```
  - description of change [#PR] @username
```

## [Unreleased]

### Changed

- Frontend code structure is now organized into modules @tiltec

### Fixed

- Notification items would sometimes cause errors when related pickups haven't been loaded @tiltec
- Sidenav title on mobile shows notification and message icons when logged out @tiltec
- Sidenav open/closed state was sometimes inconsistent @tiltec

## [6.2.3] - 2018-10-26

### Changed

- Better identification of messages from users who left the group @tiltec
- Keep client data up-to-date when group members join or leave @tiltec
- Always send android and web push notifications, even when the client is online @tiltec
- Further improved KNotice especially for small screens @tiltec
- "Back to top" button has been removed to improve usability @tiltec
- Do not collapse sidenav boxes on mobile @tiltec
- Set minimum length of user names to 3 characters @tiltec
- Move "show more" button in messages popover to bottom @tiltec
- Load only conversations with unread messages by default @tiltec

### Fixed

- Applications of deleted users are now properly withdrawn @tiltec
- Make login error message translatable @tiltec
- Fix problematic concatenated translation message in trust dialog @tiltec

## [6.2.2] - 2018-10-21

### Changed

- App push icon now resembles the Karrot logo better @tiltec
- Mobile chat and wall input now try to keep the cursor on screen @tiltec
- Mobile chat header now collapses properly @tiltec
- Move application actions into popover @tiltec

### Fixed

- App push notifications @tiltec
- Clicking notification redirects to the appropriate page @tiltec
- User profile picture did not show in app @tiltec
- Upcoming pickup notifications have been deleted and recreated constantly @tiltec
- User profile didn't reliably load when another user profile was open before @tiltec
- Applications couldn't be accepted or declined on mobile @tiltec

## [6.2.1] - 2018-10-17

### Added

- Notification if connection was lost @tiltec

### Fixed

- Make applications more mobile-friendly [#1112] @djahnie

## [6.2.0] - 2018-08-27

### Added

- Newcomer role and trust system [#1077] @tiltec
- On-site notifications in topbar [#1099] @tiltec
- Deploy android app to Play Store @tiltec @djahnie
- Record statistics about which profile features are used @tiltec

### Fixed

- Fix application chat initial questions layout [#1097] @nicksellen
- Application user was sometimes missing @djahnie
- Disable unwanted HTML support in map popups @tiltec
- Invalid dates when application has been withdrawn @tiltec

## [6.1.0] - 2018-08-31

### Added

- Conversations overview page [#1070] @tiltec

### Changed

- Feedback list design @tiltec
- LocaleSelect and CommunityFeed improved for mobile @tiltec
- Speed up feedback loading by including related pickups @tiltec

### Fixed

- Loading of application chat @tiltec
- Pickups: access to undefined properties while loading @tiltec
- Redirect to groups gallery when user got logged out @tiltec

## [6.0.0] - 2018-08-25

### Added

- Replies to wall messages [#1065] @nicksellen @tiltec
- Link to external route planner for store directions [#1020] @pogopaule @tiltec
- Add notifications about new messages in community.foodsaving.world @tiltec
- Group applications [#1063] [#1082] @djahnie @taistadam @tiltec @nicksellen

### Changed

- Merge message notification emails together if messages are sent within 5 minutes @tiltec
- Prevent notifications for seen messages @tiltec
- Hide markdown preview in sidebar @tiltec
- External links, email links and phone links in markdown now have a small icon @tiltec
- Internal links open in the same tab @tiltec
- Unified desktop/mobile sidenav [#1071] @nicksellen

### Removed

- Group password; affected groups have been migrated to applications

## [5.0.0] - 2018-07-16

### Added

- web browser push notifications @nicksellen
- sorting and search for the group member list @tiltec
- show failed email notifications @tiltec
- add user conversations @tiltec
- add pickup conversations @nicksellen
- filter controls and back button for fullscreen group map @tiltec
- context menu to create new store in group map @tiltec
- add message editing @tiltec
- refresh most data when karrot app wakes up @tiltec
- mobile "pull-to-refresh" in group wall @tiltec
- automatically mark group as active or inactive @oldPadavan
- send correct email template on resend verification code @pogopaule @tiltec
- (more, but we didn't keep a changelog lately...)

### Changed

- speed up initial loading and rendering @nicksellen
- unify color usage @tiltec
- custom leaflet marker component to allow quasar colors @tiltec
- rework of feedback form to allow feedback without weight @tiltec

### Fixed

- lots of bugs

## [4.0.0] - 2017-12-27

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

## [3.0.0] - 2017-07-03

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

## [2.0.0] - 2017-02-21

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

## 1.0.0 - 2016-12-14

After months of planning and programming, the first version of ~the foodsaving tool~ _karrot_ is ready!

### Added

- **user**: sign-up with name, password and email address
- **group**: create a group, add yourself to a group, leave a group, set up name and description
- **store**: create a store which belongs to a group, set up name, description, address and position of a store
- **pick-up dates**: create a pick-up date which belongs to a store, set time and max. amount of people who can collect food, user can join/leave a pick-up date

[#1112]: https://github.com/yunity/karrot-frontend/issues/1112
[#1077]: https://github.com/yunity/karrot-frontend/issues/1077
[#1099]: https://github.com/yunity/karrot-frontend/issues/1099
[#1097]: https://github.com/yunity/karrot-frontend/issues/1097
[#1070]: https://github.com/yunity/karrot-frontend/issues/1070
[#1065]: https://github.com/yunity/karrot-frontend/issues/1065
[#1020]: https://github.com/yunity/karrot-frontend/issues/1020
[#1063]: https://github.com/yunity/karrot-frontend/issues/1063
[#1082]: https://github.com/yunity/karrot-frontend/issues/1082
[#1071]: https://github.com/yunity/karrot-frontend/issues/1071

[Unreleased]: https://github.com/yunity/karrot-frontend/compare/v6.2.3...HEAD
[6.2.3]: https://github.com/yunity/karrot-frontend/compare/v6.2.2...v6.2.3
[6.2.2]: https://github.com/yunity/karrot-frontend/compare/v6.2.1...v6.2.2
[6.2.1]: https://github.com/yunity/karrot-frontend/compare/v6.2.0...v6.2.1
[6.2.0]: https://github.com/yunity/karrot-frontend/compare/v6.1.0...v6.2.0
[6.1.0]: https://github.com/yunity/karrot-frontend/compare/v6.0.0...v6.1.0
[6.0.0]: https://github.com/yunity/karrot-frontend/compare/v5.0.0...v6.0.0
[5.0.0]: https://github.com/yunity/karrot-frontend/compare/v4.0.0...v5.0.0
[4.0.0]: https://github.com/yunity/karrot-frontend/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/yunity/karrot-frontend/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/yunity/karrot-frontend/compare/v1.0.0...v2.0.0
