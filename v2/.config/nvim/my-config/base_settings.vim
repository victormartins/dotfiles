" set termguicolors      " Enables 24-bit RGB color in the TUI.


" When we do "vim ." to open vim in a directory, it will source any .vimrc inside that directory
set exrc

" use blinking block cursor when editing
set guicursor+=n-v-c:block-Cursor,i-ci-ve:block-blinkwait175-blinkoff150-blinkon175,r-cr-o:hor20  

" tabs behaviour: https://tedlogan.com/techblog3.html
set tabstop=2 softtabstop=2
set shiftwidth=2       " use with << and >>
set expandtab          " convert from tab to spaces
set smartindent        " auto indentation


set nowrap
set updatetime=50         " Make vim more responsive
set number relativenumber " Show line numbers
set nohlsearch            " remove highlight after copy seach
set hidden                " keep unsaved buffers in the background
set noerrorbells          " peace and quiet
set incsearch             " highlight as we search
set scrolloff=8           " always keep a few lines bellow/above when scrolling
set cursorline            " highlight the current cursor line
set splitbelow splitright " Where new splits show up
set shortmess+=c          " Don't pass messages to |ins-completion-menu|.
set cmdheight=2           " Extra space for messages
set autoread              " Detect file changes and read them
set confirm               " Ask to confirm commands like "qa"

" backup strategy
set noswapfile
set nobackup
set nowritebackup
set undodir=$HOME/.config/nvim/undodir " WARNING: this folder needs to be manually created
set undofile  " have a backup per file


" Always show the signcolumn, otherwise it would shift the text each time
" diagnostics appear/become resolved.
set signcolumn=yes

" set the text delimiter horizontal column
set colorcolumn=120
" let &colorcolumn="80,".join(range(120,999),",") " adds the 80 column and a 120 and above block
highlight ColorColumn ctermbg=235 guibg=#2c2d27




" Highlight matching pairs of brackets. Use the '%' character to jump between them.
set matchpairs+=<:>

" Display different types of white spaces.
set list
set listchars=tab:›\ ,trail:•,extends:#,nbsp:.


syntax on
" Enable file specific behaviour like syntax highlighting and indentation
filetype on
filetype plugin on
filetype indent on
