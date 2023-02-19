-- Commands to copy the current file path to the register
-- eg:
-- :CopyRelativePath         returns: lua/victormartins/copy_file_paths.lua
-- :CopyRelativePathAndLine  returns: lua/victormartins/copy_file_paths.lua:4
-- :CopyAbsolutePath         returns: /Users/victormartins/dotfiles/.config/nvim/lua/victormartins/copy_file_paths.lua
-- :CopyAbsolutePathAndLine  returns: /Users/victormartins/dotfiles/.config/nvim/lua/victormartins/copy_file_paths.lua:6
-- :CopyFileName             returns: copy_file_paths.lua
-- :CopyDirectoryPath        returns: /Users/victormartins/dotfiles/.config/nvim/lua/victormartins
--
-- Script from https://github.com/AdamWhittingham/vim-copy-filename/blob/master/plugin/copy-filepath.vim

vim.cmd [[
  function! SetGlobalCopyBuffer(content)
    if (has("mac") && has("gui")) || has("gui_macvim") || has("gui_mac") || has("windows")
      let @*=a:content
    else
      let @+=a:content
    endif
  endfunction

  function! CopyRelativePath()
    call SetGlobalCopyBuffer(expand("%"))
    echo 'Relative path copied'
  endfunction
  command! CopyRelativePath :call CopyRelativePath()

  function! CopyRelativePathAndLine()
    call SetGlobalCopyBuffer(expand("%") . ":" . line('.'))
    echo 'Relative path and line copied'
  endfunction
  command! CopyRelativePathAndLine :call CopyRelativePathAndLine()

  function! CopyAbsolutePath()
    call SetGlobalCopyBuffer(expand("%:p"))
    echo 'Absolute path copied'
  endfunction
  command! CopyAbsolutePath :call CopyAbsolutePath()

  function! CopyAbsolutePathAndLine()
    call SetGlobalCopyBuffer(expand("%:p") . ":" . line('.'))
    echo 'Absolute path and line copied'
  endfunction
  command! CopyAbsolutePathAndLine :call CopyAbsolutePathAndLine()

  function! CopyFileName()
    call SetGlobalCopyBuffer(expand("%:t"))
    echo 'File name copied'
  endfunction
  command! CopyFileName :call CopyFileName()

  function! CopyDirectoryPath()
    call SetGlobalCopyBuffer(expand("%:p:h"))
    echo 'Directory path copied'
  endfunction
  command! CopyDirectoryPath :call CopyDirectoryPath()
]]
