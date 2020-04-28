" Victor Martins

" https://github.com/junegunn/vim-plug
call plug#begin('~/.config/nvim/plugged')
Plug 'gruvbox-community/gruvbox'             " Color scheme
Plug 'mbbill/undotree'                       " Non linear undos
Plug 'dense-analysis/ale'                    " Language LINT (eg: Ruby, JS, CSS...)
Plug 'tpope/vim-commentary'                  " Use gcc to comment out a line or gc to comment a selection in visual mode
Plug 'jiangmiao/auto-pairs'                  " Insert or delete brackets, parens, quotes in pairs
" Plug 'ycm-core/YouCompleteMe'              " Autocomplete for many languages (Eg: Typescript)
Plug 'vim-ruby/vim-ruby'                     " Language Support for Rails
Plug 'tpope/vim-rails'                       " Language Support for Rails
Plug 'tpope/vim-endwise'                     " Language Support for Ruby - close end blocks automagically
Plug 'ap/vim-css-color'                      " Language Support - show CSS Colors
" Initialize plugin system
" Reload .vimrc (:so %) and :PlugInstall to install plugins.
call plug#end()

" Configure LINT languages
let g:ale_set_highlights = 0
let g:ale_linters = {
      \   'ruby':       ['standardrb', 'rubocop', 'reek', 'brakeman'],
      \   'javascript': ['eslint'],
      \   'jsx':        ['stylelint', 'eslint']
      \}

" Only run linters named in ale_linters settings.
let g:ale_linters_explicit = 1

let g:ale_linter_aliases = {'jsx': 'css'} " https://github.com/mlent/ale#5xi-how-can-i-check-jsx-files-with-both-stylelint-and-eslint

" autofix languages on save
let g:ale_fixers = {
      \    '*':    ['remove_trailing_lines', 'trim_whitespace'],
      \    'ruby': ['standardrb', 'rubocop'],
      \}

let g:ale_fix_on_save = 1
let g:ale_lint_on_enter = 0              " Make it faster
let g:ale_lint_on_insert_leave = 0       " Make it faster
let g:ale_lint_on_text_changed = 'never' " Make it faster
" let g:ale_open_list = 1                " Open the location list when we have Lint issues.
" let g:ale_keep_list_window_open = 1    " Keep the linting list open



let g:gruvbox_contrast_dark='hard'
let g:gruvbox_number_column='bg1'
let g:gruvbox_color_column='bg1'
let g:gruvbox_italic=1

colorscheme gruvbox
set background=dark

set termguicolors
syntax on
set nu
set nowrap
set backspace=2
set foldmethod=syntax
set encoding=UTF-8
set autoread
set wildmenu
set confirm
set nocompatible
set noerrorbells
set noswapfile
set smartcase
set incsearch
set updatetime=500
set cmdheight=2
set cursorline
set guicursor+=n-v-c:block-Cursor,i-ci-ve:block-blinkwait175-blinkoff150-blinkon175,r-cr-o:hor20  " use blinking block cursor when editing
let mapleader=' '



" Highlight matching pairs of brackets. Use the '%' character to jump between them.
set matchpairs+=<:>

" Display different types of white spaces.
set list
set listchars=tab:›\ ,trail:•,extends:#,nbsp:.



" tabs behaviour: https://tedlogan.com/techblog3.html
set tabstop=2 softtabstop=2
set shiftwidth=2       " use with << and >>
set expandtab          " convert from tab to spaces
set smartindent        " auto indentation


" backup strategy
set nobackup
set undodir=~/.vim/undodir " WARNING: this folder needs to be manually created
set undofile  " have a backup per file


" Enable file specific behaviour like syntax highlighting and indentation
filetype on
filetype plugin on
filetype indent on


" set the text delimiter horizontal column
set colorcolumn=120
" let &colorcolumn="80,".join(range(120,999),",") " adds the 80 column and a 120 and above block
highlight ColorColumn ctermbg=235 guibg=#2c2d27


nnoremap <leader>h :wincmd h<CR>
nnoremap <leader>j :wincmd j<CR>
nnoremap <leader>k :wincmd k<CR>
nnoremap <leader>l :wincmd l<CR>
nnoremap <leader>u :UndotreeShow<CR>

nnoremap <Up> :resize +2<CR>
nnoremap <Down> :resize -2<CR>
nnoremap <Left> :vertical resize +2<CR>
nnoremap <Right> :vertical resize -2<CR>


" Auto File Update Timer  -------------------------------------
" This timmer will check the files for change outside VIM and update them.
if ! exists("g:CheckUpdateStarted")
    let g:CheckUpdateStarted=1
    call timer_start(1,'CheckUpdate')
endif
function! CheckUpdate(timer)
    silent! checktime
    call timer_start(1000,'CheckUpdate')
endfunction
" END Auto File Update Timer  -------------------------------------
