let g:airline#extensions#tabline#enabled = 1
let g:airline#extensions#tabline#formatter = 'unique_tail_improved'
let g:airline_powerline_fonts = 1
let g:airline_theme='base16_gruvbox_dark_hard'
let g:airline_detect_spell=1
let g:airline_detect_spelllang=1

" Use this to fix problems with the preview window
"  let g:airline_exclude_preview = 0


let g:airline_inactive_collapse=0
let g:airline_inactive_alt_sep=1

function! s:update_highlights()
  " hi StatusLine   cterm=none guifg=#B8BB26 guibg=#282828
  " hi StatusLineNC cterm=none guifg=#689D6A guibg=#282828
  " hi CursorLine ctermbg=none guibg=none
  " hi VertSplit ctermbg=none guibg=none
endfunction
autocmd User AirlineAfterTheme call s:update_highlights()
