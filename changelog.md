# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 25-01-2024

### Breaking Change

#### Changed .gform_fields to be div elements rather than UL

Refactored UL & LI tags in the main .gform_fields & .gfield to be divs, following how Gravity Forms handles elements.

This _may_ mean styling gets broken, depending on how CSS has been set up.

### Fixed

- Recaptcha now correctly stopped form submittion.

### Added

- Support for a honeypoy
- Multiselect with React Select for Enhanced UI option
- Option to customize strings (errors, built in labels) allowing for translation
- Section field
- packageManager to package.json to allow consistant linking

## [0.1.40] - 29-12-2023

### Added

- Confirmation email functionality.
