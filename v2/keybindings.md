# VIM
## TO LEARN
- How to see the documentation of a given Ruby class and scroll the documentation

## Utils
### Print HTML
With a document open and syntax run command `:TOhtml`.
A html document will be generated that can be used to print the code.

### Write/Read Markup
We need these plugins
```
Plug 'mzlogin/vim-markdown-toc'                                        " Language Support for Markdown - Generate table of contents
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app & yarn install' } " Preview for Markdown TODO: Install nodejs and yarn
```

To read markup, open a markup file and run `:MarkdownPreview`.
Write `[TOC]` on the top of the document to see an auto generated Table of Contents


## Macros
Steps:
1 - Start the macro:
  - Put the cursor on the line we want to edit.
  - Press `q<some_letter>` to start the marco. Eg: `qa`
  - We should now read `recording @a` in the bottom.
2 - Do the work.
3 - End the macro:
  - Press `q`
4 - Play the macro:
  - Press `@<letter_with_macro>`. Eg: `@a`


## Buffers
- `:BOnly` - Close all buffers expect current. (added by: `Plug 'schickling/vim-bufonly'`)

## Select
### Code
- `vii` - Select inside block
- `viI` - Select inside block and wrapper

## Github (Plugin Vim Fugitive)
- `leader gs` - Open git status
- `s` - Stage
- `u` - UnStage
- `cc` - (Inside git status) commit
- `cc` - (Inside git status) commit -ammend

## Splits
~/dotfiles/v2/.config/nvim/my-config/keybinding_splits.vim
- `leader + th`   - change split to vertical
- `leader + tk`   - change split to horizontal
- `ctrl + w then |` expand view horizontally
- `ctrl + w then _` expand view vertically
- `ctrl + w then =` normalise splits

## Tabs
- `:tabs`     - List Tabs
- `:tabnew`     - Create New tab
- `:tabp`       - Go to previous Tab
- `:tabNext`    - Go to next tab
- `{count}gt`   -  Go to tab page {count}.

## Folding
- `zM` - Close all folds
- `zm` - Increase Folding by 1
- `zr` - Reduce Folding by 1
- `zR` - Open all folds
- `zA` - Toggle Folding All under cursor
- `za` - Toggle Folding Section under cursor
- `:set foldlevel=3` - Set fold level

# Amethyst
```
mod1 = Shift + Option
mod2 = Shift + Option + Ctrl

mod1 + t      Toggle Floating/Tilling
mod1 + Enter  Swap focus window to Main

mod1 + space  cycle to next layout
mod2 + space  cycle to next layout backwards
mod2 + A      Tall Layout
mod2 + S      Middle Column
mod2 + D      Fullscreen Layout
mod2 + W      Wide Layout

mod1 + K      Move Focus Clock Wise
mod1 + J      Move Focus Counter Clock Wise
mod2 + K      Swap Focus Window Clock Wise
mod2 + J      Move Focus Window Counter Clock Wise

mod1 + L      Expand
mod1 + H      Shrink

mod2 + O      Move Focus to other Screen Clockwise
mod2 + L      Swap Focus Window to Next Screen Clock Wise
mod2 + H      Swap Focus Window to Next Screen Counter Clock Wise
```
