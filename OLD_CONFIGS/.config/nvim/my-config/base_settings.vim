let mapleader=' '
set termguicolors
syntax on
set number relativenumber
set nowrap
set backspace=2
set encoding=UTF-8
set autoread
set wildmenu
set confirm
set nocompatible
set noerrorbells
set noswapfile
set incsearch
set updatetime=300
set cmdheight=2
set cursorline
set guicursor+=n-v-c:block-Cursor,i-ci-ve:block-blinkwait175-blinkoff150-blinkon175,r-cr-o:hor20  " use blinking block cursor when editing


" folding configurations
set foldmethod=syntax
set foldlevel=3


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
set undodir=$HOME/.config/nvim/undodir " WARNING: this folder needs to be manually created
set undofile  " have a backup per file


" set the text delimiter horizontal column
set colorcolumn=120
" let &colorcolumn="80,".join(range(120,999),",") " adds the 80 column and a 120 and above block
highlight ColorColumn ctermbg=235 guibg=#2c2d27
