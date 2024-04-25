# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [2.0.2] - 2024-04-25

- [#242](https://github.com/os2display/display-admin-client/pull/242)
  - Ensured real ip is logged in nginx.

## [2.0.1] - 2024-04-10

- [#241](https://github.com/os2display/display-admin-client/pull/241)
  - Fixed loading of theme for slide preview.

## [2.0.0] - 2024-04-09

- [#240](https://github.com/os2display/display-admin-client/pull/240)
  - Remove caching of requests from redux toolkit api.
- [#239](https://github.com/os2display/display-admin-client/pull/239)
  - Updated api integration following route change to v2. 
- [#238](https://github.com/os2display/display-admin-client/pull/238)
  - Fixed screen layout overlapping issue.
- [#237](https://github.com/os2display/display-admin-client/pull/237)
  - Fixed isCampaign check for playlist relation puts.
  - Removed redux/api.js since it was unused.
  - Removed js generated version of typescript api since it was unused.
  - Added skip to queries that rely on an argument to avoid undefined queries.
- [#236](https://github.com/os2display/display-admin-client/pull/236)
  - Add help text to activation code form.
  - Fixed warnings raised when compiling.
- [#234](https://github.com/os2display/display-admin-client/pull/234)
  - Cleaned up code flow in playlist saving.
  - Changed to chaining relations puts.
- [#235](https://github.com/os2display/display-admin-client/pull/235)
  - Added roles to users list.
- [#233](https://github.com/os2display/display-admin-client/pull/233)
  - Fixed issue when clicking media archive element when media archive is not in multiple mode.
- [#232](https://github.com/os2display/display-admin-client/pull/232)
  - Fixed time zone issue in playlist schedules.
- [#231](https://github.com/os2display/display-admin-client/pull/231)
  - Fixed post body of activation POST request.
- [#230](https://github.com/os2display/display-admin-client/pull/230)
  - Fixed roles in access-config.json itk-dev infrastructure template.
- [#229](https://github.com/os2display/display-admin-client/pull/229)
  - Fixed post body of activation POST request.
- [#228](https://github.com/os2display/display-admin-client/pull/228)
  - Changed login page to only get oidc urls when a login button has been clicked.
- [#227](https://github.com/os2display/display-admin-client/pull/227)
  - Changed how theme is loaded following change to API
- Added fetch all to avoid removing slides when saving playlist and all slides have not been fetched.
- [#220](https://github.com/os2display/display-admin-client/pull/220)
  - Adds CRUD flows for external users and activation codes.
  - Added login and activation flow for external users.
- [#217](https://github.com/os2display/display-admin-client/pull/217)
  - Move tenant dropdown to sidebar.
- [#215](https://github.com/os2display/display-admin-client/pull/215)
  - Fixed OIDC login buttons.
- [#213](https://github.com/os2display/display-admin-client/pull/213)
  - Added focus trap, to trap the keyboard focus in our modals.
  - Added user list, create and edit.
- [#212](https://github.com/os2display/display-admin-client/pull/212)
  - Updated color of login background.
- [#211](https://github.com/os2display/display-admin-client/pull/211)
  - Updated login page.
  - Cleaned up translations.
  - Fixed some WCAG2.1 issues.
  - Added os2display logo.
- [#225](https://github.com/os2display/display-admin-client/pull/225)
  - Fixed caching issues when adding/removing playlists from slide.
- [#223](https://github.com/os2display/display-admin-client/pull/223)
  - Updated to API Platform 3
- [#222](https://github.com/os2display/display-admin-client/pull/222)
  - Fixed redux build.

## [1.5.0] - 2023-10-26

- [#221](https://github.com/os2display/display-admin-client/pull/221)
  - Fixed missing pagination button in drag-and-drop-table.
- [#214](https://github.com/os2display/display-admin-client/pull/214)
  - Use OIDC Code authorization flow and remove React StrictMode.

## [1.4.0] - 2023-09-14

- [#210](https://github.com/os2display/display-admin-client/pull/210)
  - Use thumbnails for media list if they are set.

## [1.3.3] - 2023-07-11

- [#208](https://github.com/os2display/display-admin-client/pull/208)
  - Fix version not set in release.json

## [1.3.2] - 2023-07-11

- [#207](https://github.com/os2display/display-admin-client/pull/207)
  - Fix incorrect values in auto build release.json in images

## [1.3.1] - 2023-07-11

- [#206](https://github.com/os2display/display-admin-client/pull/206)
  - Added example_release.json file

## [1.3.0] - 2023-07-11

- [#205](https://github.com/os2display/display-admin-client/pull/205)
  - Setup separate image builds for itkdev and os2display
- [#204](https://github.com/os2display/display-admin-client/pull/204)
  - Change docker image name from `os2display/os2display-admin-client`
  to `os2display/display-admin-client` to match image name and
  repository name
- [#200](https://github.com/os2display/display-admin-client/pull/200)
  - Update docker build to publish to "os2display" org on docker hub.
  - Update github workflow to latest actions.
  - Add github workflow to build and create release.
  - Change `example_config.json` to use relative paths.
- [#202](https://github.com/os2display/display-admin-client/pull/202)
  - Remove zeroes when pagination button is not visible.
  - Save campaign before redirect.
- [#201](https://github.com/os2display/display-admin-client/pull/201)
  - Updated poster and feed selection.

## [1.2.7] - 2023-05-25

- [#197](https://github.com/os2display/display-admin-client/pull/197)
  - Add pagination to tables below multiselect dropdowns.
- [#196](https://github.com/os2display/display-admin-client/pull/196)
  - Changed to handling rrule dates as UTC.
- [#194](https://github.com/os2display/display-admin-client/pull/195)
  - Fix button margin on mobile view.
- [#193](https://github.com/os2display/display-admin-client/pull/194)
  - Prevent screen-manager.js from redirecting before everything is saved.
- [#192](https://github.com/os2display/display-admin-client/pull/193)
  - Re-added and fixed cypress tests.

## [1.2.6] - 2023-05-11

- [#197](https://github.com/os2display/display-admin-client/pull/197)
  - Add pagination to tables below multiselect dropdowns.

## [1.2.5] - 2023-03-24

- [#191](https://github.com/os2display/display-admin-client/pull/191)
  - Fixed theme logo loading in slide preview.
  - Fixed error messages in slide manager.

## [1.2.4] - 2023-03-24

- [#190](https://github.com/os2display/display-admin-client/pull/190)
  - Changed config loader to avoid competing promises.
- [#189](https://github.com/os2display/display-admin-client/pull/189)
  - Fixed issue where playlist showed a maximum of 10 selected slides.

## [1.2.3] - 2023-03-07

- [#188](https://github.com/os2display/display-admin-client/pull/188)
  - Fixed template sorting.
  - Removed option to change template after creation
- [#187](https://github.com/os2display/display-admin-client/pull/187)
  - Added license.
- [#185](https://github.com/os2display/display-admin-client/pull/185)
  - Changed rich text defaultValue to avoid update loops.
  - Cleaned up rich text toolbar options.
- [#183](https://github.com/os2display/display-admin-client/pull/183)
  - Adds information about max file sizes.

## [1.2.2] - 2023-02-08

- [#184](https://github.com/os2display/display-admin-client/pull/184)
  - Fix logo upload, and change image uploader to use hook selected
- [#182](https://github.com/os2display/display-admin-client/pull/182)
  - Make cypress tests run 3 times in GA, and set defaultCommandTimeout to 10000
- [#181](https://github.com/os2display/display-admin-client/pull/181)
  - Disable selected menu link
- [#180](https://github.com/os2display/display-admin-client/pull/180)
  - Make it possible to delete media from slide
- [#179](https://github.com/os2display/display-admin-client/pull/179)
  - Simplify info modal, remove pagination

## [1.2.1] - 2023-01-13

- [#178](https://github.com/os2display/display-admin-client/pull/178)
  - Added 8080 to port to make cypresstests run
- [#177](https://github.com/os2display/display-admin-client/pull/177)
  - Css in name to cssstyles
- [#176](https://github.com/os2display/display-admin-client/pull/176)
  - Css -> cssstyles in all places but not the request body
- [#175](https://github.com/os2display/display-admin-client/pull/175)
  - Update proptypes
  - Rename cssstyles to css
  - Give resolution a default value

## [1.2.0] - 2023-01-05

- [#174](https://github.com/os2display/display-admin-client/pull/174)
  - Added changelog.
  - Added github action to enforce that PRs should always include an update of the changelog.
- [#172](https://github.com/os2display/display-admin-client/pull/172)
  - Fixed search issue for screens.
- [#171](https://github.com/os2display/display-admin-client/pull/171)
  - Moved to page 1 after deletions.
- [#170](https://github.com/os2display/display-admin-client/pull/170)
  - Fixed media library issue.
  - The css was not displayed in the theme page (create/edit).
  - Shared playlists in gantt are not clickable/do not redirect.
- [#169](https://github.com/os2display/display-admin-client/pull/169)
  - Updated docker setup to match new itkdev base setup
- [#168](https://github.com/os2display/display-admin-client/pull/168)
  - Fixed wrong link.
- [#167](https://github.com/os2display/display-admin-client/pull/167)
  - Updated grid generator from 1.0.6 -> 1.0.8.

## [1.1.0] - 2022-10-06

- [#166](https://github.com/os2display/display-admin-client/pull/166)
  - Updated react to 18.
- [#164](https://github.com/os2display/display-admin-client/pull/164)
  - Removed 0 in calendar view screen.

## [1.0.3] - 2022-09-05

- [#163](https://github.com/os2display/display-admin-client/pull/163)
  - Moved gantt chart to edit pages.
- [#162](https://github.com/os2display/display-admin-client/pull/162)
  - Added dropdown for resolution/orientation on screen.
  - Removed screen width/height.
- [#161](https://github.com/os2display/display-admin-client/pull/161)
  - Changed default duration from 10 to 15 s.
- [#159](https://github.com/os2display/display-admin-client/pull/159)
  - Refactored theme-manager (as the other elements have that as well, slide-manager e.g.).
  - Added logo to theme form.
  - Save theme logo.

## [1.0.2] - 2022-06-02

- [#158](https://github.com/os2display/display-admin-client/pull/158)
  - Added slide class to remote component.

## [1.0.1] - 2022-06-01

- [#157](https://github.com/os2display/display-admin-client/pull/157)
  - Changed class names to lower case.
- [#156](https://github.com/os2display/display-admin-client/pull/156)
  - Added check to station selector.

## [1.0.0] - 2022-05-18

- First release.
