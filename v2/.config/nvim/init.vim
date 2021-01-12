" Victor Martins Martins

" must be set before polyglot is loaded to ignore languages that create
" problems. see: https://github.com/sheerun/vim-polyglot#troubleshooting
let g:polyglot_disabled = ['markdown.plugin']

" https://github.com/junegunn/vim-plug
call plug#begin('~/.config/nvim/plugged')
Plug 'gruvbox-community/gruvbox'                " Color scheme

" Initialize plugin system
" Reload current file (:so %) and :PlugInstall to install plugins.
call plug#end()

source $HOME/.config/nvim/my-config/base_settings.vim

let mapleader=' '
