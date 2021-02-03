" Fuzzy find files with the fzf Plugin
nnoremap <C-p> :GFiles<CR>
nnoremap <C-g> :Rg<CR>
nnoremap <C-b> :BLines<CR>
let g:fzf_layout = { 'window': {'width': 0.9, 'height': 0.8} }
let $FZF_DEFAULT_OPTS='--reverse'
