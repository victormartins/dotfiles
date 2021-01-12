" Victor Martins Martins

" must be set before polyglot is loaded to ignore languages that create
" problems. see: https://github.com/sheerun/vim-polyglot#troubleshooting
let g:polyglot_disabled = ['markdown.plugin']

" https://github.com/junegunn/vim-plug
call plug#begin('~/.config/nvim/plugged')
Plug 'gruvbox-community/gruvbox'                " Color scheme
Plug 'jeffkreeftmeijer/vim-numbertoggle'        " toggle relative numbering in vim

" Initialize plugin system
" Reload current file (:so %) and :PlugInstall to install plugins.
call plug#end()

source $HOME/.config/nvim/my-config/base_settings.vim
source $HOME/.config/nvim/my-config/file_type_associations.vim

let mapleader=' '
source $HOME/.config/nvim/my-config/keybinding_splits.vim

" Move lines up and down in visual mode
vnoremap J :m '>+1<CR>gv=gv
vnoremap K :m '<-2<CR>gv=gv

" Vim Fugite keybindings
nmap <leader>gl :diffget //3<CR>
nmap <leader>gh :diffget //2<CR>
" open Git Status
nmap <leader>gs :G<CR>
