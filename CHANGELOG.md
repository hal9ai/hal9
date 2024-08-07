# Changelog

## 2.6.4

- `deploy` supports `--access` to share private, public or unlisted

## 2.6.2

- `save()` now stores data under `/storage` to isolate files

## 2.6.1

- Add `complete()` and `describe()` to support handling tools

## 2.5.7

- `save()` supports creating subfolders

## 2.5.5

- `extract()` supports extracting all files from code blocks using `filename` markdown header

## 2.5.2

- Add `default` parameter to `extract()` to return default when code not found

## 2.5.1

- Add support for `files` in `save()` to persist multiple files

## 2.4.3

- Add `--data` to CLI

## 2.4.1

- Add support for `--data` in deployment

## 2.4.0

- Add support for `pkl` files extensions

## 2.3.9

- Print version with `--version`

## 2.3.8

- Fix deployment from notebooks

## 2.3.7

- Added `event` function to append application event

## 2.3.2

- Added `is_url` and `url_contents` to assist URL processing

## 2.2.6

- Add `hidden` parameter to `save` to save file as hidden

## 2.2.4

- Add helper function `extract` to extract code blocks

## 2.2.3

- Only add extensions to `save` and `load` when needed

## 2.2.0

- Add support for name parameter in deploy to overwrite content

## 2.1.8

- Add support for `load`, `save` functions

## 2.0.0

- Create and deploy projects