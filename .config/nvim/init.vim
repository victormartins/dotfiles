" Victor Martins Martins

" must be set before polyglot is loaded to ignore languages that create
" problems. see: https://github.com/sheerun/vim-polyglot#troubleshooting
let g:polyglot_disabled = ['markdown.plugin']

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

source $HOME/.config/nvim/my-config/base_settings.vim
source $HOME/.config/nvim/my-config/file_associations.vim
source $HOME/.config/nvim/plug-config/coc.vim
source $HOME/.config/nvim/plug-config/vim_airline.vim
source $HOME/.config/nvim/plug-config/gruvbox.vim
source $HOME/.config/nvim/plug-config/emmet.vim

let g:indentLine_char = '¦'


" set the text delimiter horizontal column
set colorcolumn=120


" Enable file specific behaviour like syntax highlighting and indentation
filetype on
filetype plugin on
filetype indent on



" Fuzzy find files with the fzf Plugin
nnoremap <C-p> :GFiles<CR>
let g:fzf_layout = { 'window': {'width': 0.9, 'height': 0.8} }
let $FZF_DEFAULT_OPTS='--reverse'


" Vim Fugite keybindings
nmap <leader>gl :diffget //3<CR>
nmap <leader>gh :diffget //2<CR>
" open Git Status
nmap <leader>gs :G<CR>

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
