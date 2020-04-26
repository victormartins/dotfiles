" Victor Martins

" https://github.com/junegunn/vim-plug
call plug#begin('~/.vim/plugged')
Plug 'morhetz/gruvbox'                       " Color scheme
Plug 'mbbill/undotree'                       " Non linear undos
" Initialize plugin system
" Reload .vimrc (:so %) and :PlugInstall to install plugins.
call plug#end()


" Set Color Scheme
let g:gruvbox_contrast_dark='hard'
let g:gruvbox_number_column='bg1'
let g:gruvbox_color_column='bg1'
let g:gruvbox_italic=1
colorscheme gruvbox
set background=dark

set encoding=UTF-8
set nocompatible
set noerrorbells
set noswapfile
set smartcase
set incsearch
set updatetime=500
set cmdheight=2
let mapleader=' '

syntax on
set nu
set nowrap
set backspace=2
set foldmethod=syntax


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
