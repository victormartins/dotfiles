" VIM Configuration - Victor Martins
"
" References:
" * ThePrimeagen - Your first VimRC
"     https://www.youtube.com/watch?v=n9k9scbTuvQ
" * Vim for Ruby and Rails 2019
"     https://www.vimfromscratch.com/articles/vim-for-ruby-and-rails-in-2019/

" Basic defaults
syntax on " Enable syntax highlighting
set noerrorbells
set nu								 " set line numbers
set smartcase					 " case sensitive searching
set noswapfile
set incsearch					 " get search results while we type. start with '/' then press enter then keep pressing 'n'
set updatetime=150     " Update UI frequency .defaults to 4000 (4s). https://github.com/airblade/vim-gitgutter#getting-started
let mapleader = " "    " Trigger key modifications. Search bellow

" backup strategy
set nobackup
set undodir=~/.vim/undodir " WARNING: this folder needs to be manually created
set undofile							 " have a backup per file

" text options
set nowrap

" tabs behaviour: https://tedlogan.com/techblog3.html
set tabstop=2 softtabstop=2
set shiftwidth=2       " use with << and >>
set expandtab          " convert from tab to spaces
set smartindent				 " auto indentation


" Enable file specific behaviour like syntax highlighting and indentation
filetype on
filetype plugin on
filetype indent on

" set the text delimiter horizontal column
set colorcolumn=120
" let &colorcolumn="80,".join(range(120,999),",") " adds the 80 column and a 120 and above block
 highlight ColorColumn ctermbg=235 guibg=#2c2d27


" Plugins: https://github.com/junegunn/vim-plug
" Specify a directory for plugins
" - For Neovim: stdpath('data') . '/plugged'
" - Avoid using standard Vim directory names like 'plugin'
call plug#begin('~/.vim/plugged')
Plug 'morhetz/gruvbox'                       " Color scheme
Plug 'vim-utils/vim-man'                     " Manual
Plug 'jremmen/vim-ripgrep'                   " Very fast search
Plug 'tpope/vim-fugitive'                    " Git Wrapper
Plug 'mbbill/undotree'                       " Non linear undos
Plug 'git@github.com:kien/ctrlp.vim.git'     " Full path fuzzy file, buffer, mru, tag, ... finder for Vim
Plug 'preservim/nerdtree'                    " File System Explorer
Plug 'Xuyuanp/nerdtree-git-plugin'           " Git Markers for Nerdtree
Plug 'vim-airline/vim-airline'               " Status bar bellow VIM
Plug 'vim-airline/vim-airline-themes'
Plug 'airblade/vim-gitgutter'                " (slow) Show the git status of each file on the next to line numbers
Plug 'ycm-core/YouCompleteMe'                " Autocomplete for many languages (Eg: Typescript)
Plug 'dense-analysis/ale'                    " Language LINT (eg: Ruby, JS, CSS...)
Plug 'tpope/vim-commentary'                  " Use gcc to comment out a line or gc to comment a selection in visual mode
Plug 'jiangmiao/auto-pairs'                  " Insert or delete brackets, parens, quotes in pairs
Plug 'leafgarland/typescript-vim'            " Language Support for TypeScript
Plug 'tpope/vim-rails'                       " Language Support for Rails
Plug 'tpope/vim-endwise'                     " Language Support for Ruby - close end blocks automagically
" To learn:
" Plug 'neoclide/coc.nvim', {'branch': 'release'}
"
" Initialize plugin system
" Reload .vimrc (:so %) and :PlugInstall to install plugins.
call plug#end()

" Config Plugins ----------------
let NERDTreeShowHidden=1

" Config vim-fugitive to find the git root and use the gitignore for faster
" searching
if executable('rg')
  let g:rg_derive_root='true'
endif

" ignore files from ctrlp search
let g:ctrlp_user_command = ['.git/', 'git --git-dir=%s/.git ls-files -oc --exclude-standard']
" disable caching from ctrlp since its fast enough
let g:ctrlp_user_caching=0

" Configure LINT languages
let g:ale_linters = {
      \   'ruby':       ['standardrb', 'rubocop', 'reek', 'brakeman'],
      \   'javascript': ['eslint'],
      \   'jsx':        ['stylelint', 'eslint']
      \}

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

" TODO: Install https://github.com/powerline/fonts
let g:airline_powerline_fonts = 1             " https://github.com/vim-airline/vim-airline#integrating-with-powerline-fonts
let g:airline#extensions#ale#enabled = 1      " https://github.com/dense-analysis/ale#5v-how-can-i-show-errors-or-warnings-in-my-statusline
let g:airline#extensions#tabline#formatter = 'unique_tail_improved'

" END Config Plugins -------------

" Set Color Scheme
let g:gruvbox_contrast_dark='hard'
let g:gruvbox_number_column='bg1'
let g:gruvbox_color_column='bg1'
colorscheme gruvbox
set background=dark

" Key Modifications
nnoremap <leader>u :UndotreeShow<CR>