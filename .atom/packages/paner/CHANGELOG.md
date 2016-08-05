## 0.1.14
- FIX: Deprecation warning

## 0.1.13
- Refactoring
- Add spec

## 0.1.12
- Now `paner:split-right, left`, always respect ratio and scroll offset.

## 0.1.11
- Add paner:split command to split pane with keeping scrollTop.

## 0.1.10
- Update readme to follow vim-mode's command-mode to normal-mode

## 0.1.9 FIX
- `merge-item` bug.
- Refactoring
- Ensure to restore `core.destroyEmptyPanes` setting in case of error.
- Delete unused keymap file

## 0.1.8 FIX
- `activationCommands` did use old `merge-item`. Fix to `send-item`.

## 0.1.7 - Send and Merge, appropriate name.
- `merge-item` was confusing name. Now renamed to `send-item`.
- old `merge-item` behave send and activate item just sent.

## 0.1.6 - Merge PaneItem
- New command `paner:merge-item` to merge PaneItem.
- FIX when swapping item with empty Pane cause error.

## 0.1.5 - Improve
- Use activationCommands for faster startup

## 0.1.4 - Improve
* Update GIF
* Improve performance when clearing preview-tab

## 0.1.3 - Improve
* Rename clearPreviewForItem to clearPreviewTabForPane.
* Add Note for clearing preview-tab state.

## 0.1.2 - Support preview-pane
* Fix preview-pane issue #1

## 0.1.1 - Doc
* Delete commented codes.

## 0.1.0 - First Release