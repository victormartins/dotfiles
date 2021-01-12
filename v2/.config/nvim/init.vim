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
source $HOME/.config/nvim/my-config/file_type_associations.vim

let mapleader=' '

" change split. to vertical or to horizontal
map <leader>th <C-w>t<C-w>H
map <leader>tk <C-w>t<C-w>K

