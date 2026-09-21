[![License](https://img.shields.io/badge/license-Public%20Domain-blue.svg)](https://github.com/pqrs-org/disable-draganddrop-tb/blob/main/LICENSE.md)

# Disable DragAndDrop

A Thunderbird add-on which disables drag and drop on the folder tree in order to prevent unintended folder movement.

<https://disable-draganddrop-tb.pqrs.org>

## How to build

```shell
npm install
make
```

## About strict_max_version

The code in this repository explicitly sets `strict_max_version`.
This is required because extensions that use `experiment_apis` cannot pass review on the add-on site without specifying `strict_max_version`.
If you build the extension yourself, manually set `strict_max_version` to `*` before building.

The XPI distributed through the official add-on site is kept compatible with the latest version of Thunderbird.
This is possible because the site allows the `strict_max_version` compatibility information for reviewed add-ons to be overridden with `*`, and we use this mechanism for this extension.

References:

- [Mozilla Bugzilla: Bug 1986027, Comment 10](https://bugzilla.mozilla.org/show_bug.cgi?id=1986027#c10) — Explains how Thunderbird updates its compatibility information when the maximum supported version is increased on ATN.
- [Firefox Extension Workshop: Updating your extension](https://extensionworkshop.com/documentation/manage/updating-your-extension/#update-objects) — Documents how compatibility information provided in an update overrides that of an installed extension with the same version number (documentation for Firefox).
