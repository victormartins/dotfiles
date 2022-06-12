vim.cmd [[
  fun! TrimWhitespace()
      let l:save = winsaveview()
      keeppatterns %s/\s\+$//e
      call winrestview(l:save)
  endfun

  augroup clean_white_space
      autocmd!
      autocmd BufWritePre * :call TrimWhitespace()
      " autocmd VimEnter * :VimApm
      autocmd BufEnter,BufWinEnter,TabEnter *.rs :lua require'lsp_extensions'.inlay_hints{}
  augroup END
]]
