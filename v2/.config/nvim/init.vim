" Victor Martins

" must be set before polyglot is loaded to ignore languages that create
" problems. see: https://github.com/sheerun/vim-polyglot#troubleshooting
let g:polyglot_disabled = ['markdown.plugin']

" https://github.com/junegunn/vim-plug
call plug#begin('~/.config/nvim/plugged')
Plug 'gruvbox-community/gruvbox'                " Color scheme
Plug 'jeffkreeftmeijer/vim-numbertoggle'        " toggle relative numbering in vim
Plug 'mbbill/undotree'                          " Non linear undos
Plug 'tpope/vim-repeat'                         " Repeat some plugins with . command (eg: vim-surround)
Plug 'tpope/vim-commentary'                     " Use gcc to comment out a line or gc to comment a selection in visual mode
Plug 'tpope/vim-eunuch'                         " Delete, Rename, Move files and much more
Plug 'tpope/vim-obsession'                      " Save vim sessions before exit
Plug 'tpope/vim-surround'                       " Custom Operator - Handle the surrounding things :)
Plug 'kana/vim-textobj-user'                    " Custom Text Object - How to create custom text objects. (Dependency for vim-textobj-ruby)
Plug 'rhysd/vim-textobj-ruby'                   " Custom Text Object - Ruby (r)
Plug 'michaeljsmith/vim-indent-object'          " Custom Text Object - indentations (i)
Plug 'sheerun/vim-polyglot'                     " Language Support for the Win
Plug 'tpope/vim-rails'                          " Language Support for Rails
Plug 'tpope/vim-endwise'                        " Language Support for Ruby - close end blocks automagically
Plug 'ap/vim-css-color'                         " Language Support - show CSS Colors
Plug 'mattn/emmet-vim'                          " Language Support Emmet
Plug 'tpope/vim-fugitive'
Plug 'neoclide/coc.nvim', {'branch': 'release'} " The power of Completion
Plug 'vimwiki/vimwiki'                          " VimWiki FTW
Plug 'schickling/vim-bufonly'                   " Close all others buffers with :BOnly
Plug 'brooth/far.vim'                           " Find and replace project wide
Plug 'justinmk/vim-sneak'                       " Quickly goto text
Plug 'honza/vim-snippets'                       " Snippts FTW
Plug 'tribela/vim-transparent'                  " Allow background transparency( :TransparentToggle)


Plug 'mzlogin/vim-markdown-toc'                 " Language Support for Markdown - Generate table of contents
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app & yarn install' } " Preview for Markdown TODO: Install nodejs and yarn

Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'                         " The power of Fuzzy Finder


" WARNING: Vim Airline breaks the color of the StatusLine and StatusLineNC
" Plug 'vim-airline/vim-airline'
" Plug 'vim-airline/vim-airline-themes'

" Initialize plugin system
" Reload current file (:so %) and :PlugInstall to install plugins.
call plug#end()

source $HOME/.config/nvim/my-config/base_settings.vim
source $HOME/.config/nvim/my-config/file_type_associations.vim

" source $HOME/.config/nvim/plug-config/vim_airline.vim
source $HOME/.config/nvim/plug-config/emmet.vim
source $HOME/.config/nvim/plug-config/gruvbox.vim
source $HOME/.config/nvim/plug-config/vimwiki.vim
source $HOME/.config/nvim/plug-config/fzf.vim
source $HOME/.config/nvim/plug-config/sneak.vim
source $HOME/.config/nvim/plug-config/snippets.vim

let mapleader=' '
source $HOME/.config/nvim/my-config/keybinding_splits.vim

" Move lines up and down in visual mode
vnoremap J :m '>+1<CR>gv=gv
vnoremap K :m '<-2<CR>gv=gv

nnoremap <leader>u :UndotreeShow<CR>

" Vim Fugite keybindings
" gl is get changes from the right
" gh is get changes from the left
nmap <leader>gl :diffget //3<CR>
nmap <leader>gh :diffget //2<CR>
" open Git Status
nmap <leader>gs :G<CR>




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
