" Victor Martins Martins

" https://github.com/junegunn/vim-plug
call plug#begin('~/.config/nvim/plugged')
Plug 'gruvbox-community/gruvbox'                " Color scheme
Plug 'jeffkreeftmeijer/vim-numbertoggle'        " toggle relative numbering in vim
Plug 'neoclide/coc.nvim', {'branch': 'release'} " The power of Completion
Plug 'junegunn/fzf.vim'                         " The power of Fuzzy Finder
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'mbbill/undotree'                          " Non linear undos
Plug 'tpope/vim-repeat'                         " Repeat some plugins with . command (eg: vim-surround)
Plug 'tpope/vim-commentary'                     " Use gcc to comment out a line or gc to comment a selection in visual mode
Plug 'tpope/vim-eunuch'                         " Delete, Rename, Move files and much more
Plug 'tpope/vim-obsession'                      " Save vim sessions before exit
Plug 'tpope/vim-surround'                       " Custom Operator - Handle the surrounding things :)
Plug 'kana/vim-textobj-user'                    " Custom Text Object - How to create custom text objects. (Dependency for vim-textobj-ruby)
Plug 'rhysd/vim-textobj-ruby'                   " Custom Text Object - Ruby (r)
Plug 'michaeljsmith/vim-indent-object'          " Custom Text Object - indentations (i)
Plug 'Yggdroot/indentLine'                      " Show the indentation lines
Plug 'sheerun/vim-polyglot'                     " Language Support for the Win
Plug 'tpope/vim-rails'                          " Language Support for Rails
Plug 'tpope/vim-endwise'                        " Language Support for Ruby - close end blocks automagically
Plug 'ap/vim-css-color'                         " Language Support - show CSS Colors
Plug 'mattn/emmet-vim'                          " Language Support Emmet

Plug 'godlygeek/tabular'                        " Align things together http://vimcasts.org/episodes/aligning-text-with-tabular-vim/
" Plug 'plasticboy/vim-markdown'                " Language Support for Markdown DEPENDS OF godlygeek/tabular
Plug 'mzlogin/vim-markdown-toc'                 " Language Support for Markdown - Generate table of contents
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app & yarn install' } " Preview for Markdown TODO: Install nodejs and yarn

Plug 'tpope/vim-fugitive'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

" Initialize plugin system
" Reload .vimrc (:so %) and :PlugInstall to install plugins.
call plug#end()

set termguicolors

source $HOME/.config/nvim/my-config/file_associations.vim
source $HOME/.config/nvim/plug-config/coc.vim
source $HOME/.config/nvim/plug-config/vim_airline.vim
source $HOME/.config/nvim/plug-config/gruvbox.vim
source $HOME/.config/nvim/plug-config/emmet.vim

let g:indentLine_char = '¦'

syntax on
set number relativenumber
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
set updatetime=300
set cmdheight=2
set cursorline
set guicursor+=n-v-c:block-Cursor,i-ci-ve:block-blinkwait175-blinkoff150-blinkon175,r-cr-o:hor20  " use blinking block cursor when editing
let mapleader=' '

" set the text delimiter horizontal column
set colorcolumn=120

" Don't pass messages to |ins-completion-menu|.
set shortmess+=c

" Always show the signcolumn, otherwise it would shift the text each time
" diagnostics appear/become resolved.
set signcolumn=yes


" Highlight matching pairs of brackets. Use the '%' character to jump between them.
set matchpairs+=<:>

" Display different types of white spaces.
set list
set listchars=tab:›\ ,trail:•,extends:#,nbsp:.

" Splits
set splitbelow splitright
" change split. to vertical or to horizontal
map <leader>th <C-w>t<C-w>H
map <leader>tk <C-w>t<C-w>K


" tabs behaviour: https://tedlogan.com/techblog3.html
set tabstop=2 softtabstop=2
set shiftwidth=2       " use with << and >>
set expandtab          " convert from tab to spaces
set smartindent        " auto indentation


" backup strategy
set nobackup
set nowritebackup
set undodir=~/.vim/undodir " WARNING: this folder needs to be manually created
set undofile  " have a backup per file


" Enable file specific behaviour like syntax highlighting and indentation
filetype on
filetype plugin on
filetype indent on



" Fuzzy find files with the fzf Plugin
nnoremap <C-p> :GFiles<CR>

nnoremap <leader>h :wincmd h<CR>
nnoremap <leader>j :wincmd j<CR>
nnoremap <leader>k :wincmd k<CR>
nnoremap <leader>l :wincmd l<CR>
nnoremap <leader>u :UndotreeShow<CR>

nnoremap <Up> :resize -2<CR>
nnoremap <Down> :resize +2<CR>
nnoremap <Left> :vertical resize +2<CR>
nnoremap <Right> :vertical resize -2<CR>

" Move lines up and down in visual mode
vnoremap J :m '>+1<CR>gv=gv
vnoremap K :m '<-2<CR>gv=gv

" Ctrl+/ to clear the last search
noremap <silent> <c-_> :let @/ = ""<CR>

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


fun! TrimWhitespace()
    let l:save = winsaveview()
    keeppatterns %s/\s\+$//e
    call winrestview(l:save)
endfun

autocmd BufWritePre * :call TrimWhitespace()
